import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import ImageCarousel from "@/components/ImageCarousel";
import RelatedCards from "@/components/RelatedCards";
import { pageMetadata } from "@/lib/seo";
import { listNewsPosts } from "@/lib/db/queries";
import {
  getNewsPost,
  getNewsPosts,
  newsSlug,
  type NewsPostItem,
} from "@/lib/news";

/**
 * Une actualité : celle du catalogue éditorial (`lib/news.ts`) ou, à défaut,
 * celle publiée depuis le dashboard (slug dérivé du titre français).
 */
async function resolvePost(
  locale: string,
  slug: string
): Promise<NewsPostItem | null> {
  const editorial = getNewsPost(locale, slug);
  if (editorial) return editorial;

  // La base peut être absente : le site public ne doit jamais en dépendre.
  const rows = await listNewsPosts(true).catch(() => []);
  const row = rows.find((item) => newsSlug(item.title_fr) === slug);
  if (!row) return null;

  const isEn = locale === "en";
  const content = (isEn ? row.content_en : row.content_fr) ?? "";
  return {
    slug,
    date: isEn ? row.date_label_en : row.date_label_fr,
    title: isEn ? row.title_en : row.title_fr,
    image: row.image_url ?? "/hero_section/hero-3.png",
    body: content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
}

export function generateStaticParams() {
  return getNewsPosts("fr").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await resolvePost(locale, slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} | GOSTA TRANS Logistique et BTP`,
    description: post.body[0] ?? post.title,
    pathname: `/actualites/${slug}`,
    locale,
    images: [post.image],
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await resolvePost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("home.news");
  // Trois autres actualités éditoriales, sans l'article courant.
  const others = getNewsPosts(locale)
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <main>
      <Header />

      {/* ===== Bandeau : visuel de l'article, date et titre ===== */}
      <div className="relative z-10 -mt-[var(--header-h)]">
        <section className="relative flex min-h-[clamp(22rem,52svh,34rem)] flex-col justify-end overflow-hidden bg-[var(--navy-deep)]">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-[calc(var(--header-h)+4rem)] pb-12">
            <a
              href={`/${locale}/#actualites`}
              className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-white/70 hover:text-[var(--amber)] transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              {t("back")}
            </a>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--amber)] mt-6">
              {post.date}
            </p>
            <h1 className="font-display font-extrabold text-white leading-[1.06] text-[clamp(1.6rem,4.2vw,3rem)] mt-3 [text-wrap:balance]">
              {post.title}
            </h1>
          </div>
        </section>
      </div>

      {/* ===== Corps de l'article ===== */}
      <article className="bg-[var(--white-warm)]">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <div className="space-y-5">
            {post.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[17px] leading-[1.8] text-[var(--steel)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-10 overflow-hidden rounded-2xl">
              <ImageCarousel
                images={post.gallery}
                alt={post.title}
                heightClass="h-[58svh] md:h-[64svh]"
              />
            </div>
          )}
        </div>
      </article>

      <RelatedCards
        heading={t("other")}
        cta={t("readMore")}
        items={others.map((item) => ({
          href: `/actualites/${item.slug}`,
          title: item.title,
          meta: item.date,
          image: item.image,
        }))}
      />

      <CTASection />
      <Footer />
    </main>
  );
}

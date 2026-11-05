import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import BrushUnderline from "@/components/BrushUnderline";
import Pagination from "@/components/Pagination";
import { Link } from "@/i18n/navigation";
import { getNewsPosts, newsSlug } from "@/lib/news";
import { listNewsPosts } from "@/lib/db/queries";
import { pageMetadata } from "@/lib/seo";

// Nombre d'actualités par page (3 colonnes × 3 rangées).
const PER_PAGE = 9;

type IndexCard = {
  slug: string;
  date: string;
  title: string;
  image: string;
  excerpt: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news.hub" });
  return pageMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    pathname: "/actualites",
    locale,
  });
}

export default async function NewsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("news.hub");
  const isEn = locale === "en";

  // Les actualités éditoriales, puis celles publiées depuis le dashboard (la
  // base peut être absente : le site public ne doit jamais en dépendre).
  const editorial: IndexCard[] = getNewsPosts(locale).map((post) => ({
    slug: post.slug,
    date: post.date,
    title: post.title,
    image: post.image,
    excerpt: post.body[0] ?? "",
  }));

  const fromDashboard = await listNewsPosts(true).catch(() => []);
  const extra: IndexCard[] = fromDashboard
    .map((row) => ({
      slug: newsSlug(row.title_fr),
      date: isEn ? row.date_label_en : row.date_label_fr,
      title: isEn ? row.title_en : row.title_fr,
      image: row.image_url ?? "/hero_section/hero-3.png",
      excerpt: ((isEn ? row.content_en : row.content_fr) ?? "")
        .split(/\n{2,}/)[0]
        .trim(),
    }))
    .filter((post) => post.slug && !editorial.some((item) => item.slug === post.slug));

  const posts = [...editorial, ...extra];
  // Pagination : une page par groupe de PER_PAGE, paramètre `?page=` borné.
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const parsed = Number.parseInt(pageParam ?? "1", 10);
  const current = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, 1), totalPages)
    : 1;
  const visible = posts.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <main>
      <Header />

      {/* ===== Bandeau : même photo pleine largeur que les autres hubs ===== */}
      <section className="relative bg-[var(--navy-deep)] overflow-hidden -mt-[var(--header-h)]">
        <Image
          src="/hero_section/hero-1.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-6 pt-[calc(var(--header-h)+5rem)] md:pt-[calc(var(--header-h)+6rem)] pb-16 md:pb-20">
          <Reveal>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[0.95] mt-4 max-w-3xl tracking-[-0.01em] [text-wrap:balance] [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]">
              {t("title")}
            </h1>
            <BrushUnderline className="mt-4 block h-3 w-32 md:w-40 text-[var(--amber)]" />
            <p className="text-[#cfd6e0] mt-5 max-w-xl leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Toutes les actualités, chacune vers sa page d'article ===== */}
      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post, i) => (
              <Reveal key={post.slug} delay={Math.min(i * 0.05, 0.25)} className="h-full">
                <Link
                  href={`/actualites/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--surface)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[3px]"
                >
                  <div className="overflow-hidden">
                    <Image
                      src={post.image}
                      alt=""
                      width={900}
                      height={506}
                      className="h-52 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--steel)]">
                      {post.date}
                    </span>
                    <h2 className="font-display font-bold text-[20px] text-[var(--navy-deep)] mt-2 leading-snug group-hover:text-[var(--red)] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <span className="text-[14px] text-[var(--steel)] leading-relaxed mt-3 flex-1">
                        {post.excerpt}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 mt-5 font-display tracking-wide text-[14px] text-[var(--red)]">
                      {t("seeArticle")} <ArrowRight size={15} strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Pagination basePath="/actualites" current={current} total={totalPages} />
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}

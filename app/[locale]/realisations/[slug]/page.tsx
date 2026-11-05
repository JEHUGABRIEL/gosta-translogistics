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
import { getProject, getProjects } from "@/lib/projects";

export function generateStaticParams() {
  return getProjects("fr").map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(locale, slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title} | GOSTA TRANS Logistique et BTP`,
    description: project.body[0] ?? project.title,
    pathname: `/realisations/${slug}`,
    locale,
    images: [project.image],
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(locale, slug);
  if (!project) notFound();

  const t = await getTranslations("home.projects");
  // Trois autres réalisations, dans l'ordre du catalogue, sans la page courante.
  const others = getProjects(locale)
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  return (
    <main>
      <Header />

      {/* ===== Bandeau : visuel de la réalisation, famille de travaux et titre ===== */}
      <div className="relative z-10 -mt-[var(--header-h)]">
        <section className="relative flex min-h-[clamp(22rem,52svh,34rem)] flex-col justify-end overflow-hidden bg-[var(--navy-deep)]">
          <Image
            src={project.image}
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
              href={`/${locale}/#realisations`}
              className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-white/70 hover:text-[var(--amber)] transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              {t("back")}
            </a>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--amber)] mt-6">
              {project.tag}
            </p>
            <h1 className="font-display font-extrabold text-white leading-[1.06] text-[clamp(1.6rem,4.2vw,3rem)] mt-3 [text-wrap:balance]">
              {project.title}
            </h1>
          </div>
        </section>
      </div>

      {/* ===== Corps : ce que couvre la réalisation, puis les photos ===== */}
      <article className="bg-[var(--white-warm)]">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <div className="space-y-5">
            {project.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[17px] leading-[1.8] text-[var(--steel)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {project.gallery.length > 0 && (
            <div className="mt-10 overflow-hidden rounded-2xl">
              <ImageCarousel
                images={project.gallery}
                alt={project.title}
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
          href: `/realisations/${item.slug}`,
          title: item.title,
          meta: item.tag,
          image: item.image,
        }))}
      />

      <CTASection />
      <Footer />
    </main>
  );
}

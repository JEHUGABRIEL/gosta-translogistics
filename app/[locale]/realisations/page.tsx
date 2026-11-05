import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import BrushUnderline from "@/components/BrushUnderline";
import Pagination from "@/components/Pagination";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects.hub" });
  return pageMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    pathname: "/realisations",
    locale,
  });
}

// Nombre de réalisations par page (3 colonnes × 3 rangées).
const PER_PAGE = 9;

export default async function ProjectsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("projects.hub");
  const projects = getProjects(locale);
  // Pagination : une page par groupe de PER_PAGE, paramètre `?page=` borné.
  const totalPages = Math.max(1, Math.ceil(projects.length / PER_PAGE));
  const parsed = Number.parseInt(pageParam ?? "1", 10);
  const current = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, 1), totalPages)
    : 1;
  const visible = projects.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <main>
      <Header />

      {/* ===== Bandeau : même photo pleine largeur que les autres hubs ===== */}
      <section className="relative bg-[var(--navy-deep)] overflow-hidden -mt-[var(--header-h)]">
        <Image
          src="/hero_section/hero-3.png"
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

      {/* ===== Les six réalisations, chacune vers sa page de détail ===== */}
      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, i) => (
              <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.25)} className="h-full">
                <Link
                  href={`/realisations/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--surface)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[3px]"
                >
                  <div className="overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={900}
                      height={506}
                      className="h-52 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--red)]">
                      {project.tag}
                    </span>
                    <h2 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] mt-2 leading-snug group-hover:text-[var(--red)] transition-colors">
                      {project.title}
                    </h2>
                    <span className="text-[14px] text-[var(--steel)] leading-relaxed mt-3 flex-1">
                      {project.body[0]}
                    </span>
                    <span className="inline-flex items-center gap-1.5 mt-5 font-mono text-[11.5px] uppercase tracking-[0.18em] text-[var(--red)]">
                      {t("seeProject")} <ChevronRight size={13} strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Pagination basePath="/realisations" current={current} total={totalPages} />
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}

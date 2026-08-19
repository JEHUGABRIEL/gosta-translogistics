import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

type Section = { heading: string; body: string[] };

export default async function LegalDocument({
  docKey,
}: {
  docKey: "mentions" | "privacy";
}) {
  const t = await getTranslations(`legal.${docKey}`);
  const tLegal = await getTranslations("legal");
  const sections = t.raw("sections") as Section[];

  return (
    <main>
      <Header />

      {/* ===== Hero ===== */}
      {/* -mt-[var(--header-h)] : même chevauchement que HeroCarousel, pour que
          le header transparent hérite de ce fond sombre au lieu du fond clair
          du body — uniforme avec l'accueil et les pages services. */}
      <section className="relative bg-[var(--navy-deep)] overflow-hidden -mt-[var(--header-h)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-mid)]/70 via-[var(--navy-deep)] to-[var(--navy-deep)]" />
        {/* Largeur identique aux autres pages : le contenu occupe le
            conteneur max-w-7xl, sans colonne étroite isolée à gauche. */}
        <div className="relative mx-auto max-w-7xl px-6 pt-[calc(var(--header-h)+5rem)] md:pt-[calc(var(--header-h)+6rem)] pb-20 md:pb-24">
          <Reveal>
            <span className="font-mono text-[12.5px] uppercase tracking-[0.25em] text-[var(--amber)]">
              {t("eyebrow")}
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[0.95] mt-4">
              {t("title")}
            </h1>
            <p className="font-mono text-[13px] text-[#cfd6e0] mt-5">
              {t("updated")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Contenu ===== */}
      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          {/* Bandeau : ce document est un gabarit à faire valider */}
          <Reveal>
            <div className="flex items-start gap-3 border-l-4 border-[var(--amber)] bg-white rounded-r-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)]">
              <AlertTriangle
                size={20}
                className="text-[var(--amber)] mt-0.5 shrink-0"
              />
              <p className="text-[14px] text-[var(--steel)] leading-relaxed">
                {tLegal("disclaimer")}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-10 items-start">
            {sections.map((section, i) => (
              <Reveal key={section.heading} delay={i * 0.04}>
                <h2 className="font-display uppercase tracking-wide text-xl md:text-2xl text-[var(--navy-deep)]">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-[15.5px] text-[var(--steel)] leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-12 border border-[var(--navy-deep)] hover:bg-[var(--navy-deep)] hover:text-white transition-colors text-[var(--navy-deep)] font-display uppercase tracking-wide text-[13px] px-5 py-3"
            >
              {tLegal("backToSite")}
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

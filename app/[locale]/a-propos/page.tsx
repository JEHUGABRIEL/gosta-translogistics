import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import HeroScrollBump from "@/components/HeroScrollBump";
import About from "@/components/About";
import BrushUnderline from "@/components/BrushUnderline";
import KeyFigures from "@/components/KeyFigures";
import VisionBand from "@/components/VisionBand";
import Values from "@/components/Values";
import ProcessSteps from "@/components/ProcessSteps";
import Partners from "@/components/Partners";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { ABOUT_HERO_IMAGE } from "@/lib/hero-images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    pathname: "/a-propos",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHero = await getTranslations("home.hero");

  return (
    <main>
      <Header />

      {/* ===== Hero : photo plein cadre (ancienne version de la page), voile
          sombre pour la lisibilité, bosse de défilement partagée. ===== */}
      <div className="relative z-10 -mt-[var(--header-h)]">
        <section className="relative flex min-h-[clamp(30rem,86svh,52rem)] flex-col justify-end overflow-hidden bg-[var(--navy-deep)]">
          <Image
            src={ABOUT_HERO_IMAGE.src}
            alt={ABOUT_HERO_IMAGE.alt}
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover"
          />
          {/* Voile noir simple : même traitement que les autres héros à photo.
              Le dégradé du bas garantit la lisibilité de la note sur les zones
              claires de la photo. */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+5rem)] pb-24 md:pb-28">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">
              <Reveal>
                <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[0.95] max-w-2xl tracking-[-0.01em] [text-wrap:balance] [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]">
                  {t("title")}
                </h1>
                <BrushUnderline className="mt-4 block h-3 w-36 md:w-44 text-[var(--amber)]" />
                <p className="text-[#cfd6e0] mt-5 max-w-md leading-relaxed">
                  {t("intro")}
                </p>
                <a
                  href="#presentation"
                  className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/45 text-white/85 hover:text-white hover:border-white/80 transition-colors px-6 py-3 font-display uppercase tracking-wide text-[13px]"
                >
                  {t("discover")}
                  <ArrowDown size={16} strokeWidth={2} />
                </a>
              </Reveal>

              <Reveal delay={0.1} className="lg:justify-self-end lg:max-w-md">
                <p className="text-white/70 text-[15px] leading-[1.85]">
                  {t("heroNote")}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <HeroScrollBump target="chiffres" label={tHero("scroll")} />
      </div>

      {/* ===== Chiffres clés : version nue, centrée (cible de la bosse) ===== */}
      <KeyFigures variant="figures" id="chiffres" />

      {/* ===== Présentation, méthode, engagement ===== */}
      <About />

      {/* ===== Vision + valeurs ===== */}
      {/* « Nos valeurs » remonte et masque la vision au défilement : la vision
          reste épinglée derrière, les valeurs glissent par-dessus (même
          mécanique de recouvrement que l'accueil). */}
      <div className="relative">
        <div className="sticky top-0 z-0">
          <VisionBand />
        </div>
        <div className="relative z-10">
          <Values />
        </div>
      </div>

      {/* ===== Déroulé d'une opération ===== */}
      <ProcessSteps />

      {/* ===== Partenaires ===== */}
      <Partners layout="grid" />

      <CTASection />
      <Footer />
    </main>
  );
}

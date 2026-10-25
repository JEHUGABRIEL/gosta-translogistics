import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import About from "@/components/About";
import WhyUs from "@/components/WhyUs";
import Values from "@/components/Values";
import OurTeam from "@/components/OurTeam";
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
  const facts = t.raw("facts") as { label: string; value: string }[];

  return (
    <main>
      <Header />

      {/* ===== Hero ===== */}
      <section className="relative bg-[var(--navy-deep)] overflow-hidden -mt-[var(--header-h)]">
        <Image
          src={ABOUT_HERO_IMAGE.src}
          alt={ABOUT_HERO_IMAGE.alt}
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover"
        />
        {/* Voile noir simple : même traitement que les héros à photo (HeroCarousel) */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-6 pt-[calc(var(--header-h)+5rem)] md:pt-[calc(var(--header-h)+6rem)] pb-16 md:pb-24">
          <Reveal>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[0.95] max-w-3xl">
              {t("title")}
            </h1>
            <p className="text-[#cfd6e0] mt-5 max-w-xl leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Présentation, méthode, engagement ===== */}
      <About />

      {/* ===== Arguments ===== */}
      <WhyUs />

      {/* ===== Valeurs ===== */}
      <Values />

      {/* ===== Équipe ===== */}
      <OurTeam />

      {/* ===== Repères ===== */}
      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)] max-w-2xl">
              {t("factsTitle")}
            </h2>
          </Reveal>

          <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7 mt-9">
            {facts.map((fact, i) => (
              <Reveal key={fact.label} delay={Math.min(i * 0.05, 0.25)}>
                <div className="border-t border-[var(--line)] pt-4">
                  <dt className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-[var(--steel)]">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-[16px] text-[var(--navy-deep)] mt-1.5 leading-snug break-words">
                    {fact.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import FAQAccordion from "@/components/FAQAccordion";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return pageMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    pathname: "/faq",
    locale,
  });
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const items = t.raw("items") as { question: string; answer: string }[];

  return (
    <main>
      <Header />

      {/* ===== Hero ===== */}
      {/* -mt-[var(--header-h)] : même chevauchement que HeroCarousel, pour que
          le header transparent hérite de ce fond sombre — uniforme avec le
          reste du site. */}
      <section className="relative bg-[var(--navy-deep)] overflow-hidden -mt-[var(--header-h)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-mid)]/70 via-[var(--navy-deep)] to-[var(--navy-deep)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-[calc(var(--header-h)+5rem)] md:pt-[calc(var(--header-h)+6rem)] pb-20 md:pb-24">
          <Reveal>
            <span className="font-mono text-[12.5px] uppercase tracking-[0.25em] text-[var(--amber)]">
              {t("eyebrow")}
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[0.95] mt-4">
              {t("title")}
            </h1>
            <p className="text-[#cfd6e0] mt-5 max-w-xl leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Questions ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <FAQAccordion items={items} />

          <Reveal delay={0.1} className="mt-12 text-center">
            <p className="text-[var(--steel)]">{t("ctaText")}</p>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}

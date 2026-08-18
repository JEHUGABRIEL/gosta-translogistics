import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import Services from "@/components/Services";
import ServiceShowcase from "@/components/ServiceShowcase";
import QuoteSection from "@/components/QuoteSection";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import News from "@/components/News";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({
    title: t("title"),
    description: t("description"),
    pathname: "/",
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const slides = Array.from({ length: 8 }, (_, i) => ({
    title: [
      <>
        {t("hero.slide1.line1")}
        <br />
        {t("hero.slide1.line2")}
      </>,
      <>
        {t("hero.slide2.line1")}
        <br />
        {t("hero.slide2.line2")}
      </>,
      <>
        {t("hero.slide3.line1")}
        <br />
        {t("hero.slide3.line2")}
      </>,
    ][i % 3],
    image: {
      src: `/hero_section/hero-${i + 1}.png`,
      alt: "GOSTA TRANS, activités logistiques et BTP",
    },
    ...[
      {
        primaryCta: { label: t("hero.quote"), href: "#devis", openQuote: true },
      },
      {
        primaryCta: {
          label: t("hero.seeLogistique"),
          href: `/${locale}/services/logistique`,
        },
      },
      {
        primaryCta: {
          label: t("hero.seeBtp"),
          href: `/${locale}/services/btp`,
        },
      },
    ][i % 3],
  }));

  return (
    <main>
      <Header />
      <HeroCarousel id="accueil" slides={slides} />
      <About />
      <Services />
      <ServiceShowcase />
      <QuoteSection />
      <Projects />
      <Testimonials />
      <Partners />
      <News />
      <CTASection />
      <Footer />
    </main>
  );
}

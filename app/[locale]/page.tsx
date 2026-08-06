import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSearch from "@/components/HeroSearch";
import Services from "@/components/Services";
import QuoteSection from "@/components/QuoteSection";
import About from "@/components/About";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import News from "@/components/News";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const slides = [
    {
      title: (
        <>
          {t("hero.slide1.line1")}
          <br />
          {t("hero.slide1.line2")}
        </>
      ),
      primaryCta: { label: t("hero.quote"), href: "#devis", openQuote: true },
      secondaryCta: { label: t("hero.seeRealisations"), href: "#realisations" },
    },
    {
      title: (
        <>
          {t("hero.slide2.line1")}
          <br />
          {t("hero.slide2.line2")}
        </>
      ),
      primaryCta: {
        label: t("hero.seeLogistique"),
        href: `/${locale}/services/logistique`,
      },
      secondaryCta: { label: t("hero.writeUs"), href: "#contact" },
    },
    {
      title: (
        <>
          {t("hero.slide3.line1")}
          <br />
          {t("hero.slide3.line2")}
        </>
      ),
      primaryCta: {
        label: t("hero.seeBtp"),
        href: `/${locale}/services/btp`,
      },
      secondaryCta: { label: t("hero.writeUs"), href: "#contact" },
    },
  ];

  return (
    <main>
      <Header />
      <HeroCarousel id="accueil" slides={slides} floating={<HeroSearch />} />
      <Services />
      <QuoteSection />
      <About />
      <Process />
      <Projects />
      <Testimonials />
      <Partners />
      <News />
      <CTASection />
      <Footer />
    </main>
  );
}

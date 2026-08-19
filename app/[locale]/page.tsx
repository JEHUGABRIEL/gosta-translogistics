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
import { listNewsPosts, listTestimonials } from "@/lib/db/queries";

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

  // Contenu ajouté depuis le dashboard admin (facultatif) : la BD peut être
  // absente/non configurée, le site public ne doit jamais en dépendre.
  const [testimonialsResult, newsResult] = await Promise.allSettled([
    listTestimonials(true),
    listNewsPosts(true),
  ]);
  const isEn = locale === "en";
  const extraTestimonials =
    testimonialsResult.status === "fulfilled"
      ? testimonialsResult.value.map((row) => ({
          role: isEn ? row.role_en : row.role_fr,
          context: isEn ? row.context_en : row.context_fr,
          quote: isEn ? row.quote_en : row.quote_fr,
        }))
      : [];
  const extraNews =
    newsResult.status === "fulfilled"
      ? newsResult.value.map((row) => ({
          date: isEn ? row.date_label_en : row.date_label_fr,
          title: isEn ? row.title_en : row.title_fr,
        }))
      : [];

  return (
    <main>
      <Header />
      <HeroCarousel id="accueil" slides={slides} />
      <About />
      <Services />
      <ServiceShowcase />
      <QuoteSection />
      <Projects />
      <Testimonials extra={extraTestimonials} />
      <Partners />
      <News extra={extraNews} />
      <CTASection />
      <Footer />
    </main>
  );
}

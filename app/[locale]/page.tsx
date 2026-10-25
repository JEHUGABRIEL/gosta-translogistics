import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedServices from "@/components/FeaturedServices";
import WhyUs from "@/components/WhyUs";
import Values from "@/components/Values";
import OurTeam from "@/components/OurTeam";
import { buildServicesPayload } from "@/lib/services-payload";
import QuoteSection from "@/components/QuoteSection";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import News from "@/components/News";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import Reveal from "@/components/Reveal";
import { listFaqs, listNewsPosts, listTestimonials } from "@/lib/db/queries";

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
        secondaryCta: { label: t("hero.contact"), href: `/${locale}/contact` },
      },
      {
        primaryCta: {
          label: t("hero.seeLogistique"),
          href: `/${locale}/services/logistique`,
        },
        secondaryCta: { label: t("hero.quote"), href: "#devis", openQuote: true },
      },
      {
        primaryCta: {
          label: t("hero.seeBtp"),
          href: `/${locale}/services/btp`,
        },
        secondaryCta: { label: t("hero.quote"), href: "#devis", openQuote: true },
      },
    ][i % 3],
  }));

  // Contenu ajouté depuis le dashboard admin (facultatif) : la BD peut être
  // absente/non configurée, le site public ne doit jamais en dépendre.
  const [testimonialsResult, newsResult, faqResult] = await Promise.allSettled([
    listTestimonials(true),
    listNewsPosts(true),
    listFaqs(true),
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
          image: row.image_url,
        }))
      : [];
  // FAQ publiées depuis le dashboard ; à défaut, les questions statiques des
  // messages (le site public ne dépend jamais de la base).
  const faqMessages = await getTranslations({ locale, namespace: "faq" });
  const staticFaq = faqMessages.raw("items") as { question: string; answer: string }[];
  const faqItems =
    faqResult.status === "fulfilled" && faqResult.value.length > 0
      ? faqResult.value.map((row) => ({
          question: isEn ? row.question_en : row.question_fr,
          answer: isEn ? row.answer_en : row.answer_fr,
        }))
      : staticFaq;

  return (
    <main>
      <Header />
      <HeroCarousel id="accueil" slides={slides} />
      <About />
      <FeaturedServices locale={locale} initialData={buildServicesPayload(locale)} />
      <WhyUs />
      <Values />
      <QuoteSection />
      <Projects />
      <Testimonials extra={extraTestimonials} />
      <OurTeam />
      <Partners />
      <News extra={extraNews} />

      <FAQSection locale={locale} items={faqItems} />

      <CTASection />
      <Footer />
    </main>
  );
}

async function FAQSection({
  locale,
  items,
}: {
  locale: string;
  items: { question: string; answer: string }[];
}) {
  const t = await getTranslations({ locale, namespace: "faq" });

  return (
    <section className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>
          <p className="text-[var(--steel)] mt-3 max-w-xl leading-relaxed">
            {t("intro")}
          </p>
        </Reveal>

        <div className="mt-10">
          <FAQAccordion items={items} />
        </div>

        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-[var(--steel)]">{t("ctaText")}</p>
        </Reveal>
      </div>
    </section>
  );
}

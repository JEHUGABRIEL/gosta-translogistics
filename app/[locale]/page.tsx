import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import TypewriterLine from "@/components/TypewriterLine";
import WhyUs from "@/components/WhyUs";
import KeyFigures from "@/components/KeyFigures";
import Expertise from "@/components/Expertise";
import ContactBand from "@/components/ContactBand";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import News from "@/components/News";
import Partners from "@/components/Partners";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import Reveal from "@/components/Reveal";
import { listFaqs, listNewsPosts, listTestimonials } from "@/lib/db/queries";
import { newsSlug } from "@/lib/news";

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

  const isFrPage = locale !== "en";
  // Une slide par message (3), chacune avec un visuel qui la raconte : port et
  // camion, terminal logistique, chantier.
  const slideImages = [
    {
      src: "/hero_section/hero-1.png",
      alt: isFrPage
        ? "Camion et porte-conteneurs dans un terminal portuaire"
        : "Truck and container ship in a port terminal",
    },
    {
      src: "/hero_section/hero-4.png",
      alt: isFrPage
        ? "Chariot élévateur et camion au déchargement des conteneurs"
        : "Forklift and truck unloading containers",
    },
    {
      src: "/hero_section/hero-2.png",
      alt: isFrPage
        ? "Chantier de construction avec grue et camion toupie"
        : "Construction site with crane and concrete mixer truck",
    },
  ];

  const slides = Array.from({ length: 3 }, (_, i) => ({
    title: [
      <>
        {t("hero.slide1.line1")}
        <br />
        <TypewriterLine text={t("hero.slide1.line2")} />
      </>,
      <>
        {t("hero.slide2.line1")}
        <br />
        <TypewriterLine text={t("hero.slide2.line2")} />
      </>,
      <>
        {t("hero.slide3.line1")}
        <br />
        <TypewriterLine text={t("hero.slide3.line2")} />
      </>,
    ][i % 3],
    image: slideImages[i],
    // Un seul appel à l'action par slide, comme sur les héros de pôle.
    ...[
      { primaryCta: { label: t("hero.quote"), href: "#devis", openQuote: true } },
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
          // Slug calculé sur le titre français : même URL dans les deux langues.
          slug: newsSlug(row.title_fr),
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
      {/* Même hero que les pages pôle / prestation : panneau navy, visuel dans
          un cadre à droite, un seul appel à l'action par slide. */}
      <HeroCarousel id="accueil" slides={slides} scrollTo="chiffres" />
      <KeyFigures id="chiffres" />
      <Expertise />
      <About />

      {/* Image plein cadre, sans texte : « Pourquoi nous » remonte dessus au
          défilement (l'image reste épinglée derrière la section). */}
      <div className="relative">
        <div className="sticky top-0 z-0 h-[55svh] md:h-[80svh] overflow-hidden bg-[var(--navy-deep)]">
          <Image
            src="/hero_section/hero-3.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative z-10">
          <WhyUs />
        </div>
      </div>

      {/* Réalisations épinglées : le formulaire de contact remonte et les masque */}
      <div className="relative">
        <div className="sticky top-0 z-0">
          <Projects />
        </div>
        <div className="relative z-10">
          <ContactBand />
        </div>
      </div>

      <News extra={extraNews} />
      <Partners />

      <FAQSection locale={locale} items={faqItems} />

      {/* Section réservée aux commentaires clients */}
      <Testimonials extra={extraTestimonials} />

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

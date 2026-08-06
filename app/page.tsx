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

const SLIDES = [
  {
    title: (
      <>
        DU PORT AU CHANTIER,
        <br />
        ON LIVRE. ON CONSTRUIT.
      </>
    ),
    primaryCta: { label: "Demander un devis", href: "#devis", openQuote: true },
    secondaryCta: { label: "Voir nos réalisations", href: "#realisations" },
  },
  {
    title: (
      <>
        VOS MATÉRIAUX,
        <br />
        SANS RUPTURE DE CHARGE.
      </>
    ),
    primaryCta: { label: "Voir les services logistique", href: "/services/logistique" },
    secondaryCta: { label: "Nous écrire", href: "#contact" },
  },
  {
    title: (
      <>
        DES CHANTIERS SUIVIS
        <br />
        DU GROS ŒUVRE AUX FINITIONS.
      </>
    ),
    primaryCta: { label: "Voir les services BTP", href: "/services/btp" },
    secondaryCta: { label: "Nous écrire", href: "#contact" },
  },
];

export default function Home() {
  return (
    <main>
      <Header />
      <HeroCarousel id="accueil" slides={SLIDES} floating={<HeroSearch />} />
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

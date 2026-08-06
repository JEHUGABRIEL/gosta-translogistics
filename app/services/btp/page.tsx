import type { Metadata } from "next";
import ServiceCategoryTemplate from "@/components/ServiceCategoryTemplate";
import { btpServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services BTP — GOSTA TRANS Logistique & BTP",
  description:
    "Gros œuvre, second œuvre, voirie, terrassement et rénovation à Bangui — les services BTP de GOSTA TRANS.",
};

const SLIDES = [
  {
    title: (
      <>
        DU GROS ŒUVRE
        <br />
        AUX FINITIONS.
      </>
    ),
    primaryCta: { label: "Demander un devis", href: "/#devis", openQuote: true },
    secondaryCta: { label: "Voir la logistique", href: "/services/logistique" },
  },
  {
    title: (
      <>
        VOIRIE, TERRASSEMENT,
        <br />
        ASSAINISSEMENT.
      </>
    ),
    primaryCta: { label: "Demander un devis", href: "/#devis", openQuote: true },
    secondaryCta: { label: "Nos réalisations", href: "/#realisations" },
  },
];

export default function BtpPage() {
  return (
    <ServiceCategoryTemplate
      base="/services/btp"
      heading="Services BTP"
      intro="Du gros œuvre aux finitions, en passant par les travaux publics — chaque service peut être mobilisé seul ou combiné avec le transport de matériaux."
      slides={SLIDES}
      services={btpServices}
    />
  );
}

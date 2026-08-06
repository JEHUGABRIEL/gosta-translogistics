import type { Metadata } from "next";
import ServiceCategoryTemplate from "@/components/ServiceCategoryTemplate";
import { logistiqueServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services Logistique — GOSTA TRANS Logistique & BTP",
  description:
    "Transport de matériaux, location d'engins, gestion logistique et approvisionnement de chantiers à Bangui — les services logistique de GOSTA TRANS.",
};

const SLIDES = [
  {
    title: (
      <>
        VOS MATÉRIAUX,
        <br />
        LIVRÉS SANS RUPTURE.
      </>
    ),
    primaryCta: { label: "Demander un devis", href: "/#devis", openQuote: true },
    secondaryCta: { label: "Voir le BTP", href: "/services/btp" },
  },
  {
    title: (
      <>
        DU PORT
        <br />
        AU CHANTIER.
      </>
    ),
    primaryCta: { label: "Demander un devis", href: "/#devis", openQuote: true },
    secondaryCta: { label: "Nos réalisations", href: "/#realisations" },
  },
];

export default function LogistiquePage() {
  return (
    <ServiceCategoryTemplate
      base="/services/logistique"
      heading="Services logistique"
      intro="Transport, location d'engins et coordination de chantier — mobilisables séparément ou comme prestation complète, en lien direct avec le volet BTP."
      slides={SLIDES}
      services={logistiqueServices}
    />
  );
}

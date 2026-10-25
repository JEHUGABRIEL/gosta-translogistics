import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ServiceCategoryTemplate from "@/components/ServiceCategoryTemplate";
import { getPole, getServicesByPole, getServices, isPoleId } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";
import { POLE_HERO_IMAGES } from "@/lib/hero-images";

export function generateStaticParams() {
  return getServices("fr").poles.map((p) => ({ pole: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pole: string }>;
}): Promise<Metadata> {
  const { locale, pole } = await params;
  if (!isPoleId(pole)) return {};
  const meta = getPole(locale, pole);
  if (!meta) return {};
  return pageMetadata({
    title: `${meta.label} | GOSTA TRANS Logistique & BTP`,
    description: meta.tagline,
    pathname: `/services/${pole}`,
    locale,
  });
}

export default async function PolePage({
  params,
}: {
  params: Promise<{ locale: string; pole: string }>;
}) {
  const { locale, pole } = await params;
  setRequestLocale(locale);
  if (!isPoleId(pole)) notFound();

  const meta = getPole(locale, pole);
  if (!meta || meta.id !== pole) notFound();

  const services = getServicesByPole(locale, pole);
  const isFr = locale !== "en";
  const quoteLabel = isFr ? "Demander un devis" : "Request a quote";

  return (
    <ServiceCategoryTemplate
      base={`/services/${pole}`}
      heading={meta.label}
      intro={meta.tagline}
      slides={[
        {
          title: meta.label.toUpperCase(),
          image: POLE_HERO_IMAGES[pole],
          primaryCta: { label: quoteLabel, href: "#devis", openQuote: true },
        },
      ]}
      services={services}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ServiceDetailTemplate from "@/components/ServiceDetailTemplate";
import { getServiceBySlug, getServices } from "@/lib/services";

export function generateStaticParams() {
  return getServices("fr").logistique.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(locale, "logistique", slug);
  if (!service) return {};
  return {
    title: `${service.title} — GOSTA TRANS Logistique & BTP`,
    description: service.short,
  };
}

export default async function LogistiqueServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getServiceBySlug(locale, "logistique", slug);
  if (!service) notFound();

  const related = getServices(locale)
    .logistique.filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <ServiceDetailTemplate
      base="/services/logistique"
      service={service}
      related={related}
    />
  );
}

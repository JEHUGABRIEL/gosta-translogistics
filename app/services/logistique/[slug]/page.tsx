import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailTemplate from "@/components/ServiceDetailTemplate";
import { logistiqueServices } from "@/lib/services";

export function generateStaticParams() {
  return logistiqueServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = logistiqueServices.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} — GOSTA TRANS Logistique & BTP`,
    description: service.short,
  };
}

export default async function LogistiqueServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = logistiqueServices.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = logistiqueServices.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <ServiceDetailTemplate base="/services/logistique" service={service} related={related} />
  );
}

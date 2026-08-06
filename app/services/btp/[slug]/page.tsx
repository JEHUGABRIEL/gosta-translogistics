import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailTemplate from "@/components/ServiceDetailTemplate";
import { btpServices } from "@/lib/services";

export function generateStaticParams() {
  return btpServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = btpServices.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} — GOSTA TRANS Logistique & BTP`,
    description: service.short,
  };
}

export default async function BtpServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = btpServices.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = btpServices.filter((s) => s.slug !== slug).slice(0, 3);

  return <ServiceDetailTemplate base="/services/btp" service={service} related={related} />;
}

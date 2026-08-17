import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ServiceDetailTemplate from "@/components/ServiceDetailTemplate";
import { getServiceBySlug, getServices } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getServices("fr").btp.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(locale, "btp", slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.title} — GOSTA TRANS Logistique & BTP`,
    description: service.short,
    pathname: `/services/btp/${slug}`,
    locale,
  });
}

export default async function BtpServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getServiceBySlug(locale, "btp", slug);
  if (!service) notFound();

  const related = getServices(locale)
    .btp.filter((s) => s.slug !== slug)
    .slice(0, 3);

  return <ServiceDetailTemplate base="/services/btp" service={service} related={related} />;
}

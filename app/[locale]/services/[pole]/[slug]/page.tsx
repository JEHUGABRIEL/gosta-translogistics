import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ServiceDetailTemplate from "@/components/ServiceDetailTemplate";
import {
  getPole,
  getServiceBySlug,
  getServicesByPole,
  getServices,
  isPoleId,
} from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getServices("fr").poles.flatMap((p) =>
    getServices("fr").byPole[p.id].map((s) => ({ pole: p.id, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pole: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, pole, slug } = await params;
  const service = getServiceBySlug(locale, slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.title} | GOSTA TRANS Logistique & BTP`,
    description: service.short,
    pathname: `/services/${pole}/${slug}`,
    locale,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; pole: string; slug: string }>;
}) {
  const { locale, pole, slug } = await params;
  setRequestLocale(locale);
  if (!isPoleId(pole)) notFound();

  const service = getServiceBySlug(locale, slug);
  const meta = getPole(locale, pole);
  if (!service || !meta || service.pole !== pole) notFound();

  const related = getServicesByPole(locale, pole)
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <ServiceDetailTemplate base={`/services/${pole}`} service={service} related={related} />
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ServiceCategoryTemplate from "@/components/ServiceCategoryTemplate";
import { getServices } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.logistique" });
  return pageMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    pathname: "/services/logistique",
    locale,
  });
}

export default async function LogistiquePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const { logistique } = getServices(locale);

  const slides = [
    {
      title: (
        <>
          {t("logistique.slide1.line1")}
          <br />
          {t("logistique.slide1.line2")}
        </>
      ),
      primaryCta: { label: t("detail.quote"), href: "#devis", openQuote: true },
    },
    {
      title: (
        <>
          {t("logistique.slide2.line1")}
          <br />
          {t("logistique.slide2.line2")}
        </>
      ),
      primaryCta: { label: t("detail.quote"), href: "#devis", openQuote: true },
    },
  ];

  return (
    <ServiceCategoryTemplate
      base="/services/logistique"
      heading={t("logistique.heading")}
      intro={t("logistique.intro")}
      slides={slides}
      services={logistique}
    />
  );
}

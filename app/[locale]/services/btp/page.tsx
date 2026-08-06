import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ServiceCategoryTemplate from "@/components/ServiceCategoryTemplate";
import { getServices } from "@/lib/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.btp" });
  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  };
}

export default async function BtpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const { btp } = getServices(locale);

  const slides = [
    {
      title: (
        <>
          {t("btp.slide1.line1")}
          <br />
          {t("btp.slide1.line2")}
        </>
      ),
      primaryCta: { label: t("detail.quote"), href: "#devis", openQuote: true },
      secondaryCta: {
        label: t("btp.seeLogistique"),
        href: `/${locale}/services/logistique`,
      },
    },
    {
      title: (
        <>
          {t("btp.slide2.line1")}
          <br />
          {t("btp.slide2.line2")}
        </>
      ),
      primaryCta: { label: t("detail.quote"), href: "#devis", openQuote: true },
      secondaryCta: { label: t("btp.seeRealisations"), href: "#realisations" },
    },
  ];

  return (
    <ServiceCategoryTemplate
      base="/services/btp"
      heading={t("btp.heading")}
      intro={t("btp.intro")}
      slides={slides}
      services={btp}
    />
  );
}

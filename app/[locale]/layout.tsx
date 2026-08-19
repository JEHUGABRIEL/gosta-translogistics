import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { QuoteModalProvider } from "@/components/QuoteModalProvider";
import FloatingActions from "@/components/FloatingActions";
import { COMPANY, SITE_URL } from "@/lib/seo";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    applicationName: COMPANY.shortName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: COMPANY.shortName,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      // URL absolue : les images relatives du layout racine sont résolues
      // avant que son propre metadataBase ne prenne effet (cf. page 404).
      images: [`${SITE_URL}/opengraph-image.png`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: COMPANY.name,
  description:
    "GOSTA TRANS LOGISTIQUE & BTP : maritime, transport et logistique de chantier à Bangui. Location d'engins, gros œuvre, second œuvre, voirie et travaux publics.",
  url: SITE_URL,
  telephone: COMPANY.phones[0],
  email: COMPANY.email,
  image: `${SITE_URL}/opengraph-image.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.streetAddress,
    addressLocality: COMPANY.address.addressLocality,
    addressCountry: COMPANY.address.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 4.3947,
    longitude: 18.5582,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "07:30",
    closes: "18:00",
  },
  sameAs: [COMPANY.social.facebook, COMPANY.social.instagram],
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[var(--sand)] text-[#1B2430]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QuoteModalProvider>
            {children}
            <FloatingActions />
          </QuoteModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

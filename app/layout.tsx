import type { Metadata } from "next";
import "./globals.css";
import { QuoteModalProvider } from "@/components/QuoteModalProvider";

export const metadata: Metadata = {
  title: "GOSTA TRANS — Logistique & BTP | Bangui, RCA",
  description:
    "GOSTA TRANS LOGISTIQUE & BTP — Maritime, transport et logistique de chantier à Bangui. Location d'engins, gros œuvre, second œuvre, voirie et travaux publics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#F5F2EC] text-[#1B2430]">
        <QuoteModalProvider>{children}</QuoteModalProvider>
      </body>
    </html>
  );
}

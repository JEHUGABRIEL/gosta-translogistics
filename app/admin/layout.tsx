import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Admin | GOSTA TRANS",
  robots: { index: false, follow: false },
};

// Section autonome (hors [locale]) : pas de header/footer public, pas de
// bilinguisme — un shell minimal dédié au dashboard.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-[var(--sand)] text-[#1B2430] font-sans">
        {children}
      </body>
    </html>
  );
}

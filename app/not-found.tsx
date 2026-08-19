import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page introuvable | GOSTA TRANS",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--navy-deep)] text-white">
      <h1 className="font-display font-extrabold text-6xl">404</h1>
      <p className="font-display text-xl mt-4 opacity-80">
        Page introuvable
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 bg-[var(--red)] hover:opacity-90 transition-opacity text-white font-display uppercase tracking-wide text-sm px-6 py-3"
      >
        Retour à l&apos;accueil
      </a>
    </div>
  );
}

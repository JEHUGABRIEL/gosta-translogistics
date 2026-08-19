import type { ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function AuthCard({
  subtitle,
  children,
}: {
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--navy-deep)]">
      <div className="w-full max-w-sm bg-white border-t-4 border-[var(--red)] shadow-2xl rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-extrabold text-2xl tracking-wide text-[var(--navy-deep)]">
              GOSTA <span className="text-[var(--red)]">TRANS</span>
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--steel)] mt-1">
              {subtitle}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--steel)] hover:text-[var(--navy-deep)] hover:bg-[var(--sand)] transition-colors"
            aria-label="Retour au site"
          >
            <X size={18} />
          </Link>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

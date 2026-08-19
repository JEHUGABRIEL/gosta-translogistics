"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  LogOut,
  UserCircle,
  Users,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import ConfirmModal from "./ConfirmModal";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes", label: "Demandes de devis", icon: MessageSquareText, exact: false },
  { href: "/admin/testimonials", label: "Témoignages", icon: MessageSquareText, exact: false },
  { href: "/admin/news", label: "Actualités", icon: Newspaper, exact: false },
  { href: "/admin/team", label: "Équipe", icon: Users, exact: false },
  { href: "/admin/account", label: "Mon compte", icon: UserCircle, exact: false },
] as const;

export default function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-[var(--navy-deep)] text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <span className="font-display font-extrabold text-xl tracking-wide">
            GOSTA <span className="text-[var(--red)]">TRANS</span>
          </span>
          <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)] mt-1">
            Dashboard admin
          </span>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-6 py-3 text-[14.5px] transition-colors ${
                  active
                    ? "bg-white/10 text-white border-r-2 border-[var(--red)]"
                    : "text-[#b7c0cc] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 py-2 text-[13.5px] text-[#b7c0cc] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-[var(--line-soft)] px-8 py-5">
          <h1 className="font-display font-extrabold text-2xl text-[var(--navy-deep)]">
            {title}
          </h1>
        </header>
        <main className="p-8">{children}</main>
      </div>

      <ConfirmModal
        open={showLogout}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter du dashboard admin ?"
        confirmLabel="Déconnexion"
        danger
        onConfirm={() => logoutAction()}
        onCancel={() => setShowLogout(false)}
      />
    </div>
  );
}

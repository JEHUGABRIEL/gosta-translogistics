"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  LogOut,
  UserCircle,
  Users,
  Inbox,
  HelpCircle,
  History,
  Menu,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import ConfirmModal from "./ConfirmModal";
import NotificationsBell from "./NotificationsBell";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin/quotes", label: "Demandes de devis", icon: MessageSquareText, exact: false },
  { href: "/admin/messages", label: "Messages de contact", icon: Inbox, exact: false },
  { href: "/admin/testimonials", label: "Témoignages", icon: MessageSquareText, exact: false },
  { href: "/admin/news", label: "Actualités", icon: Newspaper, exact: false },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, exact: false },
  { href: "/admin/team", label: "Équipe", icon: Users, exact: false },
  { href: "/admin/activity", label: "Journal d'activité", icon: History, exact: false },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
          style={{ borderRadius: 0 }}
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-[var(--navy-deep)] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-6 py-6">
          <Link href="/admin" className="block">
            <span className="font-display text-xl font-extrabold tracking-wide">
              GOSTA <span className="text-[var(--red)]">TRANS</span>
            </span>
            <span className="mt-1 block font-display text-[12.5px] uppercase tracking-[0.18em] text-white/75">
              Logistique et BTP
            </span>
            <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--amber)]">
              Dashboard admin
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-8 w-8 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`mx-3 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-[#b7c0cc] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  size={17}
                  className={active ? "text-[var(--amber)]" : ""}
                />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--red)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 py-2 text-[13.5px] text-[#b7c0cc] transition-colors hover:text-white"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--line-soft)] bg-[var(--surface)] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--navy-deep)] lg:hidden"
            >
              <Menu size={19} />
            </button>
            <h1 className="truncate font-display text-xl font-extrabold text-[var(--navy-deep)] sm:text-2xl">
              {title}
            </h1>
          </div>
          <NotificationsBell />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
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

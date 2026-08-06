"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "./SocialIcons";
import { btpServices, logistiqueServices } from "@/lib/services";
import { SOCIAL_LINKS } from "@/lib/social";
import { useQuoteModal } from "./QuoteModalProvider";

const SIMPLE_NAV = [
  { label: "Accueil", href: "/" },
  { label: "Contact", href: "/#contact" },
];

function DesktopDropdown({
  label,
  base,
  items,
}: {
  label: string;
  base: string;
  items: typeof btpServices;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={base}
        className="flex items-center gap-1 font-display text-[15px] uppercase tracking-wide text-[#dfe4ec] hover:text-[var(--amber)] transition-colors py-2"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[340px] z-50"
          >
            <div className="bg-white shadow-2xl border-t-2 border-[var(--red)] py-2">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`${base}/${item.slug}`}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-[#F5F2EC] transition-colors group"
                >
                  <item.icon
                    size={18}
                    className="text-[var(--navy-deep)] group-hover:text-[var(--red)] transition-colors mt-0.5 shrink-0"
                  />
                  <span>
                    <span className="block font-display uppercase tracking-wide text-[14.5px] text-[var(--navy-deep)] group-hover:text-[var(--red)] transition-colors">
                      {item.title}
                    </span>
                    <span className="block text-[12.5px] text-[var(--steel)] mt-0.5">
                      {item.short}
                    </span>
                  </span>
                </Link>
              ))}
              <Link
                href={base}
                className="flex items-center justify-between px-5 py-3 mt-1 border-t border-[#eee9dc] font-display uppercase tracking-wide text-[13px] text-[var(--red)]"
              >
                Voir tous les services <ChevronRight size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileAccordion({
  label,
  base,
  items,
  onNavigate,
}: {
  label: string;
  base: string;
  items: typeof btpServices;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 font-display text-lg uppercase tracking-wide text-white"
      >
        {label}
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${open ? "rotate-180 text-[var(--amber)]" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col pb-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`${base}/${item.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-3 py-2.5 pl-2 text-[#cfd6e0] hover:text-[var(--amber)] transition-colors"
                >
                  <item.icon size={16} className="text-[var(--amber)] shrink-0" />
                  <span className="text-[15px]">{item.title}</span>
                </Link>
              ))}
              <Link
                href={base}
                onClick={onNavigate}
                className="font-mono text-[12.5px] uppercase tracking-wide text-[var(--amber)] pl-2 pt-2"
              >
                Voir tous les services →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { openQuote } = useQuoteModal();

  // Bloque le scroll de la page tant que le menu mobile est ouvert
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Ferme le menu mobile quand la fenêtre passe en desktop (≥ 1024px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* top info bar */}
      <div className="hidden md:block bg-[var(--navy-deep)] text-[#cfd6e0] font-mono text-[12.5px]">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-[var(--amber)]" />
              70 12 00 25 / 72 60 05 33
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-[var(--amber)]" />
              gostatranslogistiquebtp@outlook.fr
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[var(--amber)]" />
              Lun – Sam · 07h30 – 18h00 · PK14 Route de Boali, Bangui
            </span>
            <span className="h-4 w-px bg-white/15" />
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook — Gosta Trans"
                className="text-[#cfd6e0] hover:text-[var(--amber)] transition-colors"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram — Gosta Trans"
                className="text-[#cfd6e0] hover:text-[var(--amber)] transition-colors"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp — Gosta Trans"
                className="text-[#cfd6e0] hover:text-[var(--amber)] transition-colors"
              >
                <WhatsAppIcon size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* main nav */}
      <div className="bg-[var(--navy-mid)]/95 backdrop-blur border-b-2 border-[var(--red)]">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-[68px]">
          <Link href="/" className="flex flex-col justify-center gap-0.5">
            <span className="font-display font-extrabold text-2xl tracking-wide text-white leading-none">
              GOSTA <span className="text-[var(--red)]">TRANS</span>
            </span>
            <span className="font-display text-[13px] uppercase tracking-[0.18em] text-[var(--amber)] leading-none">
              Logistique &amp; BTP
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="font-display text-[15px] uppercase tracking-wide text-[#dfe4ec] hover:text-[var(--amber)] transition-colors"
            >
              Accueil
            </Link>
            <DesktopDropdown label="BTP" base="/services/btp" items={btpServices} />
            <DesktopDropdown label="Logistique" base="/services/logistique" items={logistiqueServices} />
            {SIMPLE_NAV.slice(1).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display text-[15px] uppercase tracking-wide text-[#dfe4ec] hover:text-[var(--amber)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={openQuote}
            className="hidden lg:inline-flex items-center bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-[15px] px-5 py-2.5 cursor-pointer"
          >
            Demander un devis
          </button>

          <button
            className="lg:hidden text-white z-50"
            onClick={() => setOpen((o) => !o)}
            aria-label="Ouvrir le menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[var(--navy-deep)] z-40 lg:hidden overflow-y-auto"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="absolute top-5 right-5 z-50 h-10 w-10 flex items-center justify-center border border-white/25 text-white hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors"
              >
                <X size={22} />
              </button>
              <div className="px-6 pt-24 pb-10 flex flex-col">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="py-4 border-b border-white/10 font-display text-lg uppercase tracking-wide text-white"
                >
                  Accueil
                </Link>
                <MobileAccordion
                  label="BTP"
                  base="/services/btp"
                  items={btpServices}
                  onNavigate={() => setOpen(false)}
                />
                <MobileAccordion
                  label="Logistique"
                  base="/services/logistique"
                  items={logistiqueServices}
                  onNavigate={() => setOpen(false)}
                />
                {SIMPLE_NAV.slice(1).map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-4 border-b border-white/10 font-display text-lg uppercase tracking-wide text-white"
                  >
                    {item.label}
                  </a>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openQuote();
                  }}
                  className="inline-flex items-center justify-center bg-[var(--red)] text-white font-display uppercase tracking-wide text-[15px] px-5 py-3.5 mt-8 cursor-pointer"
                >
                  Demander un devis
                </button>

                <div className="mt-8 pt-6 border-t border-white/10 font-mono text-[13px] text-[#9aa5b5] space-y-2">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-[var(--amber)]" /> 70 12 00 25 / 72 60 05 33
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-[var(--amber)]" /> gostatranslogistiquebtp@outlook.fr
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

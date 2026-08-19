"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Phone,
  Mail,
  Clock,
  Menu,
  Search,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "./SocialIcons";
import { getServices, type Service } from "@/lib/services";
import { SOCIAL_LINKS } from "@/lib/social";
import { useQuoteModal } from "./QuoteModalProvider";
import SearchModal from "./SearchModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/i18n/navigation";

const SIMPLE_NAV = [
  { key: "home", href: "/" },
  { key: "contact", href: "/contact" },
];

// Numéros du bandeau, affichés un à la fois à tour de rôle
const PHONES = ["70 12 00 25", "72 60 05 33"];

function DesktopDropdown({
  label,
  base,
  items,
}: {
  label: string;
  base: string;
  items: Service[];
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={base}
        className="h-full flex items-center gap-1 font-display font-semibold text-[15px] uppercase tracking-wide text-[#dfe4ec] hover:text-[var(--red)] transition-colors"
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
                  className="flex items-start gap-3 px-5 py-3 hover:bg-[var(--sand)] transition-colors group"
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
                className="flex items-center justify-between px-5 py-3 mt-1 border-t border-[var(--line-soft)] font-display uppercase tracking-wide text-[13px] text-[var(--red)]"
              >
                {t("allServices")} <ChevronRight size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileServiceGroup({
  label,
  base,
  items,
  onNavigate,
  index,
}: {
  label: string;
  base: string;
  items: Service[];
  onNavigate: () => void;
  index: number;
}) {
  // Affichage « à plat » : le pôle est un titre cliquable (vers sa page
  // récapitulative) et ses services restent listés en dessous, sans repli.
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.12 + index * 0.07,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="border-b border-white/10 py-5"
    >
      <Link
        href={base}
        onClick={onNavigate}
        className="group inline-flex items-baseline gap-4"
      >
        <span className="font-display font-extrabold text-4xl uppercase tracking-wide text-white group-hover:text-[var(--red)] transition-colors">
          {label}
        </span>
      </Link>

      <ul className="mt-3 flex flex-col">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${base}/${item.slug}`}
              onClick={onNavigate}
              className="flex items-center gap-3 py-2.5 text-[#cfd6e0] hover:text-[var(--red)] transition-colors"
            >
              <item.icon size={18} className="text-[var(--amber)] shrink-0" />
              <span className="font-display text-lg">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [phoneIndex, setPhoneIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const { openQuote } = useQuoteModal();
  const locale = useLocale();
  const t = useTranslations("nav");
  const tTopbar = useTranslations("topbar");
  const tSocial = useTranslations("social");

  const { btp, logistique } = getServices(locale);

  // Fait défiler les numéros du bandeau, un à la fois
  useEffect(() => {
    // Respecte « réduire les animations » (WCAG 2.2.2)
    if (reduceMotion) return;
    const t = setInterval(
      () => setPhoneIndex((i) => (i + 1) % PHONES.length),
      3500
    );
    return () => clearInterval(t);
  }, [reduceMotion]);

  // Le fond bleu du header n'apparaît qu'une fois la page scrollée
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* top info bar — fond bleu permanent */}
      <div className="bg-[var(--navy-deep)] text-[#cfd6e0] font-mono text-[12.5px]">
        {/* justify-between : numéros à gauche, réseaux sociaux à droite,
            y compris sur mobile */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 md:py-0 md:min-h-[var(--topbar-h)]">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <Phone size={13} className="text-[var(--amber)]" />
              <span className="relative inline-flex items-center h-4 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={phoneIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {PHONES[phoneIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <Mail size={13} className="text-[var(--amber)]" />
              gostatranslogistiquebtp@outlook.fr
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden lg:flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <Clock size={13} className="text-[var(--amber)]" />
              <span>{tTopbar("hours")}</span>
              <span className="hidden xl:inline">{tTopbar("addressSuffix")}</span>
            </span>
            <span className="hidden sm:block h-4 w-px bg-white/15" />
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tSocial("facebook")}
                className="text-[#cfd6e0] hover:text-[var(--red)] transition-colors p-1 -m-1"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tSocial("instagram")}
                className="text-[#cfd6e0] hover:text-[var(--red)] transition-colors p-1 -m-1"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tSocial("whatsapp")}
                className="text-[#cfd6e0] hover:text-[var(--red)] transition-colors p-1 -m-1"
              >
                <WhatsAppIcon size={14} />
              </a>
            </div>
            {/* Langue dans la topbar, après les réseaux sociaux */}
            <span className="hidden sm:block h-4 w-px bg-white/15" />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* main nav — transparent en haut de page, fond bleu au scroll */}
      <div
        className={`${scrolled ? "bg-[var(--navy-mid)]/95 backdrop-blur" : "bg-transparent"} border-b-2 border-transparent transition-colors duration-300`}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-[var(--header-nav-h)]">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={540}
              height={210}
              priority
              className="h-10 w-auto shrink-0"
            />
            <span className="flex flex-col justify-center gap-0.5">
              <span className="font-display font-extrabold text-2xl tracking-wide text-white leading-none">
                GOSTA <span className="text-[var(--red)]">TRANS</span>
              </span>
              <span className="font-display text-[13px] uppercase tracking-[0.18em] text-[var(--amber)] leading-none">
                {t("tagline")}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex h-full items-stretch gap-8">
            <Link
              href="/"
              className="h-full flex items-center font-display font-semibold text-[15px] uppercase tracking-wide text-[#dfe4ec] hover:text-[var(--red)] transition-colors"
            >
              {t("home")}
            </Link>
            <DesktopDropdown label={t("btp")} base="/services/btp" items={btp} />
            <DesktopDropdown
              label={t("logistique")}
              base="/services/logistique"
              items={logistique}
            />
            {SIMPLE_NAV.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="h-full flex items-center font-display font-semibold text-[15px] uppercase tracking-wide text-[#dfe4ec] hover:text-[var(--red)] transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Recherche + devis, à droite de la navbar */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              className="text-white hover:text-[var(--red)] transition-colors p-1.5"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              onClick={openQuote}
              className="btn-liquid inline-flex items-center bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-[15px] px-5 py-2.5 cursor-pointer"
            >
              <span className="relative z-10">{t("quote")}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
              aria-label={t("search")}
              className="text-white hover:text-[var(--red)] transition-colors p-1.5"
            >
              <Search size={23} />
            </button>
            <button
              className="text-white z-50"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed inset-0 z-40 lg:hidden bg-[var(--navy-deep)] flex flex-col overflow-y-auto"
            >
              {/* Bandeau : logo à gauche, langue + fermer à droite */}
              <div className="shrink-0 flex items-center justify-between gap-3 px-5 sm:px-6 h-[var(--header-nav-h)]">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <Image
                    src="/brand/logo-mark.png"
                    alt=""
                    width={540}
                    height={210}
                    className="h-9 w-auto shrink-0"
                  />
                  <span className="flex flex-col justify-center gap-0.5">
                    <span className="font-display font-extrabold text-xl tracking-wide text-white leading-none">
                      GOSTA <span className="text-[var(--red)]">TRANS</span>
                    </span>
                    <span className="font-display text-[11px] uppercase tracking-[0.18em] text-[var(--amber)] leading-none">
                      {t("tagline")}
                    </span>
                  </span>
                </Link>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Liens géants en cascade */}
              <nav className="flex-1 px-5 sm:px-6 pt-6 pb-10">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10"
                >
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-5 group"
                  >
                    <span className="font-display font-extrabold text-4xl uppercase tracking-wide text-white group-hover:text-[var(--red)] transition-colors">
                      {t("home")}
                    </span>
                  </Link>
                </motion.div>
                <MobileServiceGroup
                  label={t("btp")}
                  base="/services/btp"
                  items={btp}
                  onNavigate={() => setOpen(false)}
                  index={0}
                />
                <MobileServiceGroup
                  label={t("logistique")}
                  base="/services/logistique"
                  items={logistique}
                  onNavigate={() => setOpen(false)}
                  index={1}
                />
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + 3 * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10"
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-5 group"
                  >
                    <span className="font-display font-extrabold text-4xl uppercase tracking-wide text-white group-hover:text-[var(--red)] transition-colors">
                      {t("contact")}
                    </span>
                  </Link>
                </motion.div>

                {/* CTA devis + recherche */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 mt-10"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openQuote();
                    }}
                    className="btn-liquid inline-flex items-center justify-center bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-[15px] px-6 py-3.5 cursor-pointer"
                  >
                    <span className="relative z-10">{t("quote")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setSearchOpen(true);
                    }}
                    aria-label={t("search")}
                    className="h-12 w-12 flex items-center justify-center border border-white/25 text-white hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
                  >
                    <Search size={20} />
                  </button>
                </motion.div>
              </nav>

              {/* Pied : coordonnées + réseaux sociaux */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="shrink-0 px-5 sm:px-6 py-6 border-t border-white/10 space-y-4"
              >
                <div className="font-mono text-[13px] text-[#9aa5b5]">
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-[var(--amber)]" /> gostatranslogistiquebtp@outlook.fr
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tSocial("facebook")}
                    className="h-9 w-9 flex items-center justify-center border border-white/20 text-[#cfd6e0] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
                  >
                    <FacebookIcon size={16} />
                  </a>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tSocial("instagram")}
                    className="h-9 w-9 flex items-center justify-center border border-white/20 text-[#cfd6e0] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
                  >
                    <InstagramIcon size={16} />
                  </a>
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tSocial("whatsapp")}
                    className="h-9 w-9 flex items-center justify-center border border-white/20 text-[#cfd6e0] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
                  >
                    <WhatsAppIcon size={16} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

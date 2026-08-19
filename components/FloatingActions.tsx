"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUp, FileText, MessageCircle, Phone, X } from "lucide-react";
import { WhatsAppIcon } from "./SocialIcons";
import { SOCIAL_LINKS } from "@/lib/social";
import { useQuoteModal } from "./QuoteModalProvider";

export default function FloatingActions() {
  const t = useTranslations("floatingContact");
  const { openQuote } = useQuoteModal();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const actions = [
    {
      key: "call",
      label: t("call"),
      icon: Phone,
      href: "tel:+23670120025",
    },
    {
      key: "whatsapp",
      label: t("whatsapp"),
      icon: WhatsAppIcon,
      href: SOCIAL_LINKS.whatsapp,
      external: true,
    },
  ] as const;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Retour en haut — apparaît après un peu de défilement */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
            aria-label={t("scrollTop")}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="h-11 w-11 flex items-center justify-center rounded-full bg-white border border-[var(--line)] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.25)] transition-colors cursor-pointer"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Actions rapides (appel, WhatsApp, devis) */}
      <div className="flex flex-col items-end gap-3">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-end gap-3"
            >
              {actions.map(({ key, label, icon: Icon, href, ...rest }, i) => (
                <motion.a
                  key={key}
                  href={href}
                  target={"external" in rest && rest.external ? "_blank" : undefined}
                  rel={"external" in rest && rest.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: reduceMotion ? 0 : i * 0.05 }}
                  className="group flex items-center gap-3"
                >
                  <span className="bg-[var(--navy-deep)] text-white text-[13px] font-display uppercase tracking-wide px-3 py-1.5 rounded-full shadow-[0_4px_14px_-4px_rgba(0,0,0,0.3)] whitespace-nowrap">
                    {label}
                  </span>
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-white border border-[var(--line)] text-[var(--navy-deep)] group-hover:border-[var(--red)] group-hover:text-[var(--red)] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.25)] transition-colors shrink-0">
                    <Icon size={20} />
                  </span>
                </motion.a>
              ))}

              <motion.button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openQuote();
                }}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2, delay: reduceMotion ? 0 : 2 * 0.05 }}
                className="group flex items-center gap-3 cursor-pointer"
              >
                <span className="bg-[var(--navy-deep)] text-white text-[13px] font-display uppercase tracking-wide px-3 py-1.5 rounded-full shadow-[0_4px_14px_-4px_rgba(0,0,0,0.3)] whitespace-nowrap">
                  {t("quote")}
                </span>
                <span className="h-12 w-12 flex items-center justify-center rounded-full bg-white border border-[var(--line)] text-[var(--navy-deep)] group-hover:border-[var(--red)] group-hover:text-[var(--red)] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.25)] transition-colors shrink-0">
                  <FileText size={18} />
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? t("close") : t("toggle")}
          aria-expanded={menuOpen}
          className="btn-liquid h-14 w-14 flex items-center justify-center rounded-full bg-[var(--navy-deep)] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] cursor-pointer"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex"
          >
            {menuOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.span>
        </button>
      </div>
    </div>
  );
}

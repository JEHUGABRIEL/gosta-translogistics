"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Phone, ArrowLeft } from "lucide-react";
import QuoteForm from "./QuoteForm";
import { WhatsAppIcon } from "./SocialIcons";
import { SOCIAL_LINKS } from "@/lib/social";

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("quote");
  const tForm = useTranslations("quoteForm");
  const [view, setView] = useState<"choice" | "form">("choice");
  const [lastOpen, setLastOpen] = useState(open);

  // Repart toujours sur le choix WhatsApp quand le modal se rouvre
  if (lastOpen !== open) {
    setLastOpen(open);
    if (open) setView("choice");
  }

  // Bloque le scroll + fermeture avec Échap tant que le modal est ouvert
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const defaultMessage = tForm("defaultMessage");

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("modalTitle")}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[var(--sand)] border-t-4 border-[var(--red)] shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              autoFocus
              aria-label={t("close")}
              className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full border border-[var(--line)] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors bg-white"
            >
              <X size={20} />
            </button>

            <div className="p-7 md:p-10">
              <span className="block font-mono text-[12px] uppercase tracking-[0.25em] text-[var(--red)]">
                {t("modalEyebrow")}
              </span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)] leading-tight mt-2">
                {t("modalTitle")}
              </h2>
              <p className="text-[var(--steel)] text-[14.5px] mt-3 leading-relaxed">
                {t("modalText")}
              </p>

              <div className="mt-6">
                {view === "choice" ? (
                  <>
                    <a
                      href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(
                        defaultMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5b] transition-colors text-white font-display uppercase tracking-wide text-lg px-6 py-4"
                    >
                      <WhatsAppIcon size={24} /> {t("whatsapp")}
                    </a>

                    <div className="flex items-center gap-4 my-5">
                      <span className="flex-1 h-px bg-[var(--line-soft)]" />
                      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--steel)]">
                        {t("or")}
                      </span>
                      <span className="flex-1 h-px bg-[var(--line-soft)]" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setView("form")}
                      className="inline-flex items-center justify-center w-full bg-[var(--red)] hover:bg-[var(--red-dark)] text-white transition-colors font-display uppercase tracking-wide text-base px-6 py-3.5 cursor-pointer"
                    >
                      {t("fillForm")}
                    </button>

                    <div className="mt-6 pt-5 border-t border-[var(--line-soft)] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-[13.5px] font-mono text-[var(--navy-deep)]">
                      <a
                        href="tel:+23670120025"
                        className="flex items-center gap-2 hover:text-[var(--red)] transition-colors"
                      >
                        <Phone size={15} className="text-[var(--amber)]" /> 70 12 00 25
                      </a>
                      <a
                        href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(
                          defaultMessage
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-[var(--red)] transition-colors"
                      >
                        <WhatsAppIcon size={15} className="text-[var(--amber)]" /> 75 20 03 13
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setView("choice")}
                      className="inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-wide text-[var(--red)] hover:text-[var(--red-dark)] transition-colors cursor-pointer mb-4"
                    >
                      <ArrowLeft size={14} /> {t("back")}
                    </button>
                    <QuoteForm />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Phone, ArrowLeft } from "lucide-react";
import QuoteForm from "./QuoteForm";
import { WhatsAppIcon } from "./SocialIcons";
import { SOCIAL_LINKS } from "@/lib/social";

const DEFAULT_MESSAGE = "Bonjour GOSTA TRANS, je souhaite demander un devis.";

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<"choice" | "form">("choice");

  // Repart toujours sur le choix WhatsApp quand le modal se rouvre
  useEffect(() => {
    if (open) setView("choice");
  }, [open]);

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

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Demander un devis"
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
            className="relative w-full max-w-lg bg-[#F5F2EC] border-t-4 border-[var(--red)] shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              autoFocus
              aria-label="Fermer le modal"
              className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center border border-[#c9c2ad] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors bg-white"
            >
              <X size={20} />
            </button>

            <div className="p-7 md:p-10">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)] leading-tight">
                Demander un devis
              </h2>
              <p className="text-[var(--steel)] text-[14.5px] mt-3 leading-relaxed">
                Transport, location d&apos;engins ou chantier de construction —
                décrivez votre besoin, on s&apos;occupe du reste.
                Réponse sous 24h ouvrées.
              </p>

              <div className="mt-6">
                {view === "choice" ? (
                  <>
                    <a
                      href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(
                        DEFAULT_MESSAGE
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5b] transition-colors text-white font-display uppercase tracking-wide text-lg px-6 py-4"
                    >
                      <WhatsAppIcon size={24} /> Discuter sur WhatsApp
                    </a>

                    <div className="flex items-center gap-4 my-5">
                      <span className="flex-1 h-px bg-[#e4e0d5]" />
                      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--steel)]">
                        ou
                      </span>
                      <span className="flex-1 h-px bg-[#e4e0d5]" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setView("form")}
                      className="inline-flex items-center justify-center w-full border-2 border-[var(--navy-deep)] hover:bg-[var(--navy-deep)] hover:text-white transition-colors text-[var(--navy-deep)] font-display uppercase tracking-wide text-base px-6 py-3.5 cursor-pointer"
                    >
                      Remplir le formulaire
                    </button>

                    <div className="mt-6 pt-5 border-t border-[#e4e0d5] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-[13.5px] font-mono text-[var(--navy-deep)]">
                      <a
                        href="tel:+23670120025"
                        className="flex items-center gap-2 hover:text-[var(--red)] transition-colors"
                      >
                        <Phone size={15} className="text-[var(--amber)]" /> 70 12 00 25
                      </a>
                      <a
                        href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(
                          DEFAULT_MESSAGE
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
                      <ArrowLeft size={14} /> Retour aux options
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

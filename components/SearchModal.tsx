"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import HeroSearch from "./HeroSearch";

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("search");

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
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-28"
          role="dialog"
          aria-modal="true"
          aria-label={t("dialogLabel")}
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
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[var(--navy-deep)] border-t-4 border-[var(--red)] shadow-2xl rounded-2xl"
          >
            <button
              onClick={onClose}
              aria-label={t("close")}
              className="absolute -top-12 right-0 h-10 w-10 flex items-center justify-center border border-white/30 text-white hover:border-[var(--red)] hover:text-[var(--red)] transition-colors bg-black/20"
            >
              <X size={20} />
            </button>
            <HeroSearch autoFocus onSubmitted={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

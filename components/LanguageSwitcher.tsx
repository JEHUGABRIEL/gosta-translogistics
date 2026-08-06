"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = ["fr", "en"] as const;

type Locale = (typeof LOCALES)[number];

const LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const listboxId = useId();

  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Ferme le menu et rend le focus au déclencheur (a11y)
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Ferme le menu au clic extérieur ou avec Échap
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // À l'ouverture, place le focus sur la langue active (l'index est mis à
  // jour par le handler onFocus de l'option ciblée)
  useEffect(() => {
    if (!open) return;
    const activeIndex = Math.max(0, LOCALES.findIndex((l) => l === locale));
    requestAnimationFrame(() => optionRefs.current[activeIndex]?.focus());
  }, [open, locale]);

  const switchLocale = (l: Locale) => {
    router.replace(pathname, { locale: l });
    close();
  };

  const moveFocus = (dir: 1 | -1) => {
    const next = (focusedIndex + dir + LOCALES.length) % LOCALES.length;
    setFocusedIndex(next);
    optionRefs.current[next]?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label="Choisir la langue — Choose language"
        className="flex items-center gap-2 cursor-pointer bg-[var(--navy-mid)] border border-white/25 text-[var(--amber)] hover:border-[var(--amber)] focus:border-[var(--amber)] focus:outline-none font-mono text-[12.5px] uppercase tracking-wide px-3 py-1.5 transition-colors"
      >
        {/* Globe masqué sur mobile (< sm), visible dès la tablette */}
        <Globe size={13} className="hidden sm:block" />
        {/* Mobile : code court FR/EN · sm+ : libellé complet */}
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <span className="hidden sm:inline">{LABELS[locale as Locale]}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-label="Choisir la langue — Choose language"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-full min-w-[160px] z-[60] bg-white shadow-2xl border-t-2 border-[var(--red)] py-1.5 origin-top"
          >
            {LOCALES.map((l, i) => (
              <button
                key={l}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={locale === l}
                onClick={() => switchLocale(l)}
                onFocus={() => setFocusedIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    moveFocus(1);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    moveFocus(-1);
                  }
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 font-display text-[14px] tracking-wide transition-colors cursor-pointer ${
                  locale === l
                    ? "text-[var(--red)] bg-[#F5F2EC]"
                    : "text-[var(--navy-deep)] hover:bg-[#F5F2EC] hover:text-[var(--navy-deep)]"
                }`}
              >
                {LABELS[l]}
                {locale === l && <Check size={15} className="shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

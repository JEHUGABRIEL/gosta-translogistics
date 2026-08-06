"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroScene from "./HeroScene";
import { useQuoteModal } from "./QuoteModalProvider";

export type HeroSlide = {
  title: ReactNode;
  primaryCta?: { label: string; href: string; openQuote?: boolean };
  secondaryCta?: { label: string; href: string };
};

export default function HeroCarousel({
  id,
  slides,
  floating,
}: {
  id?: string;
  slides: HeroSlide[];
  floating?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openQuote } = useQuoteModal();

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  const slide = slides[index];

  return (
    <section
      id={id}
      className="relative bg-[var(--navy-deep)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          key={index}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <HeroScene />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-[var(--navy-deep)]/45 to-[var(--navy-deep)]/15" />
      </div>

      {/* pb-20 md:pb-28 : espace sous les boutons. Quand la barre flottante existe
          (home, desktop), lg:pb-0 car elle assure l'espacement ; sans barre
          flottante (sous-pages), le padding bas reste appliqué à tous les écrans. */}
      <div
        className={`relative mx-auto max-w-7xl px-6 pt-28 md:pt-48 pb-20 md:pb-28 ${floating ? "lg:pb-0" : ""}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <h1 className="font-display font-extrabold text-white leading-[0.95] text-[13vw] sm:text-6xl md:text-7xl max-w-4xl">
              {slide.title}
            </h1>

            <div className="flex flex-wrap gap-4 mt-14">
              {slide.primaryCta &&
                (slide.primaryCta.openQuote ? (
                  <button
                    type="button"
                    onClick={openQuote}
                    className="bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-base px-7 py-3.5 cursor-pointer"
                  >
                    {slide.primaryCta.label}
                  </button>
                ) : (
                  <a
                    href={slide.primaryCta.href}
                    className="bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-base px-7 py-3.5"
                  >
                    {slide.primaryCta.label}
                  </a>
                ))}
              {slide.secondaryCta && (
                <a
                  href={slide.secondaryCta.href}
                  className="border border-white/40 hover:border-white transition-colors text-white font-display uppercase tracking-wide text-base px-7 py-3.5"
                >
                  {slide.secondaryCta.label}
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {floating && (
        /* hidden lg:block : la barre de recherche ne s'affiche que sur desktop.
           Sur mobile, la recherche se fait via l'icône de la navbar (SearchModal). */
        <div className="relative mx-auto max-w-7xl px-6 pt-10 md:pt-14 hidden lg:block">
          {/* translate-y-1/2 : la barre est décalée de la moitié de sa propre
              hauteur → exactement à moitié dans la hero section, à moitié dehors.
              z-10 : elle se peint par-dessus la section suivante */}
          <div className="relative z-10 translate-y-1/2">{floating}</div>
        </div>
      )}
    </section>
  );
}

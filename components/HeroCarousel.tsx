"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import HeroScene from "./HeroScene";
import { useQuoteModal } from "./QuoteModalProvider";

export type HeroSlide = {
  title: ReactNode;
  image?: { src: string; alt: string };
  primaryCta?: { label: string; href: string; openQuote?: boolean };
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
    /* -mt-[var(--header-h)] : la hero remonte derrière le header sticky.
       Le header étant transparent en haut de page, sa navbar affiche alors
       le fond de la hero (image + dégradé navy) au lieu du fond du body. */
    <section
      id={id}
      className="relative bg-[var(--navy-deep)] -mt-[var(--header-h)]"
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
          {slide.image ? (
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              sizes="100vw"
              loading="eager"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <HeroScene />
          )}
        </motion.div>
        {/* Voile noir simple (style de la section devis) : assombrit
            uniformément l'image, sans dégradé ni flou. */}
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* pb-24 md:pb-32 : espace sous les boutons. Quand la barre flottante existe
          (home, desktop), lg:pb-0 car elle assure l'espacement ; sans barre
          flottante (sous-pages), le padding bas reste appliqué à tous les écrans. */}
      {/* Le padding top compense -mt-[var(--header-h)] pour que le contenu
          reste exactement à la même position qu'avant le chevauchement. */}
      <div
        className={`relative mx-auto max-w-7xl px-6 pt-[calc(var(--header-h)+8rem)] md:pt-[calc(var(--header-h)+12rem)] pb-24 md:pb-48 ${floating ? "lg:pb-0" : ""}`}
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
                    className="btn-liquid bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-base px-7 py-3.5 cursor-pointer"
                  >
                    <span className="relative z-10">{slide.primaryCta.label}</span>
                  </button>
                ) : (
                  <a
                    href={slide.primaryCta.href}
                    className="btn-liquid inline-block bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-base px-7 py-3.5"
                  >
                    <span className="relative z-10">{slide.primaryCta.label}</span>
                  </a>
                ))}
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

"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import BrushUnderline from "./BrushUnderline";
import HeroScrollBump from "./HeroScrollBump";
import HeroScene from "./HeroScene";
import { useQuoteModal } from "./QuoteModalProvider";

export type HeroCta = { label: string; href: string; openQuote?: boolean };

export type HeroSlide = {
  title: ReactNode;
  image?: { src: string; alt: string };
  primaryCta?: HeroCta;
  /** CTA secondaire, affiché à côté du principal (ex. « Nous contacter »). */
  secondaryCta?: HeroCta;
};

/**
 * Un seul carrousel pour toutes les héros du site (accueil, pages pôle et
 * prestation). La photo de la slide occupe tout le fond de la section, avec le
 * même voile sombre que la hero de /a-propos ; le texte se pose dessus, à
 * gauche. Autoplay, pause au survol/focus et `prefers-reduced-motion`
 * (WCAG 2.2.2).
 *
 * Le titre est calibré pour tenir sur **deux lignes** (une par ligne de
 * message) : la taille suit la largeur disponible (`clamp`) et la colonne
 * occupe toute la largeur utile, de sorte que la ligne la plus longue du site
 * (FR et EN) ne se replie jamais.
 *
 * Aucun bouton ni point de navigation : une pastille (« bosse ») dépasse sous
 * le bord bas de la hero et fait défiler jusqu'à la section suivante, dont
 * l'id est passé en `scrollTo`.
 */
export default function HeroCarousel({
  id,
  slides,
  scrollTo,
}: {
  id?: string;
  slides: HeroSlide[];
  /** Id (sans #) de la section suivante, cible de la pastille de défilement. */
  scrollTo?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const locale = useLocale();
  const t = useTranslations("home.hero");
  const { openQuote } = useQuoteModal();

  useEffect(() => {
    // Respecte « réduire les animations » : pas de défilement auto (WCAG 2.2.2)
    if (slides.length < 2 || paused || reduceMotion) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      6000
    );
    return () => clearInterval(timer);
  }, [slides.length, paused, reduceMotion]);

  const slide = slides[index];

  const renderCta = (
    cta: HeroCta,
    variant: "primary" | "secondary",
    key: string
  ) => {
    const className =
      variant === "primary"
        ? "btn-liquid [--liquid-fill:var(--red-dark)] bg-[var(--red)] text-white font-display uppercase tracking-wide text-base px-7 py-3.5"
        : "inline-flex items-center border border-white/40 hover:border-white transition-colors text-white font-display uppercase tracking-wide text-base px-7 py-3.5";

    return cta.openQuote ? (
      <button
        key={key}
        type="button"
        onClick={openQuote}
        className={`${className} cursor-pointer`}
      >
        <span className="relative z-10">{cta.label}</span>
      </button>
    ) : (
      <a key={key} href={cta.href} className={className}>
        <span className="relative z-10">{cta.label}</span>
      </a>
    );
  };

  return (
    /* -mt-[var(--header-h)] : la hero remonte derrière le header sticky, qui est
       transparent en haut de page. `relative z-10` : la pastille qui dépasse en
       bas doit passer au-dessus de la section suivante. */
    <div
      className="relative z-10 -mt-[var(--header-h)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <section
        id={id}
        className="relative flex min-h-[clamp(30rem,86svh,52rem)] flex-col justify-end overflow-hidden bg-[var(--navy-deep)]"
      >
        {/* Photo de la slide en plein cadre, fondu enchaîné d'une slide à l'autre */}
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {slide.image ? (
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  sizes="100vw"
                  loading="eager"
                  className="object-cover"
                />
              ) : (
                <HeroScene />
              )}
            </motion.div>
          </AnimatePresence>
          {/* Voile noir + dégradé bas : même traitement que la hero de /a-propos,
              pour la lisibilité du titre et des boutons sur la photo. */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+5rem)] pb-24 md:pb-28">
          <p className="flex items-center gap-3 font-mono text-[11.5px] uppercase tracking-[0.24em] text-[var(--amber)]">
            <span aria-hidden="true" className="h-px w-8 bg-[var(--amber)]" />
            {t("eyebrow")}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              {/* Taille réglée sur la ligne la plus longue de chaque langue : le
                  titre reste sur deux lignes, jamais trois. Les messages anglais
                  étant plus longs, leur taille est plus petite. */}
              <h1
                className={`font-display font-extrabold text-white leading-[1.02] mt-5 tracking-[-0.01em] [text-shadow:0_2px_30px_rgba(0,0,0,0.45)] ${
                  locale === "en"
                    ? "text-[clamp(0.8rem,4vw,3.6rem)]"
                    : "text-[clamp(0.85rem,5vw,3.6rem)]"
                }`}
              >
                {slide.title}
              </h1>
              <BrushUnderline className="mt-4 block h-3 w-32 md:w-40 text-[var(--amber)]" />

              <div className="flex flex-wrap gap-4 mt-8">
                {slide.primaryCta &&
                  renderCta(slide.primaryCta, "primary", "primary")}
                {slide.secondaryCta &&
                  renderCta(slide.secondaryCta, "secondary", "secondary")}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Bosse de défilement, partagée avec la hero de /a-propos. */}
      {scrollTo && <HeroScrollBump target={scrollTo} label={t("scroll")} />}
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Phone, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import { useQuoteModal } from "./QuoteModalProvider";

export default function CTASection() {
  const t = useTranslations("home.cta");
  const { openQuote } = useQuoteModal();

  return (
    <section className="relative bg-[var(--red)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
        <Reveal>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight">
            {t("title")}
          </h2>
          <p className="text-white/85 mt-3 max-w-xl">
            {t("text")}
          </p>
        </Reveal>
        {/* Boutons côte à côte dès le mobile (compact), empilés au centre si
            l'écran est vraiment trop étroit (flex-wrap) */}
        <Reveal
          delay={0.1}
          className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 shrink-0"
        >
          <button
            type="button"
            onClick={openQuote}
            className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] hover:bg-black transition-colors text-white font-display uppercase tracking-wide text-sm px-4 py-3 sm:text-base sm:px-7 sm:py-3.5 cursor-pointer"
          >
            <Phone size={17} /> {t("quote")}
          </button>
          <a
            href="https://wa.me/23675200313"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[var(--sand-deep)] transition-colors text-[var(--red)] font-display uppercase tracking-wide text-sm px-4 py-3 sm:text-base sm:px-7 sm:py-3.5"
          >
            <MessageCircle size={17} /> {t("whatsapp")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Phone, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import { useQuoteModal } from "./QuoteModalProvider";

// Numéro principal du flyer (premier de la liste du bandeau du header).
const PHONE_DISPLAY = "75 20 03 13";
const PHONE_HREF = "tel:+23675200313";

export default function CTASection() {
  const t = useTranslations("home.cta");
  const { openQuote } = useQuoteModal();

  return (
    <section className="relative bg-[var(--navy-deep)] overflow-hidden">
      {/* Bandeau photo (maquette « Looking for the best… »), assombri pour
          garder le contraste du texte blanc. */}
      <Image
        src="/hero_section/hero-4.png"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-[var(--navy-deep)]/85" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
        <Reveal>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight">
            {t("title")}
          </h2>
          <p className="text-[#cfd6e0] mt-3 max-w-xl">{t("text")}</p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 shrink-0"
        >
          <button
            type="button"
            onClick={openQuote}
            className="btn-liquid [--liquid-fill:var(--red-dark)] inline-flex items-center justify-center gap-2 bg-[var(--red)] text-white font-display uppercase tracking-wide text-sm px-5 py-3.5 sm:text-base sm:px-7 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Phone size={20} strokeWidth={2} /> {t("quote")}
            </span>
          </button>
          <a
            href="https://wa.me/23675200313"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-white/60 hover:border-white transition-colors text-white font-display uppercase tracking-wide text-sm px-5 py-3.5 sm:text-base sm:px-7"
          >
            <MessageCircle size={20} strokeWidth={2} /> {t("whatsapp")}
          </a>
        </Reveal>
      </div>

      {/* Bandeau rouge : le numéro en grand, repris de la maquette */}
      <div className="relative bg-[var(--red)]">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          <p className="font-display uppercase tracking-wide text-lg text-center sm:text-left">
            {t("callLabel")}
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-3 font-display font-extrabold text-2xl md:text-3xl hover:text-[var(--navy-deep)] transition-colors"
          >
            <Phone size={26} strokeWidth={2} />
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

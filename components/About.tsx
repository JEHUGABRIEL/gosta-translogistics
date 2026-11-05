"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import BrushUnderline from "./BrushUnderline";
import Reveal from "./Reveal";

export default function About() {
  const t = useTranslations("home.about");

  return (
    <section id="presentation" className="bg-[var(--white-warm)] overflow-x-clip">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Deux photos superposées : la 1re sur la 2e, débord de ~25 %.
            Sur mobile le texte passe devant (order-1), l'image en dessous
            (order-2) ; sur lg l'image repasse à gauche. */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative w-full max-w-md mb-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/hero_section/hero-5.png"
                alt="GOSTA TRANS, chantier"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-[6%] right-0 lg:-right-[15%] w-[55%] aspect-[3/4] overflow-hidden rounded-2xl border-4 border-[var(--white-warm)]">
              <Image
                src="/hero_section/hero-2.png"
                alt="GOSTA TRANS Logistique et BTP"
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* Texte — un seul bloc, sans onglets : les trois contenus
            (présentation, méthode, engagement) s'enchaînent à la suite. */}
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-[var(--red)]">
            {t("eyebrow")}
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)] mt-3">
            {t("title")}
          </h2>
          <BrushUnderline className="mt-3 block h-3 w-36 text-[var(--red)]" />

          <div className="mt-8 space-y-5">
            {/* Lettrine : reprise de la maquette « À propos » */}
            <p className="text-[16.5px] leading-[1.85] text-[var(--steel)] max-w-2xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.6rem] first-letter:leading-[0.75] first-letter:font-extrabold first-letter:text-[var(--navy-deep)]">
              {t("presentation")}
            </p>
            <p className="text-[16.5px] leading-[1.85] text-[var(--steel)] max-w-2xl">
              {t("methode")}
            </p>
            <p className="text-[16.5px] leading-[1.85] text-[var(--steel)] max-w-2xl">
              {t("engagement")}
            </p>
          </div>

          <Link
            href="/contact"
            className="btn-liquid inline-flex items-center gap-2 mt-8 bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-[14px] px-6 py-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("contactUs")}
              <ArrowRight size={16} strokeWidth={2} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

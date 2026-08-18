"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

export default function About() {
  const t = useTranslations("home.about");

  return (
    <section className="bg-white overflow-x-clip">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-16 items-center">
        {/* Deux photos superposées : la 1re sur la 2e, débord de ~25 %.
            Sur mobile le texte passe devant (order-1), l'image en dessous
            (order-2) ; sur lg l'image repasse à gauche. */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative w-full max-w-md mb-16">
            {/* 2e image — la base, pleine cadre. Cadre portrait 4:5 (l'ancienne
                hauteur), recadrage object-cover de la photo source. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]">
              <Image
                src="/hero_section/hero-5.png"
                alt="GOSTA TRANS — chantier"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
            </div>

            {/* 1re image — superposée sur la 2e, déborde de ~25 % à droite
                (60 % de largeur, décalée de 15 % → 15/60 = 25 %) et en bas
                (-bottom-[20 %]). Cadre 3:2, aux proportions de la photo
                source, pour éviter le recadrage.
                Sur mobile la colonne est pleine largeur : la photo reste
                alignée à droite du cadre (right-0) pour ne pas être rognée
                par overflow-x-clip ; le débord de 15 % n'est appliqué
                qu'à partir de lg, quand la colonne est assez large. */}
            <div className="absolute -bottom-[6%] right-0 lg:-right-[15%] w-[55%] aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
              <Image
                src="/hero_section/hero-2.png"
                alt="GOSTA TRANS — Logistique & BTP"
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
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>

          <div className="mt-8 space-y-5">
            <p className="text-[16.5px] leading-[1.85] text-[var(--steel)] max-w-2xl">
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
            className="inline-flex items-center gap-2 mt-8 border-2 border-[var(--navy-deep)] hover:bg-[var(--navy-deep)] text-[var(--navy-deep)] hover:text-white font-display uppercase tracking-wide text-[14px] px-6 py-3 transition-colors"
          >
            {t("contactUs")}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

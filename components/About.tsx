"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "./Reveal";

type TabKey = "presentation" | "methode" | "engagement";

export default function About() {
  const t = useTranslations("home.about");
  const [active, setActive] = useState<TabKey>("presentation");

  const TABS: { key: TabKey; label: string }[] = [
    { key: "presentation", label: t("tabPresentation") },
    { key: "methode", label: t("tabMethode") },
    { key: "engagement", label: t("tabEngagement") },
  ];

  return (
    <section className="bg-white overflow-x-clip">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-16 items-center">
        {/* Deux photos superposées : la 1re sur la 2e, débord de ~25 % */}
        <Reveal className="relative">
          <div className="relative max-w-md mb-20">
            {/* 2e image — la base, pleine cadre */}
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
                (-bottom-[20 %] → 20/80 = 25 % de sa hauteur) */}
            <div className="absolute -bottom-[20%] -right-[15%] w-[60%] aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
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

        {/* Texte */}
        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>

          {/* Onglets : soulignement rouge aligné sur le filet (pas de décroché) */}
          <div className="flex gap-2 mt-10 border-b border-[#E8E8E8]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`font-display uppercase tracking-wide text-[15px] px-5 py-3.5 border-b-2 -mb-px transition-colors ${
                  active === tab.key
                    ? "border-[var(--red)] text-[var(--navy-deep)]"
                    : "border-transparent text-[var(--steel)] hover:text-[var(--navy-deep)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Texte : corps plus grand, interligne généreux, colonne de lecture confortable */}
          <p className="text-[16.5px] leading-[1.85] text-[var(--steel)] max-w-xl mt-8 min-h-[180px]">
            {t(active)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

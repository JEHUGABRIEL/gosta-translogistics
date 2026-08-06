"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";
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
    <section className="bg-white">
      {/* pt-16 md:pt-20 : laisse de la place au formulaire de la section devis
          qui déborde sur mobile/tablette ; lg:pt-12 conserve le rythme desktop */}
      <div className="mx-auto max-w-7xl px-6 py-12 pt-16 md:pt-20 lg:pt-12 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal className="relative">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--navy-deep)] aspect-[4/5] max-w-md flex items-center justify-center relative overflow-hidden"
          >
            <Truck size={120} className="text-[var(--amber)]/90" strokeWidth={1.2} />
            <div className="absolute inset-0 border-[10px] border-white/5" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="flex absolute -bottom-8 -right-4 md:right-8 bg-[var(--red)] text-white px-6 sm:px-7 py-5 sm:py-6 max-w-[200px] sm:max-w-[220px] flex-col gap-1 shadow-xl"
          >
            <span className="font-display text-4xl font-extrabold leading-none">
              {t("badgeNumber")}
            </span>
            <span className="font-display uppercase tracking-wide text-[13px]">
              {t("badgeText")}
            </span>
          </motion.div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>

          <div className="flex gap-1 mt-8 border-b border-[#e4e0d5]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`font-display uppercase tracking-wide text-[15px] px-4 py-3 border-b-2 transition-colors ${
                  active === tab.key
                    ? "border-[var(--red)] text-[var(--navy-deep)]"
                    : "border-transparent text-[var(--steel)] hover:text-[var(--navy-deep)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-[var(--steel)] leading-relaxed mt-6 min-h-[110px]">
            {t(active)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

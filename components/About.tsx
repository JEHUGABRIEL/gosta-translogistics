"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import Reveal from "./Reveal";

const TABS = {
  Présentation:
    "GOSTA TRANS LOGISTIQUE & BTP est une entreprise centrafricaine basée à Bangui, au PK14 route de Boali. Elle réunit sous une même structure le transport de matériaux, la location d'engins avec opérateur et l'exécution de travaux de construction — du gros œuvre aux finitions.",
  Méthode:
    "Chaque demande suit le même fil : réception du besoin, mobilisation des moyens (camions, engins, équipes), puis exécution suivie sur le terrain. Cette continuité entre logistique et chantier limite les retards liés aux ruptures d'approvisionnement.",
  Engagement:
    "L'équipe intervient aussi bien sur des maisons individuelles que sur des bâtiments résidentiels, commerciaux ou industriels, ainsi que sur des chantiers de voirie et d'assainissement urbain — avec la rigueur d'un même interlocuteur du début à la fin.",
} as const;

type TabKey = keyof typeof TABS;

export default function About() {
  const [active, setActive] = useState<TabKey>("Présentation");

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-2 gap-16 items-center">
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
            className="hidden sm:flex absolute -bottom-8 -right-4 md:right-8 bg-[var(--red)] text-white px-7 py-6 max-w-[220px] flex-col gap-1 shadow-xl"
          >
            <span className="font-display text-4xl font-extrabold leading-none">2</span>
            <span className="font-display uppercase tracking-wide text-[13px]">
              métiers, un seul interlocuteur
            </span>
          </motion.div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            À propos de GOSTA TRANS
          </h2>

          <div className="flex gap-1 mt-8 border-b border-[#e4e0d5]">
            {(Object.keys(TABS) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`font-display uppercase tracking-wide text-[15px] px-4 py-3 border-b-2 transition-colors ${
                  active === tab
                    ? "border-[var(--red)] text-[var(--navy-deep)]"
                    : "border-transparent text-[var(--steel)] hover:text-[var(--navy-deep)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <p className="text-[var(--steel)] leading-relaxed mt-6 min-h-[110px]">
            {TABS[active]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

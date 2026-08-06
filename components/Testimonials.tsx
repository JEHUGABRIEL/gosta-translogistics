"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

const COMMENTS = [
  {
    role: "Client particulier",
    context: "Construction d'une maison — Bangui",
    quote:
      "Livraison des matériaux et pose du plafond staff assurées par la même équipe, sans avoir à coordonner plusieurs prestataires.",
  },
  {
    role: "Entreprise partenaire",
    context: "Chantier commercial",
    quote:
      "L'équipe mobilise vite les engins quand un imprévu retarde le planning — c'est ce qu'on demande à un partenaire logistique.",
  },
  {
    role: "Institution publique",
    context: "Aménagement urbain",
    quote:
      "Un seul interlocuteur du transport de matériaux jusqu'aux travaux de voirie, ce qui simplifie beaucoup le suivi de chantier.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % COMMENTS.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-[#F5F2EC]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Reveal>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            Commentaires
          </h2>
        </Reveal>

        <div className="mt-8 grid lg:grid-cols-[auto_1fr] gap-10 items-center">
          <Quote size={64} className="text-[var(--red)]/25 hidden lg:block" strokeWidth={1.2} />

          <div className="relative min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="font-display text-2xl md:text-3xl text-[var(--navy-deep)] leading-snug max-w-2xl">
                  &laquo; {COMMENTS[index].quote} &raquo;
                </p>
                <p className="font-mono text-[13px] uppercase tracking-wide text-[var(--red)] mt-5">
                  {COMMENTS[index].role} — {COMMENTS[index].context}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10">
          <button
            aria-label="Commentaire précédent"
            onClick={() => setIndex((i) => (i - 1 + COMMENTS.length) % COMMENTS.length)}
            className="h-9 w-9 flex items-center justify-center border border-[#c9c2ad] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {COMMENTS.map((_, i) => (
            <button
              key={i}
              aria-label={`Commentaire ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-8 transition-colors ${i === index ? "bg-[var(--red)]" : "bg-[#dcd6c7]"}`}
            />
          ))}
          <button
            aria-label="Commentaire suivant"
            onClick={() => setIndex((i) => (i + 1) % COMMENTS.length)}
            className="h-9 w-9 flex items-center justify-center border border-[#c9c2ad] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

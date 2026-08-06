"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

type Comment = {
  role: string;
  context: string;
  quote: string;
};

export default function Testimonials() {
  const t = useTranslations("home.testimonials");
  const comments = t.raw("comments") as Comment[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (comments.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % comments.length),
      7000
    );
    return () => clearInterval(timer);
  }, [comments.length]);

  return (
    <section className="bg-[#F5F2EC]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Reveal>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>
        </Reveal>

        {/* Boutons prev/next de part et d'autre du commentaire */}
        <div className="mt-8 flex items-center gap-3 sm:gap-5">
          <button
            aria-label={t("prev")}
            onClick={() => setIndex((i) => (i - 1 + comments.length) % comments.length)}
            className="shrink-0 h-11 w-11 lg:h-12 lg:w-12 flex items-center justify-center border border-[#c9c2ad] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex-1 min-w-0 grid lg:grid-cols-[auto_1fr] gap-10 items-center">
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
                    &laquo; {comments[index]?.quote} &raquo;
                  </p>
                  <p className="font-mono text-[13px] uppercase tracking-wide text-[var(--red)] mt-5">
                    {comments[index]?.role} — {comments[index]?.context}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button
            aria-label={t("next")}
            onClick={() => setIndex((i) => (i + 1) % comments.length)}
            className="shrink-0 h-11 w-11 lg:h-12 lg:w-12 flex items-center justify-center border border-[#c9c2ad] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Points indicateurs, centrés sous le commentaire */}
        <div className="flex justify-center gap-3 mt-8">
          {comments.map((_, i) => (
            <button
              key={i}
              aria-label={t("commentLabel", { n: i + 1 })}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-8 transition-colors ${i === index ? "bg-[var(--red)]" : "bg-[#dcd6c7]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

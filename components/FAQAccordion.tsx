"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";

type FAQItem = { question: string; answer: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="divide-y divide-[var(--line-soft)] border-y border-[var(--line-soft)]">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <Reveal key={item.question} delay={i * 0.04}>
            <div>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer"
              >
                <span className="font-display text-[17px] md:text-[19px] text-[var(--navy-deep)]">
                  {item.question}
                </span>
                <span
                  className={`shrink-0 h-8 w-8 flex items-center justify-center border transition-colors ${
                    open
                      ? "bg-[var(--red)] border-[var(--red)] text-white"
                      : "border-[var(--line)] text-[var(--navy-deep)]"
                  }`}
                >
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex"
                  >
                    <Plus size={16} />
                  </motion.span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-[15px] text-[var(--steel)] leading-relaxed pb-6 pr-14 max-w-2xl">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

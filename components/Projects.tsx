"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  PaintRoller,
  Landmark,
  Route,
  Warehouse,
  Anchor,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/projects";
import Reveal from "./Reveal";
import ImageCarousel from "./ImageCarousel";

// Une icône par carte, dans l'ordre de `lib/projects.ts`.
const PROJECT_ICONS = [PaintRoller, Landmark, Route, Warehouse, Anchor, Wrench];

const CARD_GAP = 24; // gap-6

export default function Projects() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("home.projects");
  const projects = getProjects(useLocale());

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    el?.scrollBy({
      left: dir * (first ? first.offsetWidth + CARD_GAP : 450),
      behavior: "smooth",
    });
  };

  // Défilement automatique : avance d'une carte toutes les 4s, puis revient au début
  useEffect(() => {
    const el = track.current;
    // Respecte « réduire les animations » : pas de défilement auto (WCAG 2.2.2)
    if (!el || reduceMotion) return;

    const interval = setInterval(() => {
      if (paused) return;
      const first = el.firstElementChild as HTMLElement | null;
      const step = first ? first.offsetWidth + CARD_GAP : 474;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [paused, reduceMotion]);

  return (
    <section id="realisations" className="bg-[var(--sand)]">
      {/* pt-24 lg:pt-40 : laisse la place au formulaire de la section devis,
          qui déborde désormais par-dessus cette section (Process ne la suit
          plus). */}
      <div className="mx-auto max-w-7xl px-6 pb-16 md:pb-20 pt-24 lg:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("title")}
            </h2>
          </Reveal>

          <div className="flex items-center gap-5">
            <Link
              href="/realisations"
              className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)]"
            >
              {t("all")}
              <ArrowRight size={15} strokeWidth={2} />
            </Link>

            <div className="flex gap-3">
            <button
              onClick={() => scroll(-1)}
              aria-label={t("prev")}
              className="h-10 w-10 flex items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--red)] hover:text-[var(--red)] text-[var(--navy-deep)] transition-colors"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label={t("next")}
              className="h-10 w-10 flex items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--red)] hover:text-[var(--red)] text-[var(--navy-deep)] transition-colors"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
            </div>
          </div>
        </div>

        <div
          ref={track}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-6 mt-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map(({ slug, title, tag, gallery }, i) => {
            const Icon = PROJECT_ICONS[i % PROJECT_ICONS.length];
            return (
              <Reveal
                key={slug}
                delay={i * 0.06}
                className="snap-start shrink-0 w-[calc(100vw-3rem)] sm:w-[450px]"
              >
                <Link
                  href={`/realisations/${slug}`}
                  className="group block h-full bg-[var(--surface)] border border-black/[0.06] rounded-2xl overflow-hidden transition-colors hover:border-[var(--red)]/40"
                >
                  <div className="overflow-hidden">
                  {gallery.length > 1 ? (
                    <ImageCarousel
                      images={gallery}
                      alt={title}
                      heightClass="h-80"
                    />
                  ) : (
                    <Image
                      src={gallery[0]}
                      alt={title}
                      width={900}
                      height={506}
                      className="h-80 w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-md">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[12px] uppercase tracking-wide text-[var(--red)]">
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] mt-5 leading-snug group-hover:text-[var(--red)] transition-colors">
                    {title}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[14px] text-[var(--red)] mt-5">
                    {t("readMore")}
                    <ArrowRight size={16} />
                  </span>
                </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

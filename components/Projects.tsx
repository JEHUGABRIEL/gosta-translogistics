"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  PaintRoller,
  Landmark,
  Route,
  Warehouse,
  Anchor,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Reveal from "./Reveal";
import ImageCarousel from "./ImageCarousel";

const PROJECT_ICONS = [PaintRoller, Landmark, Route, Warehouse, Anchor, Wrench];

// Une image (ou plusieurs pour les cartes en carrousel) par carte de réalisation
const PROJECT_GALLERIES: string[][] = [
  // Plafond staff — 3 photos de plafonds
  [
    "/realisations/plafonds/plafond-1.png",
    "/realisations/plafonds/plafond-2.png",
    "/realisations/realisations-3.png",
  ],
  // Immeubles résidentiels & commerciaux — maison avec colonnes
  ["/realisations/realisations-1.png"],
  // Voirie & aménagement urbain — chantier urbain
  ["/realisations/realisations-5.png"],
  // Bâtiments industriels — structure métallique
  ["/realisations/pergolats/pergola-1.jpg"],
  // Approvisionnement de chantiers — pose sur site
  ["/realisations/pergolats/pergola-2.jpg"],
  // Rénovation & réhabilitation — bâtiment en travaux
  ["/realisations/realisations-5.png"],
];

type ProjectItem = {
  title: string;
  tag: string;
};

const CARD_GAP = 24; // gap-6

export default function Projects() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const t = useTranslations("home.projects");
  const items = t.raw("items") as ProjectItem[];

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
    if (!el) return;

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
  }, [paused]);

  return (
    <section id="realisations" className="bg-[var(--sand)]">
      {/* pt-24 lg:pt-40 : laisse la place au formulaire de la section devis,
          qui déborde désormais par-dessus cette section (Process ne la suit
          plus). */}
      <div className="mx-auto max-w-7xl px-6 py-12 pt-24 lg:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("title")}
            </h2>
          </Reveal>

          <div className="flex gap-3">
            <button
              onClick={() => scroll(-1)}
              aria-label={t("prev")}
              className="h-10 w-10 flex items-center justify-center border border-[#D1D1D1] hover:border-[var(--red)] hover:text-[var(--red)] text-[var(--navy-deep)] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label={t("next")}
              className="h-10 w-10 flex items-center justify-center border border-[#D1D1D1] hover:border-[var(--red)] hover:text-[var(--red)] text-[var(--navy-deep)] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={track}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-6 mt-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map(({ title, tag }, i) => {
            const Icon = PROJECT_ICONS[i % PROJECT_ICONS.length];
            const gallery = PROJECT_GALLERIES[i % PROJECT_GALLERIES.length];
            return (
              <Reveal
                key={title}
                delay={i * 0.06}
                className="snap-start shrink-0 w-[calc(100vw-3rem)] sm:w-[450px]"
              >
                <div className="group h-full bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] rounded-2xl overflow-hidden">
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
                      className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[12px] uppercase tracking-wide text-[var(--red)]">
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] mt-5 leading-snug">
                    {title}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[14px] text-[var(--red)] mt-5">
                    {t("readMore")}
                    <ChevronRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

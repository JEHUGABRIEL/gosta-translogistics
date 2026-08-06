"use client";

import { useRef } from "react";
import Image from "next/image";
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

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const ITEMS = [
  {
    icon: PaintRoller,
    image: U("photo-1600607687939-ce8a6c25118c"),
    title: "Plafond staff",
    tag: "Second œuvre",
  },
  {
    icon: Landmark,
    image: U("photo-1545324418-cc1a3fa10c00"),
    title: "Immeubles résidentiels & commerciaux",
    tag: "Gros œuvre",
  },
  {
    icon: Route,
    image: U("photo-1540959733332-eab4deabeeaf"),
    title: "Voirie & aménagement urbain",
    tag: "Travaux publics",
  },
  {
    icon: Warehouse,
    image: U("photo-1586528116311-ad8dd3c8310d"),
    title: "Bâtiments industriels",
    tag: "Gros œuvre",
  },
  {
    icon: Anchor,
    image: U("photo-1494412574643-ff11b0a5c1c3"),
    title: "Approvisionnement de chantiers",
    tag: "Transport",
  },
  {
    icon: Wrench,
    image: U("photo-1560518883-ce09059eeffa"),
    title: "Rénovation & réhabilitation",
    tag: "BTP",
  },
];

export default function Projects() {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    track.current?.scrollBy({ left: dir * 450, behavior: "smooth" });
  };

  return (
    <section id="realisations" className="bg-[#F5F2EC]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              Nos réalisations
            </h2>
          </Reveal>

          <div className="flex gap-3">
            <button
              onClick={() => scroll(-1)}
              aria-label="Précédent"
              className="h-10 w-10 flex items-center justify-center border border-[#c9c2ad] hover:border-[var(--red)] hover:text-[var(--red)] text-[var(--navy-deep)] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Suivant"
              className="h-10 w-10 flex items-center justify-center border border-[#c9c2ad] hover:border-[var(--red)] hover:text-[var(--red)] text-[var(--navy-deep)] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={track}
          className="flex gap-6 mt-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {ITEMS.map(({ icon: Icon, image, title, tag }, i) => (
            <Reveal
              key={title}
              delay={i * 0.06}
              className="group snap-start shrink-0 w-[450px] bg-white border border-[#e4e0d5] hover:border-[var(--red)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
            >
              <div className="overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  width={900}
                  height={506}
                  className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 flex items-center justify-center bg-[var(--sand-deep)] text-[var(--navy-deep)] group-hover:bg-[var(--navy-deep)] group-hover:text-[var(--amber)] transition-colors">
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-[12px] uppercase tracking-wide text-[var(--red)]">
                    {tag}
                  </span>
                </div>
                <h3 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] mt-5 leading-snug">
                  {title}
                </h3>
                <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[14px] text-[var(--red)] mt-5">
                  Lire la suite
                  <ChevronRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

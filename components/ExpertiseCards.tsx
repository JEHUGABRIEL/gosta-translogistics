"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type ExpertiseCard = { title: string; text: string; href: string };

// Visuels réels du site : port, chantier, immeuble livré, voirie, logistique.
const CARD_IMAGES = [
  { src: "/hero_section/hero-1.png", alt: "Port et conteneurs, départ des livraisons" },
  { src: "/hero_section/hero-2.png", alt: "Camions et engins GOSTA TRANS" },
  { src: "/realisations/realisations-1.png", alt: "Immeuble livré par GOSTA TRANS" },
  { src: "/hero_section/hero-5.png", alt: "Second œuvre sur un chantier" },
  { src: "/realisations/realisations-5.png", alt: "Chantier de voirie à Bangui" },
  { src: "/realisations/realisations-4.png", alt: "Bâtiment équipé par GOSTA TRANS" },
];

/**
 * Six cartes du savoir-faire. La carte active s'agrandit et laisse remonter un
 * encart clair avec le détail de la prestation :
 * - au survol (et au focus clavier) sur les écrans pointeurs ;
 * - à la traversée du centre de l'écran au défilement sur mobile/tablette.
 */
export default function ExpertiseCards({
  cards,
  actionLabel,
}: {
  cards: ExpertiseCard[];
  actionLabel: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = hovered ?? active;

  return (
    <div className="mt-10 grid md:grid-cols-3 gap-5">
      {cards.map((card, i) => {
        const image = CARD_IMAGES[i % CARD_IMAGES.length];
        const isActive = current === i;
        return (
          <Link
            key={card.title}
            href={card.href}
            data-index={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            aria-label={`${card.title} — ${actionLabel}`}
            className={`group relative block h-[24rem] md:h-[26rem] overflow-hidden rounded-[1.75rem] bg-[var(--navy-deep)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
              isActive
                ? "md:scale-[1.035] md:z-20 shadow-[0_30px_70px_-40px_rgba(10,37,64,0.85)]"
                : "z-0"
            }`}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 768px) 92vw, 33vw"
              className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                isActive ? "scale-[1.06]" : "scale-100"
              }`}
            />

            {/* Voile sombre, effacé quand l'encart clair est visible */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/95 via-[var(--navy-deep)]/25 to-transparent transition-opacity duration-500 ${
                isActive ? "opacity-40" : "opacity-100"
              }`}
            />

            <div
              className={`absolute inset-x-0 bottom-0 p-7 transition-opacity duration-300 ${
                isActive ? "opacity-0" : "opacity-100"
              }`}
            >
              <h3 className="font-display font-extrabold text-2xl text-white leading-tight">
                {card.title}
              </h3>
            </div>

            {/* Détail de la prestation, sur fond clair (comme la carte du centre) */}
            <div
              className={`absolute inset-x-3 bottom-3 rounded-[1.4rem] bg-[var(--surface)] px-5 py-6 text-center shadow-[0_20px_50px_-30px_rgba(10,37,64,0.7)] transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-[calc(100%+0.75rem)] opacity-0"
              }`}
            >
              <h3 className="font-display font-extrabold text-xl text-[var(--navy-deep)] leading-snug">
                {card.title}
              </h3>
              <p className="text-[14px] text-[var(--steel)] leading-relaxed mt-2">
                {card.text}
              </p>
              <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[12.5px] text-[var(--red)] mt-4">
                {actionLabel}
                <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

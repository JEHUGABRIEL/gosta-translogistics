"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQuoteModal } from "./QuoteModalProvider";
import Reveal from "./Reveal";
import type { ServicesPayload } from "@/lib/services-payload";

type PoleCardData = ServicesPayload["poles"][number];

export default function FeaturedServices({
  locale,
  initialData,
}: {
  locale: string;
  initialData: ServicesPayload;
}) {
  const t = useTranslations("home.featured");

  // `initialData` vient du rendu serveur : la première peinture reste statique,
  // Query ne sert qu'à rafraîchir le catalogue en arrière-plan.
  const { data } = useQuery<ServicesPayload>({
    queryKey: ["services", locale],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/services?locale=${locale}`, { signal });
      if (!res.ok) throw new Error("Catalogue indisponible");
      return res.json();
    },
    initialData,
  });

  return (
    <section id="prestations" className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("title")}
            </h2>
            <p className="text-[var(--steel)] mt-4 leading-relaxed">{t("intro")}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/services"
              className="btn-liquid inline-flex items-center gap-2 bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-[14px] px-6 py-3 shrink-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("seeAll")} <ArrowRight size={16} strokeWidth={2} />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* 6 cartes sur 7 pôles : le septième reste atteignable depuis le hub. */}
          {data.poles.slice(0, 6).map((pole, i) => (
            <Reveal key={pole.id} delay={Math.min(i * 0.06, 0.3)} className="h-full">
              <PoleCard pole={pole} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PoleCard({ pole }: { pole: PoleCardData }) {
  const t = useTranslations("home.featured");
  const { openQuote } = useQuoteModal();
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  // Le geste dépend du pointeur : survol sur desktop, défilement sur mobile.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Mobile : la carte se retourne quand elle est suffisamment visible.
  useEffect(() => {
    if (!isMobile) return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFlipped(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <article
      ref={cardRef}
      aria-label={pole.label}
      className="group relative h-[26rem] select-none [perspective:1400px]"
      onMouseEnter={() => {
        if (!isMobile) setFlipped(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setFlipped(false);
      }}
      onFocusCapture={() => setFlipped(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFlipped(false);
        }
      }}
      onClick={(e) => {
        // Un tap retourne la carte, sauf s'il vise un lien ou un bouton.
        if (!isMobile) return;
        if ((e.target as HTMLElement).closest("a,button")) return;
        setFlipped((v) => !v);
      }}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        }`}
      >
        {/* Face avant : le visuel du pôle */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--navy-deep)] [backface-visibility:hidden]">
          <Image
            src={pole.image}
            alt={pole.label}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-[var(--navy-deep)]/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="font-display font-extrabold uppercase tracking-wide text-2xl text-white leading-tight">
              {pole.label}
            </h3>
            <p className="text-[#cfd6e0] text-[14px] mt-1.5">{pole.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--amber)]">
              {t("hint")} <ArrowRight size={14} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Face arrière : le détail et les deux actions */}
        <div className="absolute inset-0 flex flex-col rounded-2xl bg-[var(--navy-deep)] border border-white/10 p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h3 className="font-display font-extrabold uppercase tracking-wide text-xl text-white">
            {pole.label}
          </h3>

          <ul className="mt-4 space-y-2 flex-1">
            {pole.services.slice(0, 4).map((service) => (
              <li
                key={service.slug}
                className="flex items-start gap-2 text-[13px] text-[#cfd6e0] leading-snug"
              >
                <span
                  aria-hidden="true"
                  className="mt-[6px] h-1 w-1 shrink-0 bg-[var(--amber)]"
                />
                {service.title}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 mt-5">
            <Link
              href={`/services/${pole.id}`}
              className="inline-flex items-center justify-center gap-1.5 bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-[12.5px] px-4 py-2.5"
            >
              {t("discover")} <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <button
              type="button"
              onClick={openQuote}
              className="inline-flex items-center justify-center gap-1.5 border border-white/30 hover:border-white transition-colors text-white font-display uppercase tracking-wide text-[12.5px] px-4 py-2.5 cursor-pointer"
            >
              <MessageCircle size={14} strokeWidth={2} /> {t("contact")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

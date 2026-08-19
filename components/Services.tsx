import { Ship, Building2, Construction, ChevronRight, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 mt-6 flex-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--steel)]">
          <ChevronRight size={16} className="mt-0.5 shrink-0 text-[var(--red)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function Services() {
  const t = await getTranslations("home.services");
  const maritimeItems = t.raw("maritimeItems") as string[];
  const domainesItems = t.raw("domainesItems") as string[];
  const travauxItems = t.raw("travauxItems") as string[];

  return (
    <section id="services" className="bg-[var(--sand)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <Reveal className="max-w-2xl">
          <span className="block font-mono text-[12.5px] uppercase tracking-[0.25em] text-[var(--red)]">
            {t("eyebrow")}
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)] mt-3">
            {t("title")}
          </h2>
          <p className="text-[var(--steel)] mt-4 leading-relaxed">
            {t("subtitle")}
          </p>
        </Reveal>

        {/* Mobile : cartes empilées avec un vrai espace (space-y-4).
            md+ : grille 3 colonnes — séparation par l'ombre, sans filet. */}
        <div id="domaines" className="grid md:grid-cols-3 gap-5 md:gap-6 mt-8">
          <Reveal delay={0} className="group relative overflow-hidden bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] rounded-2xl p-8">
            <Ship
              size={170}
              strokeWidth={0.8}
              aria-hidden="true"
              className="absolute -bottom-7 -right-7 text-[var(--navy-deep)] opacity-[0.07] pointer-events-none select-none"
            />
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
              <Ship size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              {t("maritimeTitle")}
            </h3>
            <List items={maritimeItems} />
            <Link
              href="/services/logistique"
              className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13.5px] text-[var(--red)] mt-8"
            >
              {t("learnMore")} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="group relative overflow-hidden bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] rounded-2xl p-8">
            <Building2
              size={170}
              strokeWidth={0.8}
              aria-hidden="true"
              className="absolute -bottom-7 -right-7 text-[var(--navy-deep)] opacity-[0.07] pointer-events-none select-none"
            />
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
              <Building2 size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              {t("domainesTitle")}
            </h3>
            <List items={domainesItems} />
            <Link
              href="/services/btp"
              className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13.5px] text-[var(--red)] mt-8"
            >
              {t("learnMore")} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.16} className="group relative overflow-hidden bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] rounded-2xl p-8">
            <Construction
              size={170}
              strokeWidth={0.8}
              aria-hidden="true"
              className="absolute -bottom-7 -right-7 text-[var(--navy-deep)] opacity-[0.07] pointer-events-none select-none"
            />
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
              <Construction size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              {t("travauxTitle")}
            </h3>
            <List items={travauxItems} />
            <Link
              href="/services/btp"
              className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13.5px] text-[var(--red)] mt-8"
            >
              {t("learnMore")} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

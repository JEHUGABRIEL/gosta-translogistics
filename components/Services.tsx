import { Ship, Building2, Construction, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 mt-6">
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
    <section id="services" className="bg-[#F5F2EC]">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <Reveal className="max-w-2xl">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>
          <p className="text-[var(--steel)] mt-4 leading-relaxed">
            {t("subtitle")}
          </p>
        </Reveal>

        {/* Mobile : cartes empilées avec un vrai espace (space-y-4).
            md+ : grille 3 colonnes séparées par le filet de 1px (gap-px). */}
        <div
          id="domaines"
          className="grid md:grid-cols-3 gap-0 md:gap-px space-y-4 md:space-y-0 bg-[#dcd6c7] mt-8 border border-[#dcd6c7]"
        >
          <Reveal delay={0} className="relative overflow-hidden bg-white p-8">
            <Ship
              size={170}
              strokeWidth={0.8}
              aria-hidden="true"
              className="absolute -bottom-7 -right-7 text-[var(--navy-deep)] opacity-[0.07] pointer-events-none select-none"
            />
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)]">
              <Ship size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              {t("maritimeTitle")}
            </h3>
            <List items={maritimeItems} />
            <Link
              href="/services/logistique"
              className="inline-flex items-center gap-2 mt-8 border-2 border-[var(--navy-deep)] hover:bg-[var(--navy-deep)] text-[var(--navy-deep)] hover:text-white font-display uppercase tracking-wide text-[13.5px] px-5 py-2.5 transition-colors"
            >
              {t("learnMore")} <ChevronRight size={15} />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="relative overflow-hidden bg-white p-8">
            <Building2
              size={170}
              strokeWidth={0.8}
              aria-hidden="true"
              className="absolute -bottom-7 -right-7 text-[var(--navy-deep)] opacity-[0.07] pointer-events-none select-none"
            />
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)]">
              <Building2 size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              {t("domainesTitle")}
            </h3>
            <List items={domainesItems} />
            <Link
              href="/services/btp"
              className="inline-flex items-center gap-2 mt-8 border-2 border-[var(--navy-deep)] hover:bg-[var(--navy-deep)] text-[var(--navy-deep)] hover:text-white font-display uppercase tracking-wide text-[13.5px] px-5 py-2.5 transition-colors"
            >
              {t("learnMore")} <ChevronRight size={15} />
            </Link>
          </Reveal>

          <Reveal delay={0.16} className="relative overflow-hidden bg-white p-8">
            <Construction
              size={170}
              strokeWidth={0.8}
              aria-hidden="true"
              className="absolute -bottom-7 -right-7 text-[var(--navy-deep)] opacity-[0.07] pointer-events-none select-none"
            />
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)]">
              <Construction size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              {t("travauxTitle")}
            </h3>
            <List items={travauxItems} />
            <Link
              href="/services/btp"
              className="inline-flex items-center gap-2 mt-8 border-2 border-[var(--navy-deep)] hover:bg-[var(--navy-deep)] text-[var(--navy-deep)] hover:text-white font-display uppercase tracking-wide text-[13.5px] px-5 py-2.5 transition-colors"
            >
              {t("learnMore")} <ChevronRight size={15} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

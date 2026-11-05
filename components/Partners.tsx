import { Landmark, Truck, Building2, Package, HardHat, Ship } from "lucide-react";
import { getTranslations } from "next-intl/server";
import BrushUnderline from "./BrushUnderline";
import Reveal from "./Reveal";

const PARTNER_ICONS = [Landmark, Truck, Building2, Package, HardHat, Ship];

/**
 * Partenaires et donneurs d'ordre : aucune liste nominative n'étant fournie,
 * la section affiche les familles d'interlocuteurs réelles du catalogue.
 *
 * - `marquee` (accueil) : bandeau défilant.
 * - `grid` (page À propos) : mur statique façon « Conventions et partenaires »
 *   de la maquette, logos remplacés par les pictogrammes de chaque famille.
 */
export default async function Partners({
  layout = "marquee",
}: {
  layout?: "marquee" | "grid";
}) {
  const t = await getTranslations("home.partners");
  const labels = t.raw("items") as string[];

  const PARTNERS = PARTNER_ICONS.map((icon, i) => ({
    icon,
    label: labels[i] ?? "",
  }));

  if (layout === "grid") {
    return (
      <section className="bg-[var(--white-warm)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Reveal className="flex flex-col items-center text-center">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)]">
              {t("title")}
            </h2>
            <BrushUnderline className="mt-3 block h-3 w-32 md:w-40 text-[var(--red)]" />
          </Reveal>

          <ul className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12 max-w-4xl mx-auto">
            {PARTNERS.map(({ icon: Icon, label }, i) => (
              <Reveal key={label} delay={Math.min(i * 0.05, 0.25)}>
                <li className="flex flex-col items-center text-center">
                  <Icon
                    aria-hidden="true"
                    size={46}
                    strokeWidth={1.2}
                    className="text-[var(--navy-deep)]"
                  />
                  <span className="font-display uppercase tracking-wide text-[13px] text-[var(--steel)] mt-5 leading-snug">
                    {label}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section className="bg-[var(--white-warm)] overflow-hidden">
      {/* Séparation par l'espacement (py-16) plutôt que par un filet */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>
        </Reveal>
      </div>

      <div className="relative mt-10 py-8">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--white-warm)] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--white-warm)] to-transparent z-10" />
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-16">
          {loop.map(({ icon: Icon, label }, i) => (
            <div
              key={`${label}-${i}`}
              className="flex items-center gap-3 text-[var(--steel)] shrink-0"
            >
              <Icon size={24} strokeWidth={1.8} className="text-[var(--navy-deep)]" />
              <span className="font-display uppercase tracking-wide text-[15px] whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

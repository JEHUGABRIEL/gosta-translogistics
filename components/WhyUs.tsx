import { getTranslations } from "next-intl/server";
import { UserRound, Truck, Timer, Ship } from "lucide-react";
import Reveal from "./Reveal";

const ICONS = [UserRound, Truck, Timer, Ship];

/**
 * Quatre arguments, chacun dérivé d'une prestation déjà décrite au catalogue :
 * aucune promesse chiffrée, aucun chiffre inventé.
 */
export default async function WhyUs() {
  const t = await getTranslations("home.why");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section id="pourquoi-nous" className="bg-[var(--sand)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("title")}
            </h2>
            <p className="text-[var(--steel)] mt-4 leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>

        {/* Deux colonnes, écarts décalés : pas de rangée de trois cartes identiques */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7 mt-10">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal
                key={item.title}
                delay={i * 0.06}
                className={i % 2 === 1 ? "sm:mt-8" : undefined}
              >
                <div className="flex items-start gap-4 border-t border-[var(--line)] pt-5">
                  <span className="h-11 w-11 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-md shrink-0">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-display uppercase tracking-wide text-[17px] text-[var(--navy-deep)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[14.5px] text-[var(--steel)] leading-relaxed mt-2">
                      {item.text}
                    </p>
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

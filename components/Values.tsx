import { getTranslations } from "next-intl/server";
import { ShieldCheck, HardHat, MapPin, Handshake } from "lucide-react";
import BrushUnderline from "./BrushUnderline";
import Reveal from "./Reveal";

const ICONS = [ShieldCheck, HardHat, MapPin, Handshake];

/**
 * « Nos valeurs » — quatre engagements concrets, sans chiffre inventé.
 * Bandeau navy de la maquette : titre centré souligné au pinceau, puis une
 * grille de cartes translucides avec icônes ambre (seul accent autorisé sur
 * fond sombre).
 */
export default async function Values() {
  const t = await getTranslations("values");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section id="nos-valeurs" className="relative bg-[var(--navy-deep)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <Reveal className="text-center">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            {t("title")}
          </h2>
          <BrushUnderline className="mx-auto mt-3 block h-3 w-36 md:w-44 text-[var(--amber)]" />
          <p className="text-white/65 mt-6 max-w-xl mx-auto leading-relaxed">
            {t("intro")}
          </p>
        </Reveal>

        <div className="mt-12 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={item.title} delay={i * 0.06} className="h-full">
                <div className="h-full flex flex-col items-center text-center bg-white/[0.05] border border-white/10 rounded-[1.75rem] px-6 py-9">
                  <Icon
                    aria-hidden="true"
                    size={42}
                    strokeWidth={1.3}
                    className="text-[var(--amber)]"
                  />
                  <h3 className="font-display font-bold text-[18px] text-white leading-snug mt-5">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] text-white/65 leading-relaxed mt-3">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

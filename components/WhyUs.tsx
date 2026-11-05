import { getTranslations } from "next-intl/server";
import { UserRound, Truck, Timer, Ship } from "lucide-react";
import BrushUnderline from "./BrushUnderline";
import Reveal from "./Reveal";

const ICONS = [UserRound, Truck, Timer, Ship];

/**
 * « Pourquoi nous » : les quatre arguments qui reviennent quand un client
 * compare deux prestataires. Aucune promesse chiffrée, aucun chiffre inventé.
 * La section est posée par-dessus l'image plein cadre qui la précède
 * (voir `ScrollCover` sur l'accueil).
 */
export default async function WhyUs() {
  const t = await getTranslations("home.why");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section id="pourquoi-nous" className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)] leading-[1.05]">
              {t("title")}
            </h2>
            <BrushUnderline className="mt-3 block h-3 w-36 md:w-44 text-[var(--red)]" />
            <p className="text-[var(--steel)] leading-relaxed mt-6 max-w-md">
              {t("intro")}
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-9">
            {items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="border-t border-[var(--line)] pt-5">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-md shrink-0">
                        <Icon size={19} strokeWidth={1.8} />
                      </span>
                      <h3 className="font-display font-bold text-[17px] text-[var(--navy-deep)] leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[14.5px] text-[var(--steel)] leading-relaxed mt-3">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

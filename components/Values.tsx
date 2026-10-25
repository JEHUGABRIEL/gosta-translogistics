import { getTranslations } from "next-intl/server";
import { ShieldCheck, HardHat, MapPin, Handshake } from "lucide-react";
import Reveal from "./Reveal";

const ICONS = [ShieldCheck, HardHat, MapPin, Handshake];

/**
 * « Nos valeurs » — quatre engagements concrets, sans chiffre inventé.
 * Partagé par l'accueil et la page À propos (même contenu, même ordre).
 */
export default async function Values() {
  const t = await getTranslations("values");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section id="nos-valeurs" className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-[var(--red)]">
              {t("eyebrow")}
            </p>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)] mt-3">
              {t("title")}
            </h2>
            <p className="text-[var(--steel)] mt-4 leading-relaxed">{t("intro")}</p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mt-10">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="group h-full bg-[var(--surface)] border border-black/[0.06] border-l-2 border-l-[var(--red)] rounded-2xl p-6 md:p-7">
                  <div className="flex items-start gap-4">
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
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

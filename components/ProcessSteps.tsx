import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BrushUnderline from "./BrushUnderline";
import Reveal from "./Reveal";

/**
 * « Une structure solide et transparente » (maquette À propos) : le
 * déroulé d'une opération, de la demande à la réception, en quatre étapes
 * numérotées. Chaque étape décrit une pratique déjà annoncée sur le site.
 */
export default async function ProcessSteps() {
  const t = await getTranslations("about.process");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--navy-deep)] max-w-xl leading-[1.05]">
            {t("title")}
          </h2>
          <BrushUnderline className="mt-3 block h-3 w-36 md:w-44 text-[var(--red)]" />
        </Reveal>

        <div className="mt-10 md:mt-12 grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-stretch">
          {/* Sur lg la photo prend la hauteur des cartes, sans la dépasser */}
          <Reveal className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[22rem] overflow-hidden rounded-2xl">
            <Image
              src="/realisations/realisations-5.png"
              alt={t("photo")}
              fill
              sizes="(max-width: 1024px) 100vw, 440px"
              className="object-cover"
            />
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.06, 0.2)} className="h-full">
                <div className="h-full bg-[var(--surface)] border border-black/[0.06] rounded-2xl px-6 py-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display font-bold text-[18px] text-[var(--navy-deep)] leading-snug">
                      {item.title}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="font-display font-extrabold text-[28px] leading-none text-[var(--red)]/35"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-[14.5px] text-[var(--steel)] leading-relaxed mt-3">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

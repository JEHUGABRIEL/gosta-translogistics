import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "./Reveal";

/**
 * Section équipe : aucun nom ni visage inventé. On montre deux photos de chantier
 * et les familles de métiers, qui correspondent aux pôles réellement décrits au
 * catalogue. Les personnes et coordonnées restent à fournir par l'entreprise.
 */
export default async function OurTeam() {
  const t = await getTranslations("home.team");
  const roles = t.raw("roles") as string[];

  return (
    <section id="equipe" className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal className="relative">
          {/* Deux photos superposées, reprise du principe du bloc À propos */}
          <div className="relative w-full max-w-lg mb-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.06]">
              <Image
                src="/hero_section/hero-2.png"
                alt={t("photo1")}
                fill
                sizes="(max-width: 1024px) 100vw, 512px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-[8%] right-0 lg:-right-[10%] w-[52%] aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.06]">
              <Image
                src="/hero_section/hero-5.png"
                alt={t("photo2")}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>
          <p className="text-[16.5px] leading-[1.85] text-[var(--steel)] mt-5 max-w-xl">
            {t("intro")}
          </p>

          <ul className="mt-7 grid sm:grid-cols-2 gap-3">
            {roles.map((role) => (
              <li
                key={role}
                className="flex items-start gap-2.5 text-[15px] text-[var(--navy-deep)] border border-black/[0.06] bg-[var(--surface)] rounded-md px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-[var(--red)]"
                />
                {role}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

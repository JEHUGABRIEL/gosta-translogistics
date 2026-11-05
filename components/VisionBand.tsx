import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BrushUnderline from "./BrushUnderline";
import Reveal from "./Reveal";

/**
 * Bande « vision », reprise de la page À propos de la maquette : photo plein
 * cadre assombrie, texte à gauche sur deux paragraphes. Aucune promesse
 * chiffrée, uniquement ce que l'entreprise fait déjà.
 */
export default async function VisionBand() {
  const t = await getTranslations("about.vision");

  return (
    <section className="relative bg-[var(--navy-deep)] overflow-hidden">
      <Image
        src="/hero_section/hero-6.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[var(--navy-deep)]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-deep)]/90 via-[var(--navy-deep)]/45 to-transparent" />

      {/* Padding haut calé sur la navbar : la bande s'épingle sous le bandeau
          quand « Nos valeurs » la recouvre, le titre doit rester visible. */}
      <div className="relative mx-auto max-w-7xl px-6 pt-[calc(var(--header-h)+2.5rem)] pb-20 md:pt-28 md:pb-28">
        <Reveal className="max-w-xl">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-[1.05]">
            {t("title")}
          </h2>
          <BrushUnderline className="mt-3 block h-3 w-36 md:w-44 text-[var(--amber)]" />
          <div className="mt-7 space-y-5">
            <p className="text-white/80 text-[16px] leading-[1.85]">{t("text1")}</p>
            <p className="text-white/80 text-[16px] leading-[1.85]">{t("text2")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

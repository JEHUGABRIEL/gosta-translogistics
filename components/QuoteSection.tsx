import Image from "next/image";
import { getTranslations } from "next-intl/server";
import QuoteForm from "./QuoteForm";

export default async function QuoteSection() {
  const t = await getTranslations("home.quote");

  return (
    <section id="devis" className="bg-[var(--navy-deep)] relative">
      {/* Image de fond + traitement inversé depuis la hero : dégradé navy,
          voile noir flouté et voile haut (pas d'overflow-hidden : le formulaire
          déborde volontairement du bas de la section). */}
      <Image
        src="/hero_section/hero-1.png"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-[var(--navy-deep)]/45 to-[var(--navy-deep)]/15" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--navy-deep)]/90 via-[var(--navy-deep)]/40 to-transparent" />

      {/* pb-0 + translate-y-16/20 : le formulaire déborde du bas de la section sur
          mobile/tablette (sans créer de grand vide entre le texte et le formulaire).
          Sur desktop, lg:translate-y-28 conserve le débordement d'origine. */}
      <div className="relative mx-auto max-w-7xl px-6 pt-12 lg:pt-14 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight">
            {t("title")}
          </h2>
          <p className="text-[#cfd6e0] mt-4 leading-relaxed max-w-md">
            {t("text")}
          </p>
        </div>

        <div className="relative z-10 bg-[var(--sand)] rounded-2xl p-8 md:p-10 shadow-2xl translate-y-12 md:translate-y-14 lg:translate-y-28">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

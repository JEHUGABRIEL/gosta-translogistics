import { getTranslations } from "next-intl/server";
import QuoteForm from "./QuoteForm";

export default async function QuoteSection() {
  const t = await getTranslations("home.quote");

  return (
    <section id="devis" className="bg-[var(--navy-deep)] relative">
      {/* pb-0 + translate-y-16/20 : le formulaire déborde du bas de la section sur
          mobile/tablette (sans créer de grand vide entre le texte et le formulaire).
          Sur desktop, lg:translate-y-28 conserve le débordement d'origine. */}
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:pt-14 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight">
            {t("title")}
          </h2>
          <p className="text-[#cfd6e0] mt-4 leading-relaxed max-w-md">
            {t("text")}
          </p>
        </div>

        <div className="relative z-10 bg-[#F5F2EC] p-8 md:p-10 shadow-2xl translate-y-12 md:translate-y-14 lg:translate-y-28">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

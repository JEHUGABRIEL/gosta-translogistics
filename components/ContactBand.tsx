import { getTranslations } from "next-intl/server";
import Reveal from "./Reveal";
import BrushUnderline from "./BrushUnderline";
import ContactMessageForm from "./ContactMessageForm";

/**
 * Bloc « Contact » de la maquette de référence : bandeau navy plein cadre,
 * titre centré souligné, puis le formulaire de message du site (enregistré en
 * base et visible dans la boîte de réception du dashboard), décliné en clair
 * sur fond sombre.
 */
export default async function ContactBand() {
  const t = await getTranslations("home.contactBand");

  return (
    <section
      id="nous-ecrire"
      className="relative overflow-hidden bg-[var(--navy-deep)]"
    >
      {/* Halos décoratifs très discrets, comme la bulle de la maquette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-24 h-[28rem] w-[28rem] rounded-full border border-white/[0.07]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-[20rem] w-[20rem] rounded-full border border-white/[0.05]"
      />

      <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Reveal className="text-center">
          <h2 className="font-display font-extrabold text-4xl md:text-6xl text-white">
            {t("title")}
          </h2>
          <BrushUnderline className="mx-auto mt-3 h-3 w-28 md:w-36 text-[var(--red)]" />
          <p className="text-white/70 mt-6 max-w-xl mx-auto leading-relaxed">
            {t("intro")}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <ContactMessageForm variant="navy" requireConsent />
        </Reveal>
      </div>
    </section>
  );
}

import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/lib/services";

export default async function ServiceShowcase() {
  const t = await getTranslations("home.serviceShowcase");
  const locale = await getLocale();
  const { btp, logistique } = getServices(locale);

  return (
    <>
      {/* ===== Nos services BTP ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("btpTitle")}
            </h2>
            <p className="text-[var(--steel)] mt-4 leading-relaxed">
              {t("btpText")}
            </p>
          </Reveal>

          {/* Seulement 3 cartes affichées — le bouton « Voir tous nos
              services » mène au catalogue complet. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-8">
            {btp.slice(0, 3).map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.06}>
                <Link
                  href={`/services/btp/${s.slug}`}
                  className="group flex flex-col h-full bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] rounded-2xl p-6"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
                    <s.icon size={22} />
                  </div>
                  <h3 className="font-display uppercase tracking-wide text-[17px] text-[var(--navy-deep)] mt-5 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-[14px] text-[var(--steel)] leading-relaxed mt-2 flex-1">
                    {s.short}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                    {t("seeAll")}
                    <ArrowRightInline />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10">
            <Link
              href="/services/btp"
              className="inline-flex items-center gap-2 bg-[var(--red)] hover:bg-[var(--red-dark)] text-white transition-colors font-display uppercase tracking-wide text-[14px] px-6 py-3"
            >
              {t("seeAll")} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== Nos services Logistique ===== */}
      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("logistiqueTitle")}
            </h2>
            <p className="text-[var(--steel)] mt-4 leading-relaxed">
              {t("logistiqueText")}
            </p>
          </Reveal>

          {/* Seulement 3 cartes affichées — le bouton « Voir tous nos
              services » mène au catalogue complet. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-8">
            {logistique.slice(0, 3).map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.06}>
                <Link
                  href={`/services/logistique/${s.slug}`}
                  className="group flex flex-col h-full bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] rounded-2xl p-6"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
                    <s.icon size={22} />
                  </div>
                  <h3 className="font-display uppercase tracking-wide text-[17px] text-[var(--navy-deep)] mt-5 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-[14px] text-[var(--steel)] leading-relaxed mt-2 flex-1">
                    {s.short}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                    {t("seeAll")}
                    <ArrowRightInline />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10">
            <Link
              href="/services/logistique"
              className="inline-flex items-center gap-2 bg-[var(--red)] hover:bg-[var(--red-dark)] text-white transition-colors font-display uppercase tracking-wide text-[14px] px-6 py-3"
            >
              {t("seeAll")} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ArrowRightInline() {
  return (
    <ArrowRight
      size={14}
      className="transition-transform duration-200 group-hover:translate-x-1"
    />
  );
}

import { ChevronRight, CheckCircle2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import QuoteButton from "@/components/QuoteButton";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/lib/services";

export default async function ServiceDetailTemplate({
  base,
  service,
  related,
}: {
  base: string;
  service: Service;
  related: Service[];
}) {
  const t = await getTranslations("services.detail");
  const locale = await getLocale();

  const slides: HeroSlide[] = [
    {
      title: service.title.toUpperCase(),
      primaryCta: { label: t("quote"), href: "#devis", openQuote: true },
    },
  ];

  return (
    <main>
      <Header />
      <HeroCarousel slides={slides} />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-[2fr_1fr] gap-16">
          <div>
            <Reveal>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
                {service.title}
              </h1>
              <p
                className="text-[var(--steel)] mt-5 leading-relaxed text-[17px] max-w-2xl"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </Reveal>

            <Reveal delay={0.1} className="grid sm:grid-cols-2 gap-4 mt-8">
              {service.bullets.map((b) => (
                <div key={b} className="flex items-start gap-3 bg-white border border-black/[0.06] rounded-xl p-4">
                  <CheckCircle2 size={18} className="text-[var(--red)] mt-0.5 shrink-0" />
                  <span className="text-[14.5px] text-[var(--navy-deep)] leading-snug">{b}</span>
                </div>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="bg-[var(--navy-deep)] rounded-2xl p-8 sticky top-28">
              <h2 className="font-display uppercase tracking-wide text-xl text-white">
                {t("similar")}
              </h2>
              <p className="text-[#cfd6e0] text-[14.5px] mt-3 leading-relaxed">
                {t("similarText")}
              </p>
              <QuoteButton className="btn-liquid inline-flex items-center justify-center w-full mt-6 bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-[15px] px-5 py-3 cursor-pointer">
                <span className="relative z-10">{t("quote")}</span>
              </QuoteButton>
              <a
                href="https://wa.me/23675200313"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full mt-3 border border-white/25 hover:border-[var(--red)] hover:text-[var(--red)] transition-colors text-white font-display uppercase tracking-wide text-[15px] px-5 py-3"
              >
                {t("whatsapp")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Même fond que la section précédente — séparée par l'espacement */}
      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)]">
              {t("relatedTitle")}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.06}>
                <Link
                  href={`${base}/${s.slug}`}
                  className="group flex items-center gap-4 bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] rounded-2xl p-5"
                >
                  <div className="h-10 w-10 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl shrink-0">
                    <s.icon size={20} />
                  </div>
                  <span className="font-display uppercase tracking-wide text-[15px] text-[var(--navy-deep)] group-hover:text-[var(--red)] transition-colors flex-1">
                    {s.title}
                  </span>
                  <ChevronRight size={16} className="text-[var(--steel)] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}

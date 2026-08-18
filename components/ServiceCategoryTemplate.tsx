import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/lib/services";

export default async function ServiceCategoryTemplate({
  base,
  heading,
  intro,
  slides,
  services,
}: {
  base: string;
  heading: string;
  intro: string;
  slides: HeroSlide[];
  services: Service[];
}) {
  const t = await getTranslations("services.detail");

  return (
    <main>
      <Header />
      <HeroCarousel slides={slides} />

      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Reveal className="max-w-2xl">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {heading}
            </h1>
            <p className="text-[var(--steel)] mt-4 leading-relaxed">{intro}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.06}>
                <Link
                  href={`${base}/${s.slug}`}
                  className="group flex flex-col h-full bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] rounded-2xl p-7"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
                    <s.icon size={22} />
                  </div>
                  <h2 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] mt-5">
                    {s.title}
                  </h2>
                  <p className="text-[14.5px] text-[var(--steel)] leading-relaxed mt-2 flex-1">
                    {s.short}
                  </p>
                  <span className="flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                    {t("discover")} <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
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

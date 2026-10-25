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
        <div className="relative mx-auto max-w-7xl px-6 py-12">
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
                  className="group flex flex-col h-full bg-[var(--surface)] border border-black/[0.06] hover:-translate-y-[3px] transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] rounded-2xl p-7"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-md">
                    <s.icon size={24} strokeWidth={1.8} />
                  </div>
                  <h2 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] mt-5">
                    {s.title}
                  </h2>
                  <p className="text-[14.5px] text-[var(--steel)] leading-relaxed mt-2 flex-1">
                    {s.short}
                  </p>
                  <span className="flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                    {t("discover")} <ChevronRight size={16} strokeWidth={2} />
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

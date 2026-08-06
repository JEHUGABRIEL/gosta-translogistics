import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import type { Service } from "@/lib/services";

export default function ServiceCategoryTemplate({
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
  return (
    <main>
      <Header />
      <HeroCarousel slides={slides} />

      <section className="bg-[#F5F2EC]">
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
                  className="group flex flex-col h-full bg-white border border-[#e4e0d5] hover:border-[var(--red)] hover:-translate-y-1.5 transition-all duration-300 p-7"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[var(--sand-deep)] text-[var(--navy-deep)] group-hover:bg-[var(--navy-deep)] group-hover:text-[var(--amber)] transition-colors">
                    <s.icon size={22} />
                  </div>
                  <h2 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] mt-5">
                    {s.title}
                  </h2>
                  <p className="text-[14.5px] text-[var(--steel)] leading-relaxed mt-2 flex-1">
                    {s.short}
                  </p>
                  <span className="flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                    Découvrir <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
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

import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";
import { SERVICES_HERO_IMAGE } from "@/lib/hero-images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.hub" });
  return pageMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    pathname: "/services",
    locale,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.hub");
  const { poles, byPole } = getServices(locale);

  return (
    <main>
      <Header />

      <section className="relative bg-[var(--navy-deep)] overflow-hidden -mt-[var(--header-h)]">
        <Image
          src={SERVICES_HERO_IMAGE.src}
          alt={SERVICES_HERO_IMAGE.alt}
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover"
        />
        {/* Voile noir simple : même traitement que les héros à photo (HeroCarousel) */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-7xl px-6 pt-[calc(var(--header-h)+5rem)] md:pt-[calc(var(--header-h)+6rem)] pb-16 md:pb-20">
          <Reveal>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[0.95] mt-4 max-w-3xl">
              {t("title")}
            </h1>
            <p className="text-[#cfd6e0] mt-5 max-w-xl leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--sand)]">
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 space-y-16">
          {poles.map((pole) => {
            const services = byPole[pole.id];
            const Icon = pole.icon;

            return (
              <div key={pole.id} id={pole.id} className="scroll-mt-28">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <Reveal className="flex items-center gap-4">
                    <span className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-md shrink-0">
                      <Icon size={24} strokeWidth={1.8} />
                    </span>
                    <span>
                      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[var(--navy-deep)] uppercase tracking-wide">
                        {pole.label}
                      </h2>
                      <span className="block text-[14.5px] text-[var(--steel)] mt-1">
                        {pole.tagline}
                      </span>
                    </span>
                  </Reveal>

                  <Reveal delay={0.05}>
                    <Link
                      href={`/services/${pole.id}`}
                      className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)]"
                    >
                      {t("seePole")} <ChevronRight size={15} strokeWidth={2} />
                    </Link>
                  </Reveal>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {services.map((service, i) => (
                    <Reveal key={service.slug} delay={Math.min(i * 0.04, 0.2)}>
                      <Link
                        href={`/services/${pole.id}/${service.slug}`}
                        className="group flex h-full flex-col bg-[var(--surface)] border border-black/[0.06] rounded-2xl p-5 hover:-translate-y-[3px] transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                      >
                        <span className="font-display uppercase tracking-wide text-[15.5px] text-[var(--navy-deep)] group-hover:text-[var(--red)] transition-colors leading-snug">
                          {service.title}
                        </span>
                        <span className="text-[14px] text-[var(--steel)] leading-relaxed mt-2 flex-1">
                          {service.short}
                        </span>
                        <span className="inline-flex items-center gap-1.5 mt-4 font-mono text-[11.5px] uppercase tracking-[0.18em] text-[var(--red)]">
                          {t("seeService")} <ChevronRight size={13} strokeWidth={2} />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}

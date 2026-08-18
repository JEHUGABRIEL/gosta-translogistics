import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import About from "@/components/About";
import QuoteForm from "@/components/QuoteForm";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";
import { SOCIAL_LINKS } from "@/lib/social";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    pathname: "/contact",
    locale,
  });
}

const CONTACT_ITEMS: {
  id: string;
  icon: LucideIcon;
  href?: string;
}[] = [
  { id: "address", icon: MapPin, href: SOCIAL_LINKS.googleMaps },
  { id: "phone", icon: Phone, href: "tel:+23670120025" },
  { id: "whatsapp", icon: MessageCircle, href: SOCIAL_LINKS.whatsapp },
  {
    id: "email",
    icon: Mail,
    href: "mailto:gostatranslogistiquebtp@outlook.fr",
  },
  { id: "hours", icon: Clock },
];

const SOCIAL_BUTTONS = [
  { href: SOCIAL_LINKS.facebook, labelKey: "facebook", Icon: FacebookIcon },
  { href: SOCIAL_LINKS.instagram, labelKey: "instagram", Icon: InstagramIcon },
  { href: SOCIAL_LINKS.whatsapp, labelKey: "whatsapp", Icon: WhatsAppIcon },
];

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tSocial = await getTranslations("social");
  const tInfo = await getTranslations();

  return (
    <main>
      <Header />

      {/* ===== Hero ===== */}
      <section className="relative bg-[var(--navy-deep)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-mid)]/70 via-[var(--navy-deep)] to-[var(--navy-deep)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Reveal>
            <span className="font-mono text-[12.5px] uppercase tracking-[0.25em] text-[var(--amber)]">
              {t("eyebrow")}
            </span>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white leading-[0.95] mt-4">
              {t("title")}
            </h1>
            <p className="text-[#cfd6e0] mt-5 max-w-xl leading-relaxed">
              {t("intro")}
            </p>
            <div className="flex flex-wrap gap-4 mt-9">
              <a
                href="tel:+23670120025"
                className="inline-flex items-center justify-center gap-2 bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-base px-7 py-3.5"
              >
                <Phone size={17} /> {t("call")}
              </a>
              <a
                href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(
                  tInfo("whatsappInfo")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/40 hover:border-[var(--red)] hover:text-[var(--red)] transition-colors text-white font-display uppercase tracking-wide text-base px-7 py-3.5"
              >
                <WhatsAppIcon size={18} /> {t("whatsapp")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== À propos ===== */}
      <About />

      {/* ===== Contact ===== */}
      <section className="bg-[var(--sand)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Reveal>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
                {t("sectionTitle")}
              </h2>
              <p className="text-[var(--steel)] mt-4 leading-relaxed max-w-md">
                {t("sectionText")}
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-4 mt-9">
              {CONTACT_ITEMS.map((item, i) => {
                const inner = (
                  <div className="h-full bg-white border border-black/[0.06] rounded-2xl p-5 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)]">
                    <div className="h-10 w-10 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
                      <item.icon size={20} />
                    </div>
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-[var(--steel)] mt-4">
                      {t(`items.${item.id}.label`)}
                    </span>
                    <span
                      className={`${
                        item.id === "email"
                          ? "font-mono text-[14.5px] normal-case tracking-normal break-all"
                          : "font-display uppercase tracking-wide text-[16px]"
                      } text-[var(--navy-deep)] leading-snug mt-1 group-hover:text-[var(--red)] transition-colors`}
                    >
                      {t(`items.${item.id}.value`)}
                    </span>
                  </div>
                );

                return (
                  <Reveal key={item.id} delay={i * 0.05} className="h-full">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="block h-full group hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="block h-full group hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]">
                        {inner}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.25} className="mt-9">
              <div className="flex flex-wrap items-center gap-3">
                {SOCIAL_BUTTONS.map(({ href, labelKey, Icon }) => (
                  <a
                    key={labelKey}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tSocial(labelKey)}
                    className="h-11 w-11 flex items-center justify-center bg-white border border-[#E8E8E8] text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] hover:-translate-y-0.5 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                ))}
                <a
                  href={SOCIAL_LINKS.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 ml-1 border border-[var(--navy-deep)] hover:bg-[var(--navy-deep)] hover:text-white transition-colors text-[var(--navy-deep)] font-display uppercase tracking-wide text-[13px] px-4 py-3"
                >
                  <MapPin size={15} /> {t("maps")}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:sticky lg:top-32">
            <div className="bg-white border-t-4 border-[var(--red)] shadow-2xl rounded-2xl p-7 md:p-10">
              <h3 className="font-display uppercase text-2xl text-[var(--navy-deep)]">
                {t("formTitle")}
              </h3>
              <p className="text-[var(--steel)] mt-2 text-[14.5px] leading-relaxed">
                {t("formText")}
              </p>
              <div className="mt-6">
                <QuoteForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Plan d'accès ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("findTitle")}
            </h2>
            <p className="text-[var(--steel)] mt-4 leading-relaxed max-w-xl">
              {t("findText")}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-9">
            <div className="relative border border-[#E8E8E8] shadow-xl rounded-2xl overflow-hidden">
              <iframe
                title={t("findTitle")}
                src="https://www.google.com/maps?q=PK14+Route+de+Boali+Bangui+RCA&output=embed"
                className="w-full h-[380px] md:h-[460px] block"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={SOCIAL_LINKS.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-[15px] px-6 py-3"
            >
              {t("maps")} <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

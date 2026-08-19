import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "./SocialIcons";
import { SOCIAL_LINKS, SITES } from "@/lib/social";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  // Destinations réelles du site : pages + ancres de la page d'accueil.
  const navLinks = [
    { href: "/", label: tNav("home") },
    { href: "/services/btp", label: tNav("btp") },
    { href: "/services/logistique", label: tNav("logistique") },
    { href: "/#realisations", label: t("realisations") },
    { href: "/#actualites", label: t("news") },
    { href: "/contact", label: tNav("contact") },
  ] as const;

  const socials = [
    { href: SOCIAL_LINKS.facebook, label: t("facebook"), Icon: FacebookIcon },
    { href: SOCIAL_LINKS.instagram, label: t("instagram"), Icon: InstagramIcon },
    { href: SOCIAL_LINKS.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  ];

  return (
    <footer id="contact" className="bg-[var(--navy-deep)] text-[#cfd6e0]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Grille volontairement asymétrique (4 / 2 / 3 / 3) : la marque porte
            l'espace, la navigation reste compacte, contact et localisation
            sont deux blocs distincts de taille égale. */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* ===== Marque + actions ===== */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex flex-col items-start">
              <Image
                src="/brand/logo-full.png"
                alt="GOSTA TRANS"
                width={1030}
                height={524}
                className="h-24 w-auto"
              />
              <span className="font-display uppercase tracking-[0.18em] text-[12.5px] text-[var(--amber)] mt-2.5">
                {t("tagline")}
              </span>
            </Link>

            <p className="text-white text-[15px] leading-relaxed mt-5 max-w-sm">
              {t("copyright")}
            </p>
            <p className="text-[14px] leading-relaxed mt-3 max-w-sm">
              {t("text")}
            </p>

            {/* Joindre l'équipe tout de suite */}
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="tel:+23670120025"
                className="btn-liquid inline-flex items-center gap-2 bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-[13px] px-5 py-3"
              >
                <Phone size={16} /> {t("call")}
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/25 text-white hover:border-[var(--red)] transition-colors font-display uppercase tracking-wide text-[13px] px-5 py-3"
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8b96a8]">
                {t("followTitle")}
              </span>
              <div className="flex items-center gap-3 mt-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-white/20 text-[#cfd6e0] hover:border-[var(--red)] hover:text-[var(--red)] hover:-translate-y-0.5 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Navigation ===== */}
          <nav aria-label={t("navTitle")} className="lg:col-span-2">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.25em] text-[var(--amber)]">
              {t("navTitle")}
            </h2>
            <ul className="mt-5 space-y-3 text-[14.5px]">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block text-[#cfd6e0] hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ===== Contact ===== */}
          <div className="lg:col-span-3">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.25em] text-[var(--amber)]">
              {t("contactTitle")}
            </h2>
            <ul className="mt-5 space-y-4 text-[14.5px]">
              <li className="flex gap-3">
                <Phone size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
                <div className="flex flex-col font-mono">
                  <a href="tel:+23670120025" className="hover:text-white transition-colors">
                    70 12 00 25
                  </a>
                  <a href="tel:+23672600533" className="hover:text-white transition-colors">
                    72 60 05 33
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <WhatsAppIcon size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-white transition-colors"
                >
                  75 20 03 13
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
                <a
                  href="mailto:gostatranslogistiquebtp@outlook.fr"
                  className="hover:text-white transition-colors break-all"
                >
                  gostatranslogistiquebtp@outlook.fr
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
                <span>{t("hoursValue")}</span>
              </li>
            </ul>
          </div>

          {/* ===== Localisation ===== */}
          <div className="lg:col-span-3">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.25em] text-[var(--amber)]">
              {t("locationTitle")}
            </h2>
            <ul className="mt-5 space-y-4 text-[14.5px]">
              {SITES.map((site) => (
                <li key={site.id} className="flex gap-3">
                  <MapPin size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white">{t(`sites.${site.id}.label`)}</p>
                    <p>{t(`sites.${site.id}.value`)}</p>
                    <a
                      href={site.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 font-mono text-[12px] uppercase tracking-wide text-[var(--amber)] hover:text-white transition-colors"
                    >
                      {t("maps")} <ArrowUpRight size={13} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== Barre légale ===== */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] font-mono text-[#8b96a8]">
          <span>
            © {year} GOSTA TRANS LOGISTIQUE &amp; BTP · Bangui, RCA
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              href="/mentions-legales"
              className="hover:text-white transition-colors"
            >
              {t("mentions")}
            </Link>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <Link
              href="/confidentialite"
              className="hover:text-white transition-colors"
            >
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

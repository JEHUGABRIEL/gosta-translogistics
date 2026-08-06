import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "./SocialIcons";
import { SOCIAL_LINKS } from "@/lib/social";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer id="contact" className="bg-[var(--navy-deep)] text-[#cfd6e0]">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <span className="font-display font-extrabold text-2xl text-white">
            GOSTA <span className="text-[var(--red)]">TRANS</span>
          </span>
          <p className="font-display uppercase tracking-[0.18em] text-[13px] text-[var(--amber)] mt-1">
            {t("tagline")}
          </p>
          <p className="text-[14.5px] leading-relaxed mt-4 max-w-xs">
            {t("text")}
          </p>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wide text-white text-lg">
            {t("contactTitle")}
          </h4>
          <ul className="space-y-3 mt-5 text-[14.5px]">
            <li className="flex items-start gap-3">
              <MapPin size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
              PK14 Route de Boali, Bangui, RCA
            </li>
            <li className="flex items-start gap-3">
              <Phone size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
              <span className="font-mono">70 12 00 25 / 72 60 05 33</span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
              <span className="font-mono">WhatsApp — 75 20 03 13</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={17} className="text-[var(--amber)] mt-0.5 shrink-0" />
              gostatranslogistiquebtp@outlook.fr
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wide text-white text-lg">
            {t("followTitle")}
          </h4>
          <div className="flex flex-col gap-3 mt-5 text-[14.5px] font-mono">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <FacebookIcon size={17} className="text-[var(--amber)]" />
              {t("facebook")}
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <InstagramIcon size={17} className="text-[var(--amber)]" />
              {t("instagram")}
            </a>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("facebook")}
              className="h-10 w-10 flex items-center justify-center border border-white/20 text-[#cfd6e0] hover:border-[var(--amber)] hover:text-[var(--amber)] hover:-translate-y-0.5 transition-all"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("instagram")}
              className="h-10 w-10 flex items-center justify-center border border-white/20 text-[#cfd6e0] hover:border-[var(--amber)] hover:text-[var(--amber)] hover:-translate-y-0.5 transition-all"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp — Gosta Trans"
              className="h-10 w-10 flex items-center justify-center border border-white/20 text-[#cfd6e0] hover:border-[var(--amber)] hover:text-[var(--amber)] hover:-translate-y-0.5 transition-all"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>

          <a
            href={SOCIAL_LINKS.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 border border-white/25 hover:border-[var(--amber)] px-4 py-2.5 text-[13px] uppercase font-display tracking-wide transition-colors"
          >
            <MapPin size={15} /> {t("maps")}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] font-mono text-[#8b96a8]">
          <span>© {new Date().getFullYear()} GOSTA TRANS LOGISTIQUE &amp; BTP — Bangui, RCA</span>
          <span className="text-[var(--red)]">{t("copyright")}</span>
        </div>
      </div>
    </footer>
  );
}

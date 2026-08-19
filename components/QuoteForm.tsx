"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/social";

export default function QuoteForm() {
  const t = useTranslations("quoteForm");
  const [sent, setSent] = useState(false);
  const options = t.raw("options") as string[];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const details = String(data.get("message") ?? "").trim();

    const lines = [
      t("defaultMessage"),
      "",
      name && `${t("name")} : ${name}`,
      phone && `${t("phone")} : ${phone}`,
      service && `${t("serviceType")} : ${service}`,
      details && `${t("details")} : ${details}`,
    ].filter((l): l is string => Boolean(l));

    window.open(
      `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <CheckCircle2 size={44} className="text-[#25D366]" />
        <h3 className="font-display uppercase text-2xl text-[var(--navy-deep)] mt-4">
          {t("successTitle")}
        </h3>
        <p className="text-[var(--steel)] mt-2 max-w-xs">
          {t("successText")}
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("name")} name="name" placeholder={t("namePlaceholder")} required />
        <Field label={t("phone")} name="phone" placeholder={t("phonePlaceholder")} required />
      </div>
      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          {t("serviceType")}
        </label>
        <select
          name="service"
          required
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        >
          <option value="">{t("select")}</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          {t("details")}
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder={t("detailsPlaceholder")}
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] transition-colors text-white font-display uppercase tracking-wide text-base px-6 py-3.5 cursor-pointer"
      >
        {t("send")}
        <Send size={17} />
      </button>

      <div className="flex items-center gap-4 my-1">
        <span className="flex-1 h-px bg-[var(--line-soft)]" />
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--steel)] shrink-0">
          {t("or")}
        </span>
        <span className="flex-1 h-px bg-[var(--line-soft)]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(
            t("defaultMessage")
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-sm px-4 py-3"
        >
          <MessageCircle size={16} /> {t("writeUs")}
        </a>
        <a
          href="tel:+23670120025"
          className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] hover:bg-black transition-colors text-white font-display uppercase tracking-wide text-sm px-4 py-3"
        >
          <Phone size={16} /> {t("callUs")}
        </a>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
        {label}
      </label>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
      />
    </div>
  );
}

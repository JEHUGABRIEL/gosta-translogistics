"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2 } from "lucide-react";

type Status = "idle" | "sending" | "success" | "error";

/**
 * `light` : carte claire (page contact). `navy` : bloc contact de l'accueil,
 * posé sur fond navy — champs translucides, bouton orange centré.
 */
type Variant = "light" | "navy";

/**
 * Formulaire de message libre (hors devis). Le message est enregistré en base
 * et apparaît dans la boîte de réception du dashboard admin.
 */
export default function ContactMessageForm({
  variant = "light",
  requireConsent = false,
}: {
  variant?: Variant;
  /** Affiche la case de consentement (bloc contact de l'accueil). */
  requireConsent?: boolean;
}) {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<Status>("idle");

  const isNavy = variant === "navy";

  const labelClass = `block font-display uppercase text-[13px] tracking-wide mb-1.5 ${
    isNavy ? "text-white/80" : "text-[var(--navy-deep)]"
  }`;

  const fieldClass = `w-full text-[15px] focus:outline-none ${
    isNavy
      ? "rounded-xl border border-white/25 bg-white/[0.07] px-4 py-3 text-white placeholder:text-white/45"
      : "border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--navy-deep)]"
  }`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          message: String(data.get("message") ?? ""),
          website: String(data.get("website") ?? ""),
        }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <CheckCircle2 size={44} className="text-[var(--green)]" />
        <p
          className={`mt-4 max-w-xs ${
            isNavy ? "text-white/75" : "text-[var(--steel)]"
          }`}
        >
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:gap-5">
      <div>
        <label className={labelClass}>{t("name")}</label>
        <input
          name="name"
          required
          placeholder={t("namePlaceholder")}
          className={fieldClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
        <div>
          <label className={labelClass}>{t("email")}</label>
          <input
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("phone")}</label>
          <input
            name="phone"
            placeholder={t("phonePlaceholder")}
            className={fieldClass}
          />
        </div>
      </div>
      <p
        className={`font-mono text-[11.5px] -mt-1 ${
          isNavy ? "text-white/50" : "text-[var(--steel)]"
        }`}
      >
        {t("contactOptional")}
      </p>

      <div>
        <label className={labelClass}>{t("message")}</label>
        <textarea
          name="message"
          rows={isNavy ? 5 : 4}
          required
          placeholder={t("messagePlaceholder")}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {requireConsent && (
        <label
          className={`flex items-start gap-2.5 text-[13px] leading-relaxed ${
            isNavy ? "text-white/70" : "text-[var(--steel)]"
          }`}
        >
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--red)]"
          />
          <span>{t("consent")}</span>
        </label>
      )}

      {/* Honeypot anti-bot : hors écran, hors tabulation. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Site web
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p
          className={`text-[13.5px] ${
            isNavy ? "text-[var(--amber)]" : "text-[var(--red)]"
          }`}
        >
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`disabled:opacity-60 transition-colors text-white font-display uppercase tracking-wide text-[14px] cursor-pointer inline-flex items-center gap-2 ${
          isNavy
            ? "justify-self-center bg-[var(--red)] hover:bg-[var(--red-dark)] px-7 py-3.5 mt-1"
            : "justify-self-start bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] px-6 py-3"
        }`}
      >
        <Send size={17} strokeWidth={2} />
        {status === "sending" ? t("sending") : t("send")}
      </button>
    </form>
  );
}

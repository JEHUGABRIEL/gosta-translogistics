"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2 } from "lucide-react";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Formulaire de message libre (hors devis). Le message est enregistré en base
 * et apparaît dans la boîte de réception du dashboard admin.
 */
export default function ContactMessageForm() {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<Status>("idle");

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
        <p className="text-[var(--steel)] mt-4 max-w-xs">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          {t("name")}
        </label>
        <input
          name="name"
          required
          placeholder={t("namePlaceholder")}
          className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            {t("email")}
          </label>
          <input
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
        </div>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            {t("phone")}
          </label>
          <input
            name="phone"
            placeholder={t("phonePlaceholder")}
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
        </div>
      </div>
      <p className="font-mono text-[11.5px] text-[var(--steel)] -mt-1">
        {t("contactOptional")}
      </p>

      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          {t("message")}
        </label>
        <textarea
          name="message"
          rows={4}
          required
          placeholder={t("messagePlaceholder")}
          className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
        />
      </div>

      {/* Honeypot anti-bot : hors écran, hors tabulation. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Site web
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p className="text-[13.5px] text-[var(--red)]">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start inline-flex items-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 transition-colors text-white font-display uppercase tracking-wide text-[14px] px-6 py-3 cursor-pointer"
      >
        <Send size={17} strokeWidth={2} />
        {status === "sending" ? t("sending") : t("send")}
      </button>
    </form>
  );
}

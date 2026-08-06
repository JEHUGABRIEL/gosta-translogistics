"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/social";

const DEFAULT_MESSAGE = "Bonjour GOSTA TRANS, je souhaite demander un devis.";

export default function QuoteForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const details = String(data.get("message") ?? "").trim();

    const lines = [
      "Bonjour GOSTA TRANS, je souhaite demander un devis.",
      "",
      name && `Nom : ${name}`,
      phone && `Téléphone : ${phone}`,
      service && `Type de besoin : ${service}`,
      details && `Détails : ${details}`,
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
          Demande prête&nbsp;!
        </h3>
        <p className="text-[var(--steel)] mt-2 max-w-xs">
          Votre demande s&apos;ouvre dans WhatsApp — il ne reste qu&apos;à
          l&apos;envoyer. On vous répond sous 24h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom complet" name="name" placeholder="Votre nom" required />
        <Field label="Téléphone" name="phone" placeholder="+236 …" required />
      </div>
      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Type de besoin
        </label>
        <select
          name="service"
          required
          className="w-full border border-[#c9c2ad] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        >
          <option value="">Sélectionnez…</option>
          <option>Transport de matériaux</option>
          <option>Location d&apos;engins avec opérateur</option>
          <option>Gros œuvre / construction</option>
          <option>Second œuvre / rénovation</option>
          <option>Voirie &amp; travaux publics</option>
        </select>
      </div>
      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Détails du projet
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Localisation, volume, délais souhaités…"
          className="w-full border border-[#c9c2ad] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] transition-colors text-white font-display uppercase tracking-wide text-base px-6 py-3.5 cursor-pointer"
      >
        Envoyer via WhatsApp
        <Send size={17} />
      </button>

      <div className="flex items-center gap-4 my-1">
        <span className="flex-1 h-px bg-[#e4e0d5]" />
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--steel)] shrink-0">
          OU
        </span>
        <span className="flex-1 h-px bg-[#e4e0d5]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(
            DEFAULT_MESSAGE
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-sm px-4 py-3"
        >
          <MessageCircle size={16} /> Nous écrire
        </a>
        <a
          href="tel:+23670120025"
          className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] hover:bg-[#081729] transition-colors text-white font-display uppercase tracking-wide text-sm px-4 py-3"
        >
          <Phone size={16} /> Nous appeler
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
        className="w-full border border-[#c9c2ad] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
      />
    </div>
  );
}

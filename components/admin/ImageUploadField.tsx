"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadNewsImageAction } from "@/app/admin/actions";

/**
 * Upload de visuel via Cloudinary (l'action serveur fait l'envoi signé).
 * La valeur réellement enregistrée est une URL Cloudinary : elle voyage dans
 * un champ caché, jamais dans une saisie libre — une URL externe ne peut donc
 * pas casser le rendu next/image de la page publique.
 */
export default function ImageUploadField({
  defaultValue,
}: {
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    const data = new FormData();
    data.set("file", file);
    startTransition(async () => {
      const result = await uploadNewsImageAction(data);
      if (result.error) setError(result.error);
      else if (result.url) setUrl(result.url);
      if (inputRef.current) inputRef.current.value = "";
    });
  };

  return (
    <div className="grid gap-3">
      <span className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)]">
        Visuel <span className="text-[var(--steel)] normal-case">(optionnel)</span>
      </span>

      <input type="hidden" name="image_url" value={url} />

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 border border-[var(--line)] hover:border-[var(--navy-deep)] transition-colors px-3.5 py-2 text-[12.5px] font-display uppercase tracking-wide text-[var(--navy-deep)] cursor-pointer">
          <Upload size={14} />
          {isPending ? "Envoi…" : "Téléverser une image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={isPending}
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="sr-only"
          />
        </label>

        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--steel)] hover:text-[var(--red)] transition-colors cursor-pointer"
          >
            <X size={14} /> Retirer
          </button>
        )}
      </div>

      {url && (
        <Image
          src={url}
          alt="Aperçu du visuel"
          width={320}
          height={180}
          unoptimized={url.startsWith("/")}
          className="h-[180px] w-[320px] object-cover border border-[var(--line-soft)]"
        />
      )}

      {error && <p className="text-[12.5px] text-[var(--red)]">{error}</p>}
      <p className="font-mono text-[11px] text-[var(--steel)]">
        JPEG, PNG, WebP ou AVIF — 5 Mo maximum.
      </p>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { verifyMfaLoginAction } from "@/app/admin/actions";

export default function VerifyMfaForm() {
  const [state, formAction, pending] = useActionState(verifyMfaLoginAction, undefined as
    | { error: string }
    | undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <p className="text-[13.5px] text-[var(--steel)] leading-relaxed">
        Saisissez le code à 6 chiffres affiché par votre application
        d&apos;authentification.
      </p>

      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Code de vérification
        </label>
        <input
          name="code"
          required
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="000000"
          className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[18px] tracking-[0.35em] font-mono text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
      </div>

      {state?.error && (
        <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 transition-colors text-white font-display uppercase tracking-wide text-[14px] px-6 py-3 cursor-pointer"
      >
        <ShieldCheck size={16} />
        {pending ? "Vérification…" : "Valider"}
      </button>
    </form>
  );
}

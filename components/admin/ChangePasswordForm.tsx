"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { changePasswordAction } from "@/app/admin/actions";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, undefined as
    | { error?: string; success?: string }
    | undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Mot de passe actuel
        </label>
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
      </div>

      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Nouveau mot de passe
        </label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
      </div>

      {state?.error && <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>}
      {state?.success && <p className="text-[13.5px] text-emerald-600">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start inline-flex items-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 transition-colors text-white font-display uppercase tracking-wide text-[14px] px-6 py-3 cursor-pointer"
      >
        <KeyRound size={16} />
        {pending ? "Mise à jour…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}

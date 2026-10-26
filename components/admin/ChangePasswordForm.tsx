"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { changePasswordAction } from "@/app/admin/actions";
import { AdminField, fieldClass } from "./ui";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, undefined as
    | { error?: string; success?: string }
    | undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <AdminField label="Mot de passe actuel" required>
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </AdminField>

      <AdminField label="Nouveau mot de passe" required>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
        />
      </AdminField>

      {state?.error && <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>}
      {state?.success && <p className="text-[13.5px] text-emerald-600">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 justify-self-start bg-[var(--navy-deep)] px-5 py-2.5 font-display text-[13px] uppercase tracking-wide text-white transition-colors hover:bg-[var(--navy-mid)] disabled:opacity-60"
      >
        <KeyRound size={16} />
        {pending ? "Mise à jour…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}

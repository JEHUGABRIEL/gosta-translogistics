"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateProfileAction } from "@/app/admin/actions";
import { AdminField, fieldClass } from "./ui";

/**
 * Prénom / nom affichés dans le dashboard (liste des comptes, journal
 * d'activité). Les champs sont optionnels : un compte invité peut n'avoir
 * que son adresse email.
 */
export default function ProfileForm({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined as
    | { error?: string; success?: string }
    | undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Prénom" htmlFor="profile-first-name">
          <input
            id="profile-first-name"
            name="firstName"
            type="text"
            defaultValue={firstName}
            maxLength={60}
            placeholder="Ex. Marie"
            className={fieldClass}
          />
        </AdminField>
        <AdminField label="Nom" htmlFor="profile-last-name">
          <input
            id="profile-last-name"
            name="lastName"
            type="text"
            defaultValue={lastName}
            maxLength={60}
            placeholder="Ex. Kouamé"
            className={fieldClass}
          />
        </AdminField>
      </div>

      {state?.error && <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>}
      {state?.success && (
        <p className="text-[13.5px] text-emerald-600">{state.success}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] px-5 py-2.5 font-display text-[13px] uppercase tracking-wide text-white transition-colors hover:bg-[var(--navy-mid)] disabled:opacity-60"
        >
          <Save size={15} />
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
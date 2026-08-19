"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { submitInviteSignupAction } from "@/app/admin/actions";

export default function AcceptInviteForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(submitInviteSignupAction, undefined as
    | { error: string }
    | undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="token" value={token} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Prénom
          </label>
          <input
            name="firstName"
            required
            autoFocus
            className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
        </div>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Nom
          </label>
          <input
            name="lastName"
            required
            className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
        </div>
      </div>

      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
      </div>

      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
      </div>

      {state?.error && <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 transition-colors text-white font-display uppercase tracking-wide text-[14px] px-6 py-3 cursor-pointer"
      >
        <UserPlus size={16} />
        {pending ? "Envoi du code…" : "Continuer"}
      </button>
    </form>
  );
}

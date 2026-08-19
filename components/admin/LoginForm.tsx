"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined as
    | { error: string }
    | undefined);

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoFocus
          autoComplete="username"
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
      </div>

      <div>
        <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
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
        <Lock size={16} />
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

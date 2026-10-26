"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { AdminField, fieldClass } from "./ui";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined as
    | { error: string }
    | undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="grid gap-4">
      <AdminField label="Email" htmlFor="admin-email" required>
        <input
          id="admin-email"
          type="email"
          name="email"
          required
          autoFocus
          autoComplete="username"
          className={fieldClass}
        />
      </AdminField>

      <AdminField label="Mot de passe" htmlFor="admin-password" required>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </AdminField>

      {state?.error && (
        <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] px-6 py-3 font-display text-[14px] uppercase tracking-wide text-white transition-colors hover:bg-[var(--navy-mid)] disabled:opacity-60"
      >
        <Lock size={16} />
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

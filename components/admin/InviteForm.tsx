"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { inviteAdminAction } from "@/app/admin/actions";

export default function InviteForm() {
  const [state, formAction, pending] = useActionState(inviteAdminAction, undefined as
    | { error?: string; success?: string }
    | undefined);

  return (
    <form action={formAction} className="grid gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="email@exemple.com"
          className="flex-1 border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-liquid inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] disabled:opacity-60 text-white font-display uppercase tracking-wide text-[13px] px-5 py-2.5 cursor-pointer shrink-0"
        >
          <Send size={15} />
          {pending ? "Envoi…" : "Inviter"}
        </button>
      </div>

      {state?.error && <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>}
      {state?.success && <p className="text-[13.5px] text-emerald-600">{state.success}</p>}
    </form>
  );
}

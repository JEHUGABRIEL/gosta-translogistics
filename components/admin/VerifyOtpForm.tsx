"use client";

import { useActionState, useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { verifyInviteOtpAction, resendInviteOtpAction } from "@/app/admin/actions";

export default function VerifyOtpForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(verifyInviteOtpAction, undefined as
    | { error: string }
    | undefined);
  const [resendPending, startResend] = useTransition();
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="token" value={token} />

        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Code de confirmation
          </label>
          <input
            name="code"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoFocus
            placeholder="000000"
            className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[22px] tracking-[0.3em] text-center text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
        </div>

        {state?.error && <p className="text-[13.5px] text-[var(--red)]">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 transition-colors text-white font-display uppercase tracking-wide text-[14px] px-6 py-3 cursor-pointer"
        >
          <ShieldCheck size={16} />
          {pending ? "Vérification…" : "Confirmer"}
        </button>
      </form>

      <button
        type="button"
        disabled={resendPending}
        onClick={() =>
          startResend(async () => {
            const res = await resendInviteOtpAction(token);
            setResendMessage(res.success ?? res.error ?? null);
          })
        }
        className="text-[13px] text-[var(--steel)] hover:text-[var(--navy-deep)] transition-colors cursor-pointer disabled:opacity-60"
      >
        {resendPending ? "Envoi…" : "Renvoyer le code"}
      </button>
      {resendMessage && <p className="text-[13px] text-[var(--steel)]">{resendMessage}</p>}
    </div>
  );
}

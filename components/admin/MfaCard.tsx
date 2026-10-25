"use client";

import { useActionState } from "react";
import Image from "next/image";
import { ShieldCheck, ShieldOff } from "lucide-react";
import {
  confirmMfaEnrollmentAction,
  disableMfaAction,
  startMfaEnrollmentAction,
} from "@/app/admin/actions";

type ActionState = { error?: string; success?: string } | undefined;

export default function MfaCard({
  enabled,
  pendingSecret,
  qrDataUrl,
}: {
  enabled: boolean;
  pendingSecret: string | null;
  qrDataUrl: string | null;
}) {
  const [confirmState, confirmAction, confirmPending] = useActionState(
    confirmMfaEnrollmentAction,
    undefined as ActionState
  );
  const [disableState, disableAction, disablePending] = useActionState(
    disableMfaAction,
    undefined as ActionState
  );

  return (
    <div className="bg-[var(--surface)] border border-[var(--line-soft)] rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display uppercase text-[15px] text-[var(--navy-deep)]">
          Double authentification
        </h2>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 ${
            enabled
              ? "bg-[var(--green)]/10 text-[var(--green-dark)]"
              : "bg-[var(--sand)] text-[var(--steel)]"
          }`}
        >
          {enabled ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
          {enabled ? "Activée" : "Désactivée"}
        </span>
      </div>

      <p className="text-[12.5px] text-[var(--steel)] mt-2 leading-relaxed">
        Un code à 6 chiffres, généré par une application d&apos;authentification,
        est demandé après le mot de passe.
      </p>

      {enabled ? (
        <form action={disableAction} className="grid gap-3 mt-5">
          <p className="text-[12.5px] text-[var(--steel)]">
            Pour désactiver, confirmez avec votre mot de passe et un code en cours.
          </p>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Mot de passe actuel"
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
          <input
            name="code"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Code à 6 chiffres"
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] font-mono tracking-[0.2em] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
          {disableState?.error && (
            <p className="text-[13px] text-[var(--red)]">{disableState.error}</p>
          )}
          {disableState?.success && (
            <p className="text-[13px] text-[var(--green-dark)]">{disableState.success}</p>
          )}
          <button
            type="submit"
            disabled={disablePending}
            className="justify-self-start inline-flex items-center gap-2 border border-[var(--red)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white disabled:opacity-60 transition-colors font-display uppercase tracking-wide text-[12.5px] px-4 py-2.5 cursor-pointer"
          >
            Désactiver
          </button>
        </form>
      ) : pendingSecret ? (
        <div className="grid gap-4 mt-5">
          <p className="text-[12.5px] text-[var(--steel)] leading-relaxed">
            Scannez ce QR code avec Google Authenticator, Authy ou 1Password,
            puis saisissez le code affiché pour confirmer.
          </p>
          {qrDataUrl && (
            <Image
              src={qrDataUrl}
              alt="QR code d'enrôlement TOTP"
              width={188}
              height={188}
              unoptimized
              className="border border-[var(--line-soft)] bg-white p-2"
            />
          )}
          <p className="font-mono text-[12px] break-all text-[var(--steel)]">
            Clé manuelle : {pendingSecret}
          </p>
          <form action={confirmAction} className="grid gap-3">
            <input
              name="code"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="Code à 6 chiffres"
              className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] font-mono tracking-[0.2em] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
            />
            {confirmState?.error && (
              <p className="text-[13px] text-[var(--red)]">{confirmState.error}</p>
            )}
            {confirmState?.success && (
              <p className="text-[13px] text-[var(--green-dark)]">{confirmState.success}</p>
            )}
            <button
              type="submit"
              disabled={confirmPending}
              className="justify-self-start inline-flex items-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 transition-colors text-white font-display uppercase tracking-wide text-[12.5px] px-4 py-2.5 cursor-pointer"
            >
              Confirmer l&apos;activation
            </button>
          </form>
        </div>
      ) : (
        <form action={startMfaEnrollmentAction} className="mt-5">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] transition-colors text-white font-display uppercase tracking-wide text-[12.5px] px-4 py-2.5 cursor-pointer"
          >
            <ShieldCheck size={15} /> Activer
          </button>
        </form>
      )}
    </div>
  );
}

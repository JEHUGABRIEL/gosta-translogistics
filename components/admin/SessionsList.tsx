"use client";

import { useState, useTransition } from "react";
import { MonitorSmartphone, X } from "lucide-react";
import { revokeSessionAction } from "@/app/admin/actions";
import { useAdminToast } from "./ToastProvider";

export type SessionItem = {
  id: number;
  createdAt: string;
  expiresAt: string;
  current: boolean;
};

export default function SessionsList({ sessions }: { sessions: SessionItem[] }) {
  const [pending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const toast = useAdminToast();

  if (sessions.length === 0) {
    return <p className="text-[13.5px] text-[var(--steel)]">Aucune session active.</p>;
  }

  return (
    <ul className="divide-y divide-[var(--line-soft)]">
      {sessions.map((session) => (
        <li key={session.id} className="py-3 flex items-center gap-3">
          <MonitorSmartphone size={16} className="shrink-0 text-[var(--red)]" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] text-[var(--navy-deep)]">
              Ouverte le {session.createdAt}
              {session.current && (
                <span className="ml-2 font-mono text-[11px] uppercase tracking-wide text-[var(--red)]">
                  (session actuelle)
                </span>
              )}
            </p>
            <p className="text-[12.5px] text-[var(--steel)]">
              Expire le {session.expiresAt}
            </p>
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setPendingId(session.id);
              startTransition(async () => {
                try {
                  await revokeSessionAction(session.id);
                  toast.success("Session fermée.");
                } catch {
                  toast.error("Impossible de fermer cette session.");
                } finally {
                  setPendingId(null);
                }
              });
            }}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--steel)] hover:text-[var(--red)] transition-colors cursor-pointer disabled:opacity-60"
          >
            <X size={14} />
            {pending && pendingId === session.id ? "Fermeture…" : "Fermer"}
          </button>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState } from "react";
import { History, Info } from "lucide-react";
import AdminModal from "./AdminModal";
import { AdminBadge, AdminCard } from "./ui";
import { ADMIN_ACTION_LABELS } from "@/lib/admin-activity";
import type { ActivityRow } from "@/lib/db/queries";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Bangui",
});

const detailFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "long",
  timeZone: "Africa/Bangui",
});

/** Tonne des pastilles : regroupe les actions par famille de préfixe. */
function toneFor(action: string): "red" | "amber" | "green" | "steel" {
  if (action.startsWith("auth.")) return "green";
  if (action.startsWith("invite.")) return "amber";
  if (action.endsWith(".deleted") || action.startsWith("journal.")) return "red";
  return "steel";
}

export default function ActivityList({ entries }: { entries: ActivityRow[] }) {
  const [selected, setSelected] = useState<ActivityRow | null>(null);

  const detail: Array<{ term: string; value: string }> = selected
    ? [
        { term: "Libellé", value: ADMIN_ACTION_LABELS[selected.action] ?? selected.action },
        { term: "Code d'action", value: selected.action },
        { term: "Cible", value: selected.target || "—" },
        { term: "Auteur", value: selected.email ?? "Compte supprimé" },
        {
          term: "Date et heure",
          value: detailFormat.format(new Date(selected.created_at)),
        },
        { term: "Entrée n°", value: String(selected.id) },
      ]
    : [];

  return (
    <>
      <AdminCard className="overflow-hidden">
        <ul className="divide-y divide-[var(--line-soft)]">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
            >
              <div className="flex min-w-0 items-start gap-3">
                <History size={16} className="mt-0.5 shrink-0 text-[var(--red)]" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminBadge tone={toneFor(entry.action)}>
                      {ADMIN_ACTION_LABELS[entry.action] ?? entry.action}
                    </AdminBadge>
                    <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
                      {entry.action}
                    </span>
                  </div>
                  {entry.target && (
                    <p className="mt-1.5 truncate text-[13.5px] text-[var(--navy-deep)]">
                      {entry.target}
                    </p>
                  )}
                  <p className="mt-0.5 text-[12.5px] text-[var(--steel)]">
                    {entry.email ?? "compte supprimé"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <time
                  dateTime={entry.created_at}
                  className="whitespace-nowrap font-mono text-[11.5px] text-[var(--steel)]"
                >
                  {dateFormat.format(new Date(entry.created_at))}
                </time>
                <button
                  type="button"
                  onClick={() => setSelected(entry)}
                  aria-label="Voir le détail de l'entrée"
                  className="inline-flex items-center gap-1.5 border border-[var(--line)] px-2.5 py-1.5 font-display text-[11.5px] uppercase tracking-wide text-[var(--steel)] transition-colors hover:border-[var(--navy-deep)] hover:text-[var(--navy-deep)]"
                >
                  <Info size={13} />
                  Détails
                </button>
              </div>
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Détail de l'entrée"
        description={
          selected ? (ADMIN_ACTION_LABELS[selected.action] ?? selected.action) : undefined
        }
        size="md"
      >
        {selected && (
          <dl className="divide-y divide-[var(--line-soft)]">
            {detail.map((row) => (
              <div key={row.term} className="flex items-start justify-between gap-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
                  {row.term}
                </dt>
                <dd className="text-right text-[13.5px] text-[var(--navy-deep)]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </AdminModal>
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { updateQuoteStatusAction, deleteQuoteAction } from "@/app/admin/actions";
import type { QuoteRequest } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";

const STATUSES: QuoteRequest["status"][] = ["new", "contacted", "done"];

export default function QuotesTable({ quotes }: { quotes: QuoteRequest[] }) {
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (quotes.length === 0) {
    return (
      <p className="text-[14px] text-[var(--steel)]">
        Aucune demande de devis pour le moment. Les demandes soumises depuis le
        formulaire du site apparaîtront ici.
      </p>
    );
  }

  return (
    <div className="bg-white border border-[var(--line-soft)] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[var(--line-soft)] text-[12px] font-mono uppercase tracking-wide text-[var(--steel)]">
              <th className="px-5 py-3 w-[20%]">Contact</th>
              <th className="px-5 py-3 w-[15%]">Service</th>
              <th className="px-5 py-3 w-[30%]">Message</th>
              <th className="px-5 py-3 w-[13%]">Reçu le</th>
              <th className="px-5 py-3 w-[15%]">Statut</th>
              <th className="px-5 py-3 w-[7%]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-soft)]">
            {quotes.map((q) => (
              <tr key={q.id} className={isPending ? "opacity-60" : ""}>
                <td className="px-5 py-4 align-top">
                  <p className="text-[var(--navy-deep)] font-medium">{q.name}</p>
                  <a
                    href={`tel:${q.phone}`}
                    className="text-[13px] text-[var(--steel)] hover:text-[var(--red)]"
                  >
                    {q.phone}
                  </a>
                </td>
                <td className="px-5 py-4 align-top text-[var(--steel)]">
                  {q.service ?? "—"}
                </td>
                <td className="px-5 py-4 align-top text-[var(--steel)]">
                  <p className="line-clamp-2">{q.message ?? "—"}</p>
                </td>
                <td className="px-5 py-4 align-top text-[var(--steel)] whitespace-nowrap">
                  {new Date(q.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 align-top">
                  <select
                    defaultValue={q.status}
                    disabled={isPending}
                    onChange={(e) =>
                      startTransition(() =>
                        updateQuoteStatusAction(q.id, e.target.value as QuoteRequest["status"])
                      )
                    }
                    className="border border-[var(--line)] bg-white px-3 py-1.5 text-[13px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 align-top text-right">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setDeleteId(q.id)}
                    aria-label="Supprimer"
                    className="text-[var(--steel)] hover:text-[var(--red)] transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteId !== null}
        title="Supprimer la demande"
        message="Êtes-vous sûr de vouloir supprimer cette demande de devis ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId !== null) {
            startTransition(() => deleteQuoteAction(deleteId));
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

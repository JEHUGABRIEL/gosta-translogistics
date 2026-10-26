"use client";

import { useState } from "react";
import { Eye, MessageCircle, Phone, Trash2 } from "lucide-react";
import { updateQuoteStatusAction, deleteQuoteAction } from "@/app/admin/actions";
import type { QuoteRequest } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";
import AdminModal from "./AdminModal";
import { AdminBadge } from "./ui";
import { useAdminToast } from "./ToastProvider";

const STATUSES: QuoteRequest["status"][] = ["new", "contacted", "done"];
const STATUS_LABEL: Record<QuoteRequest["status"], string> = {
  new: "Nouveau",
  contacted: "Contacté",
  done: "Traité",
};
const STATUS_TONE: Record<QuoteRequest["status"], "red" | "amber" | "green"> = {
  new: "red",
  contacted: "amber",
  done: "green",
};

export default function QuotesTable({
  quotes,
  onChanged,
}: {
  quotes: QuoteRequest[];
  /** Appelé après une mutation pour rafraîchir la liste côté Query. */
  onChanged?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const toast = useAdminToast();

  const detail = detailId === null ? undefined : quotes.find((q) => q.id === detailId);

  const run = async (action: () => Promise<unknown>, successMessage: string) => {
    setIsPending(true);
    try {
      await action();
      onChanged?.();
      toast.success(successMessage);
    } catch {
      toast.error("Action impossible. Réessayez.");
    } finally {
      setIsPending(false);
    }
  };

  if (quotes.length === 0) {
    return (
      <p className="text-[14px] text-[var(--steel)]">
        Aucune demande de devis pour le moment. Les demandes soumises depuis le
        formulaire du site apparaîtront ici.
      </p>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--line-soft)] rounded-2xl overflow-hidden">
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
                    onChange={(e) => {
                      const next = e.target.value as QuoteRequest["status"];
                      void run(
                        () => updateQuoteStatusAction(q.id, next),
                        `Statut mis à jour : ${STATUS_LABEL[next]}.`
                      );
                    }}
                    className="border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-[13px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 align-top text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailId(q.id)}
                      aria-label="Voir la demande"
                      title="Voir la demande"
                      className="text-[var(--steel)] transition-colors hover:text-[var(--navy-deep)] cursor-pointer"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setDeleteId(q.id)}
                      aria-label="Supprimer"
                      title="Supprimer"
                      className="text-[var(--steel)] transition-colors hover:text-[var(--red)] cursor-pointer disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={detail !== undefined}
        onClose={() => setDetailId(null)}
        title={detail ? `Demande de devis #${detail.id}` : "Demande de devis"}
        description={
          detail
            ? `Reçue le ${new Date(detail.created_at).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : undefined
        }
        size="md"
      >
        {detail && (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <AdminBadge tone={STATUS_TONE[detail.status]}>
                {STATUS_LABEL[detail.status]}
              </AdminBadge>
              <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
                {detail.service ?? "Service non précisé"}
              </span>
            </div>

            <div className="grid gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)]">
                  Client
                </p>
                <p className="mt-1 text-[15px] text-[var(--navy-deep)]">{detail.name}</p>
                <a
                  href={`tel:${detail.phone.replace(/\s+/g, "")}`}
                  className="mt-0.5 inline-block text-[14px] text-[var(--steel)] transition-colors hover:text-[var(--red)]"
                >
                  {detail.phone}
                </a>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)]">
                  Message
                </p>
                <p className="mt-1 whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--navy-deep)]">
                  {detail.message?.trim() || "Aucun message accompagnant la demande."}
                </p>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)]">
                  Statut
                </p>
                <select
                  value={detail.status}
                  disabled={isPending}
                  onChange={(event) => {
                    const next = event.target.value as QuoteRequest["status"];
                    void run(
                      () => updateQuoteStatusAction(detail.id, next),
                      `Statut mis à jour : ${STATUS_LABEL[next]}.`
                    );
                  }}
                  aria-label="Statut de la demande"
                  className="mt-1.5 w-full cursor-pointer border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-[14px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 border-t border-[var(--line-soft)] pt-4">
              <a
                href={`tel:${detail.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 bg-[var(--navy-deep)] px-4 py-2.5 font-display text-[13px] uppercase tracking-wide text-white transition-colors hover:bg-[var(--navy-mid)]"
              >
                <Phone size={15} /> Appeler
              </a>
              <a
                href={`https://wa.me/${detail.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 font-display text-[13px] uppercase tracking-wide text-[var(--navy-deep)] transition-colors hover:border-[var(--green)] hover:text-[var(--green)]"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setDetailId(null);
                  setDeleteId(detail.id);
                }}
                className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 font-display text-[13px] uppercase tracking-wide text-[var(--red)] transition-colors hover:border-[var(--red)] disabled:opacity-60"
              >
                <Trash2 size={15} /> Supprimer
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmModal
        open={deleteId !== null}
        title="Supprimer la demande"
        message="Êtes-vous sûr de vouloir supprimer cette demande de devis ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId !== null) {
            const id = deleteId;
            setDeleteId(null);
            void run(() => deleteQuoteAction(id), "Demande supprimée.");
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

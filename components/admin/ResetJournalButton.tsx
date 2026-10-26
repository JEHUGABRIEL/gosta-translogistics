"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { resetActivityAction } from "@/app/admin/actions";
import ConfirmModal from "./ConfirmModal";
import { useAdminToast } from "./ToastProvider";

/**
 * Purge complète du journal, derrière une confirmation : l'action est
 * irréversible, seule la trace de l'effacement subsiste ensuite.
 */
export default function ResetJournalButton() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const toast = useAdminToast();

  const confirm = () => {
    setPending(true);
    void resetActivityAction()
      .then(() => toast.success("Journal réinitialisé."))
      .catch(() => toast.error("Réinitialisation impossible."))
      .finally(() => {
        setPending(false);
        setOpen(false);
      });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className="inline-flex items-center gap-1.5 border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-display text-[12px] uppercase tracking-wide text-[var(--red)] transition-colors hover:border-[var(--red)] hover:bg-[var(--red)] hover:text-white disabled:opacity-60"
      >
        <Trash2 size={14} />
        {pending ? "Effacement…" : "Réinitialiser"}
      </button>

      <ConfirmModal
        open={open}
        title="Réinitialiser le journal"
        message="Toutes les entrées du journal d'activité seront définitivement supprimées. L'effacement lui-même reste enregistré. Continuer ?"
        confirmLabel="Tout effacer"
        danger
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

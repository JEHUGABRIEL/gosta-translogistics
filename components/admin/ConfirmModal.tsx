"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/40 bg-transparent rounded-2xl shadow-2xl p-0 w-full max-w-md"
    >
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                danger ? "bg-red-50" : "bg-amber-50"
              }`}
            >
              <AlertTriangle
                size={20}
                className={danger ? "text-[var(--red)]" : "text-amber-600"}
              />
            </div>
            <h2 className="font-display font-bold text-lg text-[var(--navy-deep)]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[var(--steel)] hover:text-[var(--navy-deep)] transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-[14px] text-[var(--steel)] leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-[13px] font-display uppercase tracking-wide text-[var(--steel)] hover:text-[var(--navy-deep)] border border-[var(--line)] hover:border-[var(--navy-deep)] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-liquid px-5 py-2.5 text-[13px] font-display uppercase tracking-wide text-white bg-[var(--navy-deep)] cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

const SIZES = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export default function AdminModal({
  open,
  onClose,
  title,
  description,
  size = "lg",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: keyof typeof SIZES;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label={title}
      className={`m-auto w-[calc(100%-2rem)] ${SIZES[size]} rounded-2xl bg-transparent p-0 shadow-2xl backdrop:bg-black/45`}
    >
      <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--line-soft)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="font-display text-[19px] font-extrabold uppercase tracking-wide text-[var(--navy-deep)]">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--steel)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </dialog>
  );
}

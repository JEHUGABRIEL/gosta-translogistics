"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, Trash2, Check, Archive, Inbox } from "lucide-react";
import {
  updateContactMessageStatusAction,
  deleteContactMessageAction,
} from "@/app/admin/actions";
import type { ContactMessage } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";

export type MessageItem = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: ContactMessage["status"];
  createdAt: string;
};

const STATUS_LABEL: Record<ContactMessage["status"], string> = {
  new: "Nouveau",
  read: "Lu",
  archived: "Archivé",
};

export default function MessagesManager({ items }: { items: MessageItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | ContactMessage["status"]>("all");

  const visible =
    filter === "all" ? items : items.filter((item) => item.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "read", "archived"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 font-display uppercase tracking-wide text-[12.5px] border transition-colors cursor-pointer ${
                filter === key
                  ? "bg-[var(--navy-deep)] border-[var(--navy-deep)] text-white"
                  : "border-[var(--line)] text-[var(--steel)] hover:text-[var(--navy-deep)]"
              }`}
            >
              {key === "all" ? "Tous" : STATUS_LABEL[key]}
              <span className="ml-2 font-mono text-[11px] text-current/70">
                {key === "all"
                  ? items.length
                  : items.filter((item) => item.status === key).length}
              </span>
            </button>
          ))}
        </div>
        <p className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-[var(--steel)]">
          Messages du formulaire de contact
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--line-soft)] rounded-2xl p-6">
          <Inbox size={20} className="text-[var(--steel)]" />
          <p className="text-[14px] text-[var(--steel)]">Aucun message dans cette vue.</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {visible.map((item) => (
            <li
              key={item.id}
              className={`bg-[var(--surface)] border rounded-2xl p-6 ${
                item.status === "new"
                  ? "border-[var(--red)]/40 border-l-2 border-l-[var(--red)]"
                  : "border-[var(--line-soft)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display uppercase tracking-wide text-[16px] text-[var(--navy-deep)]">
                    {item.name}
                  </p>
                  <p className="font-mono text-[11.5px] uppercase tracking-wide text-[var(--steel)] mt-1">
                    {item.createdAt} · {STATUS_LABEL[item.status]}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    disabled={isPending || item.status === "read"}
                    onClick={() =>
                      startTransition(() => updateContactMessageStatusAction(item.id, "read"))
                    }
                    aria-label="Marquer comme lu"
                    title="Marquer comme lu"
                    className="text-[var(--steel)] hover:text-[var(--navy-deep)] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Check size={17} />
                  </button>
                  <button
                    type="button"
                    disabled={isPending || item.status === "archived"}
                    onClick={() =>
                      startTransition(() =>
                        updateContactMessageStatusAction(item.id, "archived")
                      )
                    }
                    aria-label="Archiver"
                    title="Archiver"
                    className="text-[var(--steel)] hover:text-[var(--navy-deep)] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Archive size={17} />
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setDeleteId(item.id)}
                    aria-label="Supprimer"
                    title="Supprimer"
                    className="text-[var(--steel)] hover:text-[var(--red)] transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-[14.5px] text-[var(--steel)] leading-relaxed mt-4 whitespace-pre-line">
                {item.message}
              </p>

              <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-[var(--line-soft)]">
                {item.email && (
                  <a
                    href={`mailto:${item.email}`}
                    className="inline-flex items-center gap-1.5 text-[13.5px] text-[var(--navy-deep)] hover:text-[var(--red)] transition-colors"
                  >
                    <Mail size={15} /> {item.email}
                  </a>
                )}
                {item.phone && (
                  <a
                    href={`tel:${item.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-[13.5px] text-[var(--navy-deep)] hover:text-[var(--red)] transition-colors"
                  >
                    <Phone size={15} /> {item.phone}
                  </a>
                )}
                {!item.email && !item.phone && (
                  <span className="text-[13px] text-[var(--steel)]">
                    Aucune coordonnée fournie.
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId !== null) {
            startTransition(() => deleteContactMessageAction(deleteId));
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

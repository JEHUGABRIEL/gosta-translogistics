"use client";

import { useMemo, useState, useTransition } from "react";
import { Mail, Phone, Trash2, Check, Archive, Copy, Reply } from "lucide-react";
import {
  updateContactMessageStatusAction,
  deleteContactMessageAction,
} from "@/app/admin/actions";
import type { ContactMessage } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";
import { useAdminToast } from "./ToastProvider";
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminPagination,
  AdminSearch,
  AdminToolbar,
} from "./ui";

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

const STATUS_TONE: Record<
  ContactMessage["status"],
  "red" | "amber" | "steel"
> = {
  new: "red",
  read: "amber",
  archived: "steel",
};

const PER_PAGE = 6;

export default function MessagesManager({ items }: { items: MessageItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | ContactMessage["status"]>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const toast = useAdminToast();

  /** Copie l'adresse de l'expéditeur pour répondre depuis un autre client. */
  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Adresse copiée dans le presse-papiers.");
    } catch {
      toast.error("Copie impossible : sélectionnez l'adresse à la main.");
    }
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!needle) return true;
      return [item.name, item.email ?? "", item.phone ?? "", item.message].some(
        (value) => value.toLowerCase().includes(needle)
      );
    });
  }, [items, filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <div className="space-y-6">
      <AdminToolbar description="Les messages envoyés depuis le formulaire de contact du site arrivent ici. Marquez-les comme lus, archivez-les ou supprimez-les." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Rechercher un message…"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "read", "archived"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key);
                setPage(1);
              }}
              className={`border px-3.5 py-1.5 font-display text-[12.5px] uppercase tracking-wide transition-colors ${
                filter === key
                  ? "border-[var(--navy-deep)] bg-[var(--navy-deep)] text-white"
                  : "border-[var(--line)] text-[var(--steel)] hover:border-[var(--navy-deep)] hover:text-[var(--navy-deep)]"
              }`}
            >
              {key === "all" ? "Tous" : STATUS_LABEL[key]}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <AdminEmptyState
          title={items.length === 0 ? "Aucun message pour le moment" : "Aucun résultat"}
          description={
            items.length === 0
              ? "Les messages du formulaire de contact apparaîtront ici."
              : "Essayez un autre filtre ou un autre mot-clé."
          }
        />
      ) : (
        <>
          <ul className="grid gap-4">
            {visible.map((item) => (
              <li key={item.id}>
                <AdminCard
                  className={`p-5 ${
                    item.status === "new"
                      ? "border-l-2 border-l-[var(--red)]"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <AdminBadge tone={STATUS_TONE[item.status]}>
                          {STATUS_LABEL[item.status]}
                        </AdminBadge>
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
                          {item.createdAt}
                        </span>
                      </div>
                      <p className="mt-2 font-display text-[16px] uppercase tracking-wide text-[var(--navy-deep)]">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={isPending || item.status === "read"}
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              await updateContactMessageStatusAction(item.id, "read");
                              toast.success("Message marqué comme lu.");
                            } catch {
                              toast.error("Impossible de mettre à jour le message.");
                            }
                          })
                        }
                        aria-label="Marquer comme lu"
                        title="Marquer comme lu"
                        className="flex h-8 w-8 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--navy-deep)] disabled:opacity-40"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={isPending || item.status === "archived"}
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              await updateContactMessageStatusAction(item.id, "archived");
                              toast.success("Message archivé.");
                            } catch {
                              toast.error("Impossible d'archiver le message.");
                            }
                          })
                        }
                        aria-label="Archiver"
                        title="Archiver"
                        className="flex h-8 w-8 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--navy-deep)] disabled:opacity-40"
                      >
                        <Archive size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setDeleteId(item.id)}
                        aria-label="Supprimer"
                        title="Supprimer"
                        className="flex h-8 w-8 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--red)]/10 hover:text-[var(--red)]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-[var(--steel)]">
                    {item.message}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-[var(--line-soft)] pt-4">
                    {item.email && (
                      <>
                        <a
                          href={`mailto:${item.email}?subject=${encodeURIComponent(
                            "Re : votre message via GOSTA TRANS Logistique et BTP"
                          )}&body=${encodeURIComponent(
                            `Bonjour ${item.name},\n\n`
                          )}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--navy-deep)] px-3.5 py-1.5 font-display text-[12px] uppercase tracking-wide text-white transition-colors hover:bg-[var(--navy-mid)]"
                        >
                          <Reply size={14} /> Répondre
                        </a>
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--navy-deep)] transition-colors hover:text-[var(--red)]"
                        >
                          <Mail size={15} /> {item.email}
                        </a>
                        <button
                          type="button"
                          onClick={() => void copyEmail(item.email ?? "")}
                          aria-label="Copier l&apos;adresse"
                          title="Copier l&apos;adresse"
                          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--steel)] transition-colors hover:text-[var(--navy-deep)]"
                        >
                          <Copy size={15} /> Copier l&apos;adresse
                        </button>
                      </>
                    )}
                    {item.phone && (
                      <a
                        href={`tel:${item.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--navy-deep)] transition-colors hover:text-[var(--red)]"
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
                </AdminCard>
              </li>
            ))}
          </ul>

          <AdminPagination
            page={currentPage}
            perPage={PER_PAGE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId === null) return;
          const id = deleteId;
          setDeleteId(null);
          startTransition(async () => {
            try {
              await deleteContactMessageAction(id);
              toast.success("Message supprimé.");
            } catch {
              toast.error("Impossible de supprimer le message.");
            }
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

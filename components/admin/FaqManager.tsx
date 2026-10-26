"use client";

import { useMemo, useState, useTransition } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createFaqAction,
  updateFaqAction,
  toggleFaqAction,
  deleteFaqAction,
} from "@/app/admin/actions";
import type { Faq } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";
import AdminModal from "./AdminModal";
import { useAdminToast } from "./ToastProvider";
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminField,
  AdminFormSection,
  AdminPagination,
  AdminSearch,
  AdminToolbar,
  fieldClass,
  textareaClass,
} from "./ui";

const PER_PAGE = 8;

export default function FaqManager({ items }: { items: Faq[] }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const toast = useAdminToast();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.question_fr, item.answer_fr, item.question_en, item.answer_en].some(
        (value) => value.toLowerCase().includes(needle)
      )
    );
  }, [items, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setFormError(null);
  };

  return (
    <div className="space-y-6">
      <AdminToolbar description="Les questions publiées remplacent la liste statique de l'accueil. Sans question publiée, le site affiche ses messages par défaut — la page publique ne dépend jamais de la base.">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-liquid inline-flex items-center gap-2 bg-[var(--navy-deep)] px-4 py-2.5 font-display text-[13px] uppercase tracking-wide text-white"
        >
          <Plus size={15} />
          Ajouter une question
        </button>
      </AdminToolbar>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Rechercher une question…"
        />
        <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
          {filtered.length} question{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          title={items.length === 0 ? "Aucune question pour le moment" : "Aucun résultat"}
          description={
            items.length === 0
              ? "Ajoutez une première question pour alimenter la section FAQ du site."
              : "Essayez un autre mot-clé ou modifiez votre recherche."
          }
        />
      ) : (
        <>
          <ul className="grid gap-4">
            {visible.map((item) => (
              <li key={item.id}>
                <AdminCard className="p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <AdminBadge tone={item.published ? "green" : "steel"}>
                        {item.published ? "Publiée" : "Masquée"}
                      </AdminBadge>
                      <p className="mt-2.5 font-display text-[16px] uppercase leading-snug text-[var(--navy-deep)]">
                        {item.question_fr}
                      </p>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--steel)]">
                        {item.answer_fr}
                      </p>
                      <p className="mt-3 border-t border-[var(--line-soft)] pt-2 font-mono text-[11.5px] leading-relaxed text-[var(--steel)]">
                        EN · {item.question_en}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              await toggleFaqAction(item.id, !item.published);
                              toast.success(
                                item.published ? "Question masquée." : "Question publiée."
                              );
                            } catch {
                              toast.error("Impossible de changer la publication.");
                            }
                          })
                        }
                        aria-label={item.published ? "Dépublier" : "Publier"}
                        title={item.published ? "Publiée" : "Masquée"}
                        className={`flex h-8 w-8 items-center justify-center transition-colors ${
                          item.published
                            ? "text-[var(--red)] hover:bg-[var(--red)]/10"
                            : "text-[var(--steel)] hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
                        }`}
                      >
                        {item.published ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(item);
                          setFormOpen(true);
                        }}
                        aria-label="Modifier"
                        title="Modifier"
                        className="flex h-8 w-8 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setDeleteId(item.id)}
                        aria-label="Supprimer"
                        title="Supprimer"
                        className="flex h-8 w-8 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--red)]/10 hover:text-[var(--red)]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

      {formOpen && (
        <AdminModal
          open
          onClose={closeForm}
          title={editing ? "Modifier la question" : "Ajouter une question"}
          description="La version française et la version anglaise sont affichées selon la langue du visiteur."
          size="xl"
        >
          <form
            action={(formData) => {
              startTransition(async () => {
                try {
                  if (editing) {
                    await updateFaqAction(editing.id, formData);
                    toast.success("Question mise à jour.");
                  } else {
                    await createFaqAction(formData);
                    toast.success("Question ajoutée.");
                  }
                  closeForm();
              } catch {
                setFormError("Impossible d'enregistrer la question. Réessayez.");
              }
              });
            }}
            className="grid gap-5"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <AdminFormSection title="Français">
                <AdminField label="Question" required>
                  <input
                    name="question_fr"
                    required
                    defaultValue={editing?.question_fr}
                    className={fieldClass}
                  />
                </AdminField>
                <AdminField label="Réponse" required>
                  <textarea
                    name="answer_fr"
                    rows={5}
                    required
                    defaultValue={editing?.answer_fr}
                    className={textareaClass}
                  />
                </AdminField>
              </AdminFormSection>

              <AdminFormSection title="English">
                <AdminField label="Question" required>
                  <input
                    name="question_en"
                    required
                    defaultValue={editing?.question_en}
                    className={fieldClass}
                  />
                </AdminField>
                <AdminField label="Answer" required>
                  <textarea
                    name="answer_en"
                    rows={5}
                    required
                    defaultValue={editing?.answer_en}
                    className={textareaClass}
                  />
                </AdminField>
              </AdminFormSection>
            </div>

          {formError && (
            <p className="text-[13px] text-[var(--red)]" role="alert">
              {formError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-[var(--line-soft)] pt-4">
            <button
              type="button"
              onClick={closeForm}
                className="px-4 py-2.5 font-display text-[12.5px] uppercase tracking-wide text-[var(--steel)] transition-colors hover:text-[var(--navy-deep)]"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 bg-[var(--navy-deep)] px-5 py-2.5 font-display text-[12.5px] uppercase tracking-wide text-white transition-colors hover:bg-[var(--navy-mid)] disabled:opacity-60"
              >
                {isPending ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Supprimer la question"
        message="Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId === null) return;
          const id = deleteId;
          setDeleteId(null);
          startTransition(async () => {
            try {
              await deleteFaqAction(id);
              toast.success("Question supprimée.");
            } catch {
              toast.error("Impossible de supprimer la question.");
            }
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

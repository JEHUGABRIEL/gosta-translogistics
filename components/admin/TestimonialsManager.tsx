"use client";

import { useMemo, useState, useTransition } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createTestimonialAction,
  updateTestimonialAction,
  toggleTestimonialAction,
  deleteTestimonialAction,
} from "@/app/admin/actions";
import type { Testimonial } from "@/lib/db/queries";
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

const PER_PAGE = 6;

export default function TestimonialsManager({ items }: { items: Testimonial[] }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const toast = useAdminToast();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [
        item.role_fr,
        item.context_fr,
        item.quote_fr,
        item.role_en,
        item.context_en,
        item.quote_en,
      ].some((value) => value.toLowerCase().includes(needle))
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
      <AdminToolbar description="Les témoignages publiés apparaissent sur l'accueil. Dépublier un témoignage ne le supprime pas : il reste disponible dans cette liste.">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-liquid inline-flex items-center gap-2 bg-[var(--navy-deep)] px-4 py-2.5 font-display text-[13px] uppercase tracking-wide text-white"
        >
          <Plus size={15} />
          Ajouter un témoignage
        </button>
      </AdminToolbar>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearch
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Rechercher un témoignage…"
        />
        <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
          {filtered.length} témoignage{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          title={items.length === 0 ? "Aucun témoignage pour le moment" : "Aucun résultat"}
          description={
            items.length === 0
              ? "Ajoutez un premier témoignage pour rassurer vos futurs clients."
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
                      <div className="flex flex-wrap items-center gap-2">
                        <AdminBadge tone={item.published ? "green" : "steel"}>
                          {item.published ? "Publié" : "Masqué"}
                        </AdminBadge>
                        <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
                          {item.role_fr} · {item.context_fr}
                        </span>
                      </div>
                      <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--navy-deep)]">
                        « {item.quote_fr} »
                      </p>
                      <p className="mt-2 border-t border-[var(--line-soft)] pt-2 font-mono text-[11.5px] leading-relaxed text-[var(--steel)]">
                        EN · {item.role_en} · {item.context_en} : « {item.quote_en} »
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(async () => {
                            try {
                              await toggleTestimonialAction(item.id, !item.published);
                              toast.success(
                                item.published
                                  ? "Témoignage masqué."
                                  : "Témoignage publié."
                              );
                            } catch {
                              toast.error("Impossible de changer la publication.");
                            }
                          })
                        }
                        aria-label={item.published ? "Dépublier" : "Publier"}
                        title={item.published ? "Publié" : "Masqué"}
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
          title={editing ? "Modifier le témoignage" : "Ajouter un témoignage"}
          description="Renseignez les deux langues : le site public bascule automatiquement selon la locale du visiteur."
          size="xl"
        >
          <form
            action={(formData) => {
              startTransition(async () => {
                try {
                  if (editing) {
                    await updateTestimonialAction(editing.id, formData);
                    toast.success("Témoignage mis à jour.");
                  } else {
                    await createTestimonialAction(formData);
                    toast.success("Témoignage ajouté.");
                  }
                  closeForm();
              } catch {
                setFormError("Impossible d'enregistrer le témoignage. Réessayez.");
              }
              });
            }}
            className="grid gap-5"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <AdminFormSection title="Français">
                <AdminField label="Rôle" required>
                  <input
                    name="role_fr"
                    required
                    defaultValue={editing?.role_fr}
                    placeholder="Client particulier"
                    className={fieldClass}
                  />
                </AdminField>
                <AdminField label="Contexte" required>
                  <input
                    name="context_fr"
                    required
                    defaultValue={editing?.context_fr}
                    placeholder="Construction d'une maison, Bangui"
                    className={fieldClass}
                  />
                </AdminField>
                <AdminField label="Témoignage" required>
                  <textarea
                    name="quote_fr"
                    rows={5}
                    required
                    defaultValue={editing?.quote_fr}
                    className={textareaClass}
                  />
                </AdminField>
              </AdminFormSection>

              <AdminFormSection title="English">
                <AdminField label="Role" required>
                  <input
                    name="role_en"
                    required
                    defaultValue={editing?.role_en}
                    placeholder="Private client"
                    className={fieldClass}
                  />
                </AdminField>
                <AdminField label="Context" required>
                  <input
                    name="context_en"
                    required
                    defaultValue={editing?.context_en}
                    placeholder="House construction, Bangui"
                    className={fieldClass}
                  />
                </AdminField>
                <AdminField label="Testimonial" required>
                  <textarea
                    name="quote_en"
                    rows={5}
                    required
                    defaultValue={editing?.quote_en}
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
        title="Supprimer le témoignage"
        message="Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId === null) return;
          const id = deleteId;
          setDeleteId(null);
          startTransition(async () => {
            try {
              await deleteTestimonialAction(id);
              toast.success("Témoignage supprimé.");
            } catch {
              toast.error("Impossible de supprimer le témoignage.");
            }
          });
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

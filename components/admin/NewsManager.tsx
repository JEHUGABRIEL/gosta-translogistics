"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Eye, EyeOff, X } from "lucide-react";
import {
  createNewsPostAction,
  updateNewsPostAction,
  toggleNewsPostAction,
  deleteNewsPostAction,
} from "@/app/admin/actions";
import type { NewsPost } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";

export default function NewsManager({ items }: { items: NewsPost[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-[var(--red)] hover:bg-[var(--red-dark)] text-white transition-colors font-display uppercase tracking-wide text-[13px] px-4 py-2.5 cursor-pointer"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Annuler" : "Ajouter une actualité"}
        </button>
      </div>

      {showForm && (
        <form
          action={(formData) => {
            startTransition(async () => {
              await createNewsPostAction(formData);
              setShowForm(false);
            });
          }}
          className="bg-white border border-[var(--line-soft)] rounded-2xl p-6 grid gap-4"
        >
          <NewsFields />
          <button
            type="submit"
            disabled={isPending}
            className="justify-self-start inline-flex items-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 text-white transition-colors font-display uppercase tracking-wide text-[13px] px-5 py-2.5 cursor-pointer"
          >
            Enregistrer
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-[14px] text-[var(--steel)]">Aucune actualité pour le moment.</p>
      ) : (
        <ul className="grid gap-4">
          {items.map((item) => (
            <li key={item.id} className="bg-white border border-[var(--line-soft)] rounded-2xl p-6">
              {editingId === item.id ? (
                <form
                  action={(formData) => {
                    startTransition(async () => {
                      await updateNewsPostAction(item.id, formData);
                      setEditingId(null);
                    });
                  }}
                  className="grid gap-4"
                >
                  <NewsFields defaults={item} />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center gap-2 bg-[var(--navy-deep)] hover:bg-[var(--navy-mid)] disabled:opacity-60 text-white transition-colors font-display uppercase tracking-wide text-[13px] px-5 py-2.5 cursor-pointer"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-[13px] text-[var(--steel)] hover:text-[var(--navy-deep)] cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="font-mono text-[11.5px] uppercase tracking-wide text-[var(--steel)]">
                      {item.date_label_fr}
                    </p>
                    <p className="text-[16px] font-display uppercase text-[var(--navy-deep)] mt-1">
                      {item.title_fr}
                    </p>
                    {item.content_fr && (
                      <p className="text-[14px] text-[var(--steel)] mt-2 leading-relaxed">
                        {item.content_fr}
                      </p>
                    )}
                    <p className="text-[12.5px] text-[var(--steel)] mt-2 leading-relaxed">
                      EN — {item.date_label_en} : {item.title_en}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => toggleNewsPostAction(item.id, !item.published))
                      }
                      aria-label={item.published ? "Dépublier" : "Publier"}
                      className={`transition-colors cursor-pointer ${
                        item.published
                          ? "text-[var(--red)]"
                          : "text-[var(--steel)] hover:text-[var(--navy-deep)]"
                      }`}
                      title={item.published ? "Publié" : "Masqué"}
                    >
                      {item.published ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                      aria-label="Modifier"
                      className="text-[var(--steel)] hover:text-[var(--navy-deep)] transition-colors cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setDeleteId(item.id)}
                      aria-label="Supprimer"
                      className="text-[var(--steel)] hover:text-[var(--red)] transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Supprimer l'actualité"
        message="Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId !== null) {
            startTransition(() => deleteNewsPostAction(deleteId));
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function NewsFields({ defaults }: { defaults?: NewsPost }) {
  return (
    <div className="grid gap-5">
      <fieldset className="grid gap-4">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)] mb-1">
          Français
        </legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
              Titre
            </label>
            <input
              name="title_fr"
              required
              defaultValue={defaults?.title_fr}
              className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
            />
          </div>
          <div>
            <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
              Date affichée
            </label>
            <input
              name="date_label_fr"
              required
              placeholder="Août 2026"
              defaultValue={defaults?.date_label_fr}
              className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
            />
          </div>
        </div>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Contenu
          </label>
          <textarea
            name="content_fr"
            rows={3}
            defaultValue={defaults?.content_fr ?? ""}
            className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)] mb-1">
          English
        </legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
              Title
            </label>
            <input
              name="title_en"
              required
              defaultValue={defaults?.title_en}
              className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
            />
          </div>
          <div>
            <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
              Displayed date
            </label>
            <input
              name="date_label_en"
              required
              placeholder="August 2026"
              defaultValue={defaults?.date_label_en}
              className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
            />
          </div>
        </div>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Content
          </label>
          <textarea
            name="content_en"
            rows={3}
            defaultValue={defaults?.content_en ?? ""}
            className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
          />
        </div>
      </fieldset>
    </div>
  );
}

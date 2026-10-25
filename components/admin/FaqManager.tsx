"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Eye, EyeOff, X } from "lucide-react";
import {
  createFaqAction,
  updateFaqAction,
  toggleFaqAction,
  deleteFaqAction,
} from "@/app/admin/actions";
import type { Faq } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";

export default function FaqManager({ items }: { items: Faq[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <p className="text-[13.5px] text-[var(--steel)] max-w-xl leading-relaxed">
          Les questions publiées remplacent la liste statique de l&apos;accueil. Si
          aucune question n&apos;est publiée, le site affiche celle des messages
          par défaut — la page publique ne dépend jamais de la base.
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="btn-liquid inline-flex items-center gap-2 shrink-0 bg-[var(--navy-deep)] text-white font-display uppercase tracking-wide text-[13px] px-4 py-2.5 cursor-pointer"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Annuler" : "Ajouter une question"}
        </button>
      </div>

      {showForm && (
        <form
          action={(formData) => {
            startTransition(async () => {
              await createFaqAction(formData);
              setShowForm(false);
            });
          }}
          className="bg-[var(--surface)] border border-[var(--line-soft)] rounded-2xl p-6 grid gap-4"
        >
          <FaqFields />
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
        <p className="text-[14px] text-[var(--steel)]">Aucune question pour le moment.</p>
      ) : (
        <ul className="grid gap-4">
          {items.map((item) => (
            <li key={item.id} className="bg-[var(--surface)] border border-[var(--line-soft)] rounded-2xl p-6">
              {editingId === item.id ? (
                <form
                  action={(formData) => {
                    startTransition(async () => {
                      await updateFaqAction(item.id, formData);
                      setEditingId(null);
                    });
                  }}
                  className="grid gap-4"
                >
                  <FaqFields defaults={item} />
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
                    <p className="text-[16px] font-display uppercase text-[var(--navy-deep)]">
                      {item.question_fr}
                    </p>
                    <p className="text-[14px] text-[var(--steel)] mt-2 leading-relaxed">
                      {item.answer_fr}
                    </p>
                    <p className="text-[12.5px] text-[var(--steel)] mt-3 leading-relaxed">
                      EN · {item.question_en}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => toggleFaqAction(item.id, !item.published))
                      }
                      aria-label={item.published ? "Dépublier" : "Publier"}
                      className={`transition-colors cursor-pointer ${
                        item.published
                          ? "text-[var(--red)]"
                          : "text-[var(--steel)] hover:text-[var(--navy-deep)]"
                      }`}
                      title={item.published ? "Publiée" : "Masquée"}
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
        title="Supprimer la question"
        message="Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId !== null) {
            startTransition(() => deleteFaqAction(deleteId));
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function FaqFields({ defaults }: { defaults?: Faq }) {
  return (
    <div className="grid gap-5">
      <fieldset className="grid gap-4">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)] mb-1">
          Français
        </legend>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Question
          </label>
          <input
            name="question_fr"
            required
            defaultValue={defaults?.question_fr}
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
        </div>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Réponse
          </label>
          <textarea
            name="answer_fr"
            rows={3}
            required
            defaultValue={defaults?.answer_fr}
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)] mb-1">
          English
        </legend>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Question
          </label>
          <input
            name="question_en"
            required
            defaultValue={defaults?.question_en}
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
          />
        </div>
        <div>
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Answer
          </label>
          <textarea
            name="answer_en"
            rows={3}
            required
            defaultValue={defaults?.answer_en}
            className="w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
          />
        </div>
      </fieldset>
    </div>
  );
}

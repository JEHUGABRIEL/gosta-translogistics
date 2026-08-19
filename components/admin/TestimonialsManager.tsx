"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Eye, EyeOff, X } from "lucide-react";
import {
  createTestimonialAction,
  updateTestimonialAction,
  toggleTestimonialAction,
  deleteTestimonialAction,
} from "@/app/admin/actions";
import type { Testimonial } from "@/lib/db/queries";
import ConfirmModal from "./ConfirmModal";

export default function TestimonialsManager({ items }: { items: Testimonial[] }) {
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
          {showForm ? "Annuler" : "Ajouter un témoignage"}
        </button>
      </div>

      {showForm && (
        <form
          action={(formData) => {
            startTransition(async () => {
              await createTestimonialAction(formData);
              setShowForm(false);
            });
          }}
          className="bg-white border border-[var(--line-soft)] rounded-2xl p-6 grid gap-4"
        >
          <TestimonialFields />
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
        <p className="text-[14px] text-[var(--steel)]">Aucun témoignage pour le moment.</p>
      ) : (
        <ul className="grid gap-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white border border-[var(--line-soft)] rounded-2xl p-6"
            >
              {editingId === item.id ? (
                <form
                  action={(formData) => {
                    startTransition(async () => {
                      await updateTestimonialAction(item.id, formData);
                      setEditingId(null);
                    });
                  }}
                  className="grid gap-4"
                >
                  <TestimonialFields defaults={item} />
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
                      {item.role_fr} · {item.context_fr}
                    </p>
                    <p className="text-[15px] text-[var(--navy-deep)] mt-2 leading-relaxed">
                      « {item.quote_fr} »
                    </p>
                    <p className="text-[12.5px] text-[var(--steel)] mt-2 leading-relaxed">
                      EN — {item.role_en} · {item.context_en} : « {item.quote_en} »
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => toggleTestimonialAction(item.id, !item.published))
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
        title="Supprimer le témoignage"
        message="Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => {
          if (deleteId !== null) {
            startTransition(() => deleteTestimonialAction(deleteId));
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function TestimonialFields({ defaults }: { defaults?: Testimonial }) {
  return (
    <div className="grid gap-5">
      <fieldset className="grid sm:grid-cols-2 gap-4">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)] mb-1">
          Français
        </legend>
        <Field label="Rôle" name="role_fr" defaultValue={defaults?.role_fr} placeholder="Client particulier" />
        <Field
          label="Contexte"
          name="context_fr"
          defaultValue={defaults?.context_fr}
          placeholder="Construction d'une maison — Bangui"
        />
        <div className="sm:col-span-2">
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Témoignage
          </label>
          <textarea
            name="quote_fr"
            required
            rows={3}
            defaultValue={defaults?.quote_fr}
            className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
          />
        </div>
      </fieldset>

      <fieldset className="grid sm:grid-cols-2 gap-4">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)] mb-1">
          English
        </legend>
        <Field label="Role" name="role_en" defaultValue={defaults?.role_en} placeholder="Private client" />
        <Field
          label="Context"
          name="context_en"
          defaultValue={defaults?.context_en}
          placeholder="House construction — Bangui"
        />
        <div className="sm:col-span-2">
          <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
            Testimonial
          </label>
          <textarea
            name="quote_en"
            required
            rows={3}
            defaultValue={defaults?.quote_en}
            className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] resize-none"
          />
        </div>
      </fieldset>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-display uppercase text-[13px] tracking-wide text-[var(--navy-deep)] mb-1.5">
        {label}
      </label>
      <input
        name={name}
        required
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border border-[var(--line)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)]"
      />
    </div>
  );
}

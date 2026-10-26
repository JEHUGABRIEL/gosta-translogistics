import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Search,
} from "lucide-react";

/** Classes communes à tous les champs du dashboard. */
export const fieldClass =
  "w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--navy-deep)] placeholder:text-[var(--steel)]/70 focus:outline-none focus:border-[var(--red)]";
export const textareaClass = `${fieldClass} resize-none`;

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminToolbar({
  description,
  children,
}: {
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {description ? (
        <p className="max-w-2xl text-[13.5px] leading-relaxed text-[var(--steel)]">
          {description}
        </p>
      ) : (
        <span />
      )}
      {children ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function AdminField({
  label,
  htmlFor,
  hint,
  required = false,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-display text-[12.5px] uppercase tracking-wide text-[var(--navy-deep)]"
      >
        {label}
        {required && <span className="ml-1 text-[var(--red)]">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-[var(--steel)]">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Bloc de formulaire (remplace les fieldset/legend, dont la grille est fragile). */
export function AdminFormSection({
  title,
  description,
  columns = 1,
  children,
}: {
  title: string;
  description?: string;
  columns?: 1 | 2;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4">
      <div className="flex items-center gap-3">
        <h3 className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--red)]">
          {title}
        </h3>
        <span className="h-px flex-1 bg-[var(--line-soft)]" />
      </div>
      {description && (
        <p className="-mt-2 text-[12.5px] text-[var(--steel)]">{description}</p>
      )}
      <div
        className={`grid gap-4 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
      >
        {children}
      </div>
    </section>
  );
}

export function AdminSearch({
  value,
  onChange,
  placeholder = "Rechercher…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--steel)]"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${fieldClass} pl-9`}
      />
    </div>
  );
}

export function AdminPagination({
  page,
  perPage,
  total,
  onPageChange,
}: {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (total === 0) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);
  const pages: (number | "…")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const buttonClass =
    "inline-flex h-8 min-w-8 items-center justify-center px-2 text-[12.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--line-soft)] px-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
        {start}–{end} sur {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
          className={`${buttonClass} text-[var(--steel)] hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]`}
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((item, index) =>
          item === "…" ? (
            <span
              key={`dots-${index}`}
              className="w-8 text-center text-[12px] text-[var(--steel)]"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`${buttonClass} ${
                item === page
                  ? "bg-[var(--navy-deep)] text-white"
                  : "text-[var(--steel)] hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
              }`}
            >
              {item}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Page suivante"
          className={`${buttonClass} text-[var(--steel)] hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]`}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center">
      <Inbox size={22} className="text-[var(--steel)]" />
      <p className="mt-3 text-[14.5px] font-medium text-[var(--navy-deep)]">
        {title}
      </p>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[var(--steel)]">
          {description}
        </p>
      )}
    </div>
  );
}

export function AdminBadge({
  children,
  tone = "steel",
}: {
  children: ReactNode;
  tone?: "red" | "amber" | "green" | "steel";
}) {
  const tones: Record<string, string> = {
    red: "bg-[var(--red)]/10 text-[var(--red)]",
    amber: "bg-[var(--amber)]/20 text-[#8A5A12]",
    green: "bg-emerald-100 text-emerald-700",
    steel: "bg-[var(--sand-deep)] text-[var(--steel)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

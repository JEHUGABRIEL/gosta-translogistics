import Link from "next/link";
import { Download } from "lucide-react";
import { requireAdmin } from "../../actions";
import AdminShell from "@/components/admin/AdminShell";
import ActivityList from "@/components/admin/ActivityList";
import ResetJournalButton from "@/components/admin/ResetJournalButton";
import {
  AdminEmptyState,
  AdminToolbar,
  fieldClass,
} from "@/components/admin/ui";
import { searchActivity } from "@/lib/db/queries";
import { ADMIN_ACTION_LABELS } from "@/lib/admin-activity";

const PER_PAGE = 20;

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const q = first(params.q).slice(0, 80);
  const action = first(params.action);
  const requestedPage = Math.max(1, Math.floor(Number(first(params.page)) || 1));

  const { rows, total } = await searchActivity(
    { q, action },
    PER_PAGE,
    (requestedPage - 1) * PER_PAGE
  );

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);

  const filters = new URLSearchParams();
  if (q) filters.set("q", q);
  if (action) filters.set("action", action);

  const pageHref = (page: number) => {
    const params = new URLSearchParams(filters);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/admin/activity?${query}` : "/admin/activity";
  };
  const exportQuery = filters.toString();
  const exportHref = exportQuery
    ? `/api/admin/activity/export?${exportQuery}`
    : "/api/admin/activity/export";

  const pagerButton =
    "inline-flex h-8 min-w-8 items-center justify-center px-2 text-[12.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <AdminShell title="Journal d'activité">
      <div className="space-y-5">
        <AdminToolbar description="Toutes les actions effectuées dans le dashboard : connexions, publications, suppressions, invitations. Les entrées sont conservées en base, la recherche porte sur l'action, la cible et l'auteur.">
          <a
            href={exportHref}
            className="inline-flex items-center gap-1.5 border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-display text-[12px] uppercase tracking-wide text-[var(--navy-deep)] transition-colors hover:border-[var(--red)] hover:text-[var(--red)]"
          >
            <Download size={14} />
            Exporter en CSV
          </a>
          <ResetJournalButton />
        </AdminToolbar>

        <form
          method="get"
          action="/admin/activity"
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher dans le journal…"
            aria-label="Rechercher dans le journal"
            className={`${fieldClass} sm:max-w-xs`}
          />
          <select
            name="action"
            defaultValue={action}
            aria-label="Filtrer par action"
            className={`${fieldClass} cursor-pointer sm:max-w-[17rem]`}
          >
            <option value="">Toutes les actions</option>
            {Object.entries(ADMIN_ACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-[var(--navy-deep)] px-5 py-2.5 font-display text-[13px] uppercase tracking-wide text-white transition-colors hover:bg-[var(--navy-mid)]"
          >
            Filtrer
          </button>
          {(q || action) && (
            <Link
              href="/admin/activity"
              className="inline-flex items-center justify-center px-2 py-2.5 font-mono text-[11.5px] uppercase tracking-wide text-[var(--steel)] transition-colors hover:text-[var(--red)]"
            >
              Réinitialiser
            </Link>
          )}
        </form>

        {rows.length === 0 ? (
          <AdminEmptyState
            title={total === 0 ? "Aucune action enregistrée" : "Aucun résultat"}
            description={
              total === 0
                ? "Chaque mutation du dashboard vient s'inscrire ici automatiquement."
                : "Essayez un autre mot-clé ou une autre action."
            }
          />
        ) : (
          <ActivityList entries={rows} />
        )}

        {total > 0 && (
          <div className="flex flex-col gap-3 border-t border-[var(--line-soft)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--steel)]">
              {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, total)}{" "}
              sur {total}
            </p>
            <div className="flex items-center gap-1">
              {totalPages > 1 && (
                <>
                  <Link
                    href={pageHref(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage <= 1}
                    className={`${pagerButton} ${
                      currentPage <= 1
                        ? "pointer-events-none text-[var(--steel)] opacity-35"
                        : "text-[var(--steel)] hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
                    }`}
                  >
                    ←
                  </Link>
                  <span className="px-2 text-[12.5px] text-[var(--navy-deep)]">
                    Page {currentPage} / {totalPages}
                  </span>
                  <Link
                    href={pageHref(Math.min(totalPages, currentPage + 1))}
                    aria-disabled={currentPage >= totalPages}
                    className={`${pagerButton} ${
                      currentPage >= totalPages
                        ? "pointer-events-none text-[var(--steel)] opacity-35"
                        : "text-[var(--steel)] hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
                    }`}
                  >
                    →
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
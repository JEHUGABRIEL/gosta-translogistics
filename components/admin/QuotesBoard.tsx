"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import QuotesTable from "./QuotesTable";
import type { QuoteRequest } from "@/lib/db/queries";
import AdminSearchDebounced from "./AdminSearchDebounced";
import {
  AdminCard,
  AdminPaginationLinks,
  AdminToolbar,
  fieldClass,
} from "./ui";

const STATUS_LABEL: Record<QuoteRequest["status"], string> = {
  new: "Nouveau",
  contacted: "Contacté",
  done: "Traité",
};

export default function QuotesBoard({
  quotes,
  total,
  page,
  pageSize,
  query,
  status,
}: {
  quotes: QuoteRequest[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  status: "all" | QuoteRequest["status"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // L'URL est la source de vérité : page, recherche et statut y vivent pour
  // que le rendu serveur et le partage d'un lien restent cohérents.
  const navigate = (next: {
    page?: number;
    query?: string;
    status?: "all" | QuoteRequest["status"];
  }) => {
    const params = new URLSearchParams();
    const nextQuery = next.query ?? query;
    const nextStatus = next.status ?? status;
    const nextPage = next.page ?? page;
    if (nextQuery) params.set("q", nextQuery);
    if (nextStatus !== "all") params.set("status", nextStatus);
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    startTransition(() => {
      router.push(search ? `${pathname}?${search}` : pathname, { scroll: false });
    });
  };


  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status !== "all") params.set("status", status);
    if (target > 1) params.set("page", String(target));
    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  };

  return (
    <div className="space-y-5">
      <AdminToolbar description="Les demandes envoyées depuis le formulaire du site. Le statut se met à jour directement dans le tableau.">
        <button
          type="button"
          onClick={() => startTransition(() => router.refresh())}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-display text-[12px] uppercase tracking-wide text-[var(--navy-deep)] transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-60"
        >
          <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
          Rafraîchir
        </button>
      </AdminToolbar>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <AdminSearchDebounced
            initialValue={query}
            onChange={(value) => navigate({ page: 1, query: value })}
            placeholder="Rechercher un devis…"
          />
          <select
            key={status}
            defaultValue={status}
            onChange={(event) =>
              navigate({
                page: 1,
                status: event.target.value as "all" | QuoteRequest["status"],
              })
            }
            aria-label="Filtrer par statut"
            className={`${fieldClass} w-full cursor-pointer sm:max-w-[11rem]`}
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {quotes.length === 0 ? (
        <AdminCard className="px-6 py-12 text-center">
          <p className="text-[14.5px] font-medium text-[var(--navy-deep)]">
            {total === 0 && !query && status === "all"
              ? "Aucune demande de devis pour le moment"
              : "Aucun résultat"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-[var(--steel)]">
            {total === 0 && !query && status === "all"
              ? "Les demandes soumises depuis le formulaire du site apparaîtront ici."
              : "Essayez un autre statut ou un autre mot-clé."}
          </p>
        </AdminCard>
      ) : (
        <>
          <QuotesTable
            quotes={quotes}
            onChanged={() => startTransition(() => router.refresh())}
          />
          <AdminPaginationLinks
            page={page}
            perPage={pageSize}
            total={total}
            hrefFor={hrefFor}
          />
        </>
      )}
    </div>
  );
}

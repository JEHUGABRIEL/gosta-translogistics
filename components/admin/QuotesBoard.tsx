"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import QuotesTable from "./QuotesTable";
import type { QuoteRequest } from "@/lib/db/queries";
import {
  AdminCard,
  AdminPagination,
  AdminSearch,
  AdminToolbar,
  fieldClass,
} from "./ui";

const PER_PAGE = 10;

const STATUS_LABEL: Record<QuoteRequest["status"], string> = {
  new: "Nouveau",
  contacted: "Contacté",
  done: "Traité",
};

export default function QuotesBoard({
  initialQuotes,
}: {
  initialQuotes: QuoteRequest[];
}) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | QuoteRequest["status"]>("all");
  const [page, setPage] = useState(1);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["admin", "quotes"],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/admin/quotes", { signal, cache: "no-store" });
      if (!res.ok) throw new Error("Chargement impossible");
      const json = (await res.json()) as { quotes: QuoteRequest[] };
      return json.quotes;
    },
    initialData: initialQuotes,
    staleTime: 30 * 1000,
  });

  const refresh = () => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: ["admin", "quotes"] });
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.filter((quote) => {
      if (status !== "all" && quote.status !== status) return false;
      if (!needle) return true;
      return [quote.name, quote.phone, quote.service ?? "", quote.message ?? ""].some(
        (value) => value.toLowerCase().includes(needle)
      );
    });
  }, [data, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <div className="space-y-5">
      <AdminToolbar description="Les demandes envoyées depuis le formulaire du site. Le statut se met à jour directement dans le tableau.">
        <button
          type="button"
          onClick={refresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-display text-[12px] uppercase tracking-wide text-[var(--navy-deep)] transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-60"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Rafraîchir
        </button>
      </AdminToolbar>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <AdminSearch
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Rechercher un devis…"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "all" | QuoteRequest["status"]);
              setPage(1);
            }}
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

      {visible.length === 0 ? (
        <AdminCard className="px-6 py-12 text-center">
          <p className="text-[14.5px] font-medium text-[var(--navy-deep)]">
            {data.length === 0
              ? "Aucune demande de devis pour le moment"
              : "Aucun résultat"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-[var(--steel)]">
            {data.length === 0
              ? "Les demandes soumises depuis le formulaire du site apparaîtront ici."
              : "Essayez un autre statut ou un autre mot-clé."}
          </p>
        </AdminCard>
      ) : (
        <>
          <QuotesTable quotes={visible} onChanged={refresh} />
          <AdminPagination
            page={currentPage}
            perPage={PER_PAGE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

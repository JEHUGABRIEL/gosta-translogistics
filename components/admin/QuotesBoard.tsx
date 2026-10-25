"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import QuotesTable from "./QuotesTable";
import type { QuoteRequest } from "@/lib/db/queries";

export default function QuotesBoard({
  initialQuotes,
}: {
  initialQuotes: QuoteRequest[];
}) {
  const queryClient = useQueryClient();

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

  return (
    <div>
      <div className="flex items-center justify-end gap-3 mb-3">
        <span className="font-mono text-[11.5px] uppercase tracking-wide text-[var(--steel)]">
          {data.length} demande{data.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={refresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-[12.5px] font-display uppercase tracking-wide text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Rafraîchir
        </button>
      </div>

      <QuotesTable quotes={data} onChanged={refresh} />
    </div>
  );
}

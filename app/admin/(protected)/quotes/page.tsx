import { requireAdmin } from "@/lib/admin-guard";
import AdminShell from "@/components/admin/AdminShell";
import QuotesBoard from "@/components/admin/QuotesBoard";
import { countQuoteRequests, listQuoteRequests } from "@/lib/db/queries";
import type { QuoteRequest } from "@/lib/db/queries";

const PAGE_SIZE = 10;
const STATUSES: readonly QuoteRequest["status"][] = ["new", "contacted", "done"];

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const rawPage = Number(first(params.page));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const query = (first(params.q) ?? "").slice(0, 80);
  const rawStatus = first(params.status) ?? "all";
  const status = STATUSES.includes(rawStatus as QuoteRequest["status"])
    ? (rawStatus as QuoteRequest["status"])
    : "all";

  // Filtres et pagination en SQL : le tableau ne montre jamais une page
  // partielle filtrée côté navigateur.
  const [quotes, total] = await Promise.all([
    listQuoteRequests({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      query,
      status,
    }),
    countQuoteRequests({ query, status }),
  ]);

  return (
    <AdminShell title="Demandes de devis">
      <QuotesBoard
        quotes={quotes}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        query={query}
        status={status === "all" ? "all" : status}
      />
    </AdminShell>
  );
}

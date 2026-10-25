import { requireAdmin } from "../../actions";
import AdminShell from "@/components/admin/AdminShell";
import QuotesBoard from "@/components/admin/QuotesBoard";
import { listQuoteRequests } from "@/lib/db/queries";

export default async function AdminQuotesPage() {
  await requireAdmin();
  // Première peinture rendue côté serveur, puis TanStack Query prend le relais.
  const quotes = await listQuoteRequests();

  return (
    <AdminShell title="Demandes de devis">
      <QuotesBoard initialQuotes={quotes} />
    </AdminShell>
  );
}

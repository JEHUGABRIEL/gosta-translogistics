import { requireAdmin } from "../actions";
import AdminShell from "@/components/admin/AdminShell";
import QuotesTable from "@/components/admin/QuotesTable";
import { listQuoteRequests } from "@/lib/db/queries";

export default async function AdminQuotesPage() {
  await requireAdmin();
  const quotes = await listQuoteRequests();

  return (
    <AdminShell title="Demandes de devis">
      <QuotesTable quotes={quotes} />
    </AdminShell>
  );
}

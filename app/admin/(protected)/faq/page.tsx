import { requireAdmin } from "../../actions";
import AdminShell from "@/components/admin/AdminShell";
import FaqManager from "@/components/admin/FaqManager";
import { listFaqs } from "@/lib/db/queries";

export default async function AdminFaqPage() {
  await requireAdmin();
  const items = await listFaqs();

  return (
    <AdminShell title="FAQ">
      <FaqManager items={items} />
    </AdminShell>
  );
}

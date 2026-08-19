import { requireAdmin } from "../actions";
import AdminShell from "@/components/admin/AdminShell";
import NewsManager from "@/components/admin/NewsManager";
import { listNewsPosts } from "@/lib/db/queries";

export default async function AdminNewsPage() {
  await requireAdmin();
  const items = await listNewsPosts();

  return (
    <AdminShell title="Actualités">
      <NewsManager items={items} />
    </AdminShell>
  );
}

import { requireAdmin } from "../actions";
import AdminShell from "@/components/admin/AdminShell";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { listTestimonials } from "@/lib/db/queries";

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const items = await listTestimonials();

  return (
    <AdminShell title="Témoignages">
      <TestimonialsManager items={items} />
    </AdminShell>
  );
}

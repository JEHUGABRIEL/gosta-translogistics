import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminAccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell title="Mon compte">
      <div className="max-w-md bg-white border border-[var(--line-soft)] rounded-2xl p-6">
        <p className="text-[14px] text-[var(--steel)]">
          Connecté en tant que <span className="text-[var(--navy-deep)]">{user.email}</span>
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </AdminShell>
  );
}

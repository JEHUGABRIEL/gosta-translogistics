import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin-auth";
import { listAdminUsers, listPendingInvites } from "@/lib/db/queries";
import AdminShell from "@/components/admin/AdminShell";
import InviteForm from "@/components/admin/InviteForm";
import { Mail, Clock } from "lucide-react";

export default async function AdminTeamPage() {
  const me = await getSessionUser();
  if (!me) redirect("/admin/login");

  const [users, invites] = await Promise.all([listAdminUsers(), listPendingInvites()]);

  return (
    <AdminShell title="Équipe">
      <div className="grid gap-8 max-w-2xl">
        <div className="bg-white border border-[var(--line-soft)] rounded-2xl p-6">
          <h2 className="font-display uppercase text-[15px] text-[var(--navy-deep)]">
            Inviter un nouvel admin
          </h2>
          <p className="text-[13.5px] text-[var(--steel)] mt-1">
            La personne invitée reçoit un email avec un lien pour créer son compte, puis confirme
            son adresse par un code envoyé par email.
          </p>
          <div className="mt-5">
            <InviteForm />
          </div>
        </div>

        <div className="bg-white border border-[var(--line-soft)] rounded-2xl p-6">
          <h2 className="font-display uppercase text-[15px] text-[var(--navy-deep)]">
            Comptes admin
          </h2>
          <ul className="mt-4 divide-y divide-[var(--line-soft)]">
            {users.map((u) => {
              const hasName = u.first_name && u.last_name;
              return (
                <li key={u.id} className="py-3">
                  <p className="text-[14.5px] text-[var(--navy-deep)]">
                    {hasName ? `${u.first_name} ${u.last_name}` : u.email}
                    {u.id === me.id && (
                      <span className="ml-2 font-mono text-[11px] uppercase tracking-wide text-[var(--red)]">
                        (vous)
                      </span>
                    )}
                  </p>
                  {hasName && <p className="text-[13px] text-[var(--steel)]">{u.email}</p>}
                </li>
              );
            })}
          </ul>
        </div>

        {invites.length > 0 && (
          <div className="bg-white border border-[var(--line-soft)] rounded-2xl p-6">
            <h2 className="font-display uppercase text-[15px] text-[var(--navy-deep)]">
              Invitations en attente
            </h2>
            <ul className="mt-4 divide-y divide-[var(--line-soft)]">
              {invites.map((inv) => (
                <li key={inv.id} className="py-3 flex items-center gap-3">
                  <Mail size={16} className="text-[var(--red)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[14.5px] text-[var(--navy-deep)] truncate">{inv.email}</p>
                    <p className="text-[12.5px] text-[var(--steel)] flex items-center gap-1.5">
                      <Clock size={12} />
                      {inv.status === "otp_sent" ? "En attente de confirmation" : "En attente d'acceptation"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

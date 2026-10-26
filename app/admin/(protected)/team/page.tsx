import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin-auth";
import { listAdminUsers, listPendingInvites, listRecentActivity } from "@/lib/db/queries";
import AdminShell from "@/components/admin/AdminShell";
import InviteForm from "@/components/admin/InviteForm";
import { AdminCard } from "@/components/admin/ui";
import { ADMIN_ACTION_LABELS } from "@/lib/admin-activity";
import { Mail, Clock, History } from "lucide-react";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Bangui",
});

export default async function AdminTeamPage() {
  const me = await getSessionUser();
  if (!me) redirect("/admin/login");

  const [users, invites, activity] = await Promise.all([
    listAdminUsers(),
    listPendingInvites(),
    listRecentActivity(20),
  ]);

  return (
    <AdminShell title="Équipe">
      <div className="grid max-w-3xl gap-6">
        <AdminCard className="p-6">
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
        </AdminCard>

        <AdminCard className="p-6">
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
        </AdminCard>

        {invites.length > 0 && (
          <AdminCard className="p-6">
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
          </AdminCard>
        )}

        <AdminCard className="p-6">
          <h2 className="font-display uppercase text-[15px] text-[var(--navy-deep)]">
            Activité récente
          </h2>
          <p className="text-[12.5px] text-[var(--steel)] mt-1">
            Les 20 dernières actions effectuées dans le dashboard.
          </p>
          {activity.length === 0 ? (
            <p className="mt-4 text-[13.5px] text-[var(--steel)]">Aucune action enregistrée.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line-soft)]">
              {activity.map((entry) => (
                <li key={entry.id} className="py-3 flex items-start gap-3">
                  <History size={16} className="shrink-0 text-[var(--red)] mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[13.5px] text-[var(--navy-deep)]">
                      {ADMIN_ACTION_LABELS[entry.action] ?? entry.action}
                      {entry.target && (
                        <span className="text-[var(--steel)]"> · {entry.target}</span>
                      )}
                    </p>
                    <p className="text-[12.5px] text-[var(--steel)]">
                      {entry.email ?? "compte supprimé"} · {dateFormat.format(new Date(entry.created_at))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}

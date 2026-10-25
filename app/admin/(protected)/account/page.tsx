import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import SessionsList from "@/components/admin/SessionsList";
import { getCurrentSessionTokenHash, getSessionUser } from "@/lib/admin-auth";
import { listSessionsForUser } from "@/lib/db/queries";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Bangui",
});

export default async function AdminAccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [sessions, currentTokenHash] = await Promise.all([
    listSessionsForUser(user.id),
    getCurrentSessionTokenHash(),
  ]);

  // Seuls les champs utiles au client sont sérialisés : jamais le token haché.
  const sessionItems = sessions.map((session) => ({
    id: session.id,
    createdAt: dateFormat.format(new Date(session.created_at)),
    expiresAt: dateFormat.format(new Date(session.expires_at)),
    current: currentTokenHash !== null && session.token_hash === currentTokenHash,
  }));

  return (
    <AdminShell title="Mon compte">
      <div className="max-w-md grid gap-6">
        <div className="bg-white border border-[var(--line-soft)] rounded-2xl p-6">
          <p className="text-[14px] text-[var(--steel)]">
            Connecté en tant que <span className="text-[var(--navy-deep)]">{user.email}</span>
          </p>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </div>

        <div className="bg-white border border-[var(--line-soft)] rounded-2xl p-6">
          <h2 className="font-display uppercase text-[15px] text-[var(--navy-deep)]">
            Sessions actives
          </h2>
          <p className="text-[12.5px] text-[var(--steel)] mt-1">
            Fermer une session déconnecte immédiatement le navigateur correspondant.
            Changer de mot de passe les ferme toutes.
          </p>
          <div className="mt-4">
            <SessionsList sessions={sessionItems} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

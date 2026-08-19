import { sha256Hex } from "@/lib/admin-auth";
import { findInviteByTokenHash } from "@/lib/db/queries";
import AcceptInviteForm from "@/components/admin/AcceptInviteForm";
import AuthCard from "@/components/admin/AuthCard";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const invite = token ? await findInviteByTokenHash(sha256Hex(token)) : undefined;
  const valid =
    !!invite && invite.status === "pending" && new Date(invite.expires_at) > new Date();

  if (!valid) {
    return (
      <AuthCard subtitle="Invitation">
        <p className="text-[14.5px] text-[var(--steel)]">
          Ce lien d&apos;invitation n&apos;est plus valide. Il a peut-être expiré ou déjà été
          utilisé — demandez une nouvelle invitation à un administrateur.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard subtitle={`Invitation pour ${invite.email}`}>
      <AcceptInviteForm token={token!} />
    </AuthCard>
  );
}

import { sha256Hex } from "@/lib/admin-auth";
import { findInviteByTokenHash } from "@/lib/db/queries";
import AuthCard from "@/components/admin/AuthCard";
import VerifyOtpForm from "@/components/admin/VerifyOtpForm";

export default async function VerifyInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const invite = token ? await findInviteByTokenHash(sha256Hex(token)) : undefined;

  if (!invite || invite.status !== "otp_sent") {
    return (
      <AuthCard subtitle="Confirmation">
        <p className="text-[14.5px] text-[var(--steel)]">
          Rien à confirmer ici — commencez par le lien d&apos;invitation reçu par email.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard subtitle={`Code envoyé à ${invite.email}`}>
      <VerifyOtpForm token={token!} />
    </AuthCard>
  );
}

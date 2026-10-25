import { redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/admin-auth";
import { readMfaChallengeToken } from "@/lib/mfa";
import VerifyMfaForm from "@/components/admin/VerifyMfaForm";
import AuthCard from "@/components/admin/AuthCard";

export default async function AdminMfaVerifyPage() {
  if (await hasValidAdminSession()) {
    redirect("/admin");
  }
  // Pas de défi en cours : le mot de passe n'a pas encore été validé.
  if (!(await readMfaChallengeToken())) {
    redirect("/admin/login");
  }

  return (
    <AuthCard subtitle="Vérification en deux étapes">
      <VerifyMfaForm />
    </AuthCard>
  );
}

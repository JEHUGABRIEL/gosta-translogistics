import { redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";
import AuthCard from "@/components/admin/AuthCard";

export default async function AdminLoginPage() {
  if (await hasValidAdminSession()) {
    redirect("/admin");
  }

  return (
    <AuthCard subtitle="Dashboard admin">
      <LoginForm />
    </AuthCard>
  );
}

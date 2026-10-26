import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin-auth";
import { AdminToastProvider } from "@/components/admin/ToastProvider";

/**
 * Garde en profondeur du dashboard.
 *
 * Chaque page revérifie la session pour ses propres lectures (`requireAdmin`)
 * — un layout ne protège ni les Server Actions ni les accès directs à la base.
 * Ce garde-fou ajoute une couche : une nouvelle page déposée sous
 * `app/admin/(protected)/` ne peut pas être servie sans session, même si son
 * auteur oublie l'appel.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return <AdminToastProvider>{children}</AdminToastProvider>;
}

import "server-only";

import { redirect } from "next/navigation";
import { getSessionUser, type AdminUser } from "./admin-auth";

/**
 * Garde d'autorisation des pages, Server Actions et route handlers admin.
 *
 * Vit hors de `app/admin/actions.ts` : tout export d'un module `"use server"`
 * devient un endpoint d'action appelable par un client, et cette garde n'a
 * rien à faire dans la surface publique.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * Garde des actions réservées au compte fondateur (inviter un admin, purger le
 * journal). Un admin standard garde l'accès au contenu et aux demandes.
 */
export async function requireOwner(): Promise<AdminUser> {
  const user = await requireAdmin();
  if (user.role !== "owner") {
    throw new Error("Action réservée au propriétaire du compte.");
  }
  return user;
}

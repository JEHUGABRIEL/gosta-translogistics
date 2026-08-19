"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  findUserByEmail,
  hasValidAdminSession,
  hashPassword,
  touchLastLogin,
  verifyPassword,
  getSessionUser,
  sha256Hex,
  generateInviteToken,
  generateOtp,
  timingSafeEqualHex,
} from "@/lib/admin-auth";
import { getDb } from "@/lib/db/client";
import { SITE_URL } from "@/lib/seo";
import { sendEmail, inviteEmailHtml, otpEmailHtml } from "@/lib/email";
import {
  isLocked,
  recordFailure,
  recordSuccess,
  lockoutRemaining,
} from "@/lib/rate-limit";
import {
  createNewsPost,
  createTestimonial,
  deleteNewsPost,
  deleteQuoteRequest,
  deleteTestimonial,
  setNewsPostPublished,
  setTestimonialPublished,
  updateNewsPost,
  updateQuoteRequestStatus,
  updateTestimonial,
  createInvite,
  findInviteByTokenHash,
  setInviteSignup,
  refreshInviteOtp,
  incrementInviteOtpAttempts,
  acceptInvite,
  type QuoteRequest,
} from "@/lib/db/queries";

const INVITE_TTL_MS = 48 * 60 * 60 * 1000;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

export async function requireAdmin() {
  if (!(await hasValidAdminSession())) {
    redirect("/admin/login");
  }
}

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  if (isLocked(email)) {
    const remaining = lockoutRemaining(email);
    return {
      error: `Trop de tentatives. Réessayez dans ${Math.ceil(remaining / 60)} minute${Math.ceil(remaining / 60) > 1 ? "s" : ""}.`,
    };
  }

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    const { remaining, locked } = recordFailure(email);
    if (locked) {
      return { error: "Trop de tentatives. Compte bloqué 15 minutes." };
    }
    return {
      error: `Email ou mot de passe incorrect. ${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`,
    };
  }

  recordSuccess(email);
  await createSession(user.id);
  await touchLastLogin(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_prevState: unknown, formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  const full = await findUserByEmail(user.email);
  if (!full || !(await verifyPassword(currentPassword, full.password_hash))) {
    return { error: "Mot de passe actuel incorrect." };
  }
  if (newPassword.length < 8) {
    return { error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
  }

  const sql = getDb();
  await sql`UPDATE admin_users SET password_hash = ${await hashPassword(newPassword)} WHERE id = ${user.id}`;
  return { success: "Mot de passe mis à jour." };
}

export async function updateQuoteStatusAction(id: number, status: QuoteRequest["status"]) {
  await requireAdmin();
  await updateQuoteRequestStatus(id, status);
  revalidatePath("/admin/quotes");
}

export async function deleteQuoteAction(id: number) {
  await requireAdmin();
  await deleteQuoteRequest(id);
  revalidatePath("/admin/quotes");
}

function fields(formData: FormData, names: string[]) {
  return Object.fromEntries(
    names.map((n) => [n, String(formData.get(n) ?? "").trim()])
  );
}

export async function createTestimonialAction(formData: FormData) {
  await requireAdmin();
  const input = fields(formData, [
    "role_fr", "role_en", "context_fr", "context_en", "quote_fr", "quote_en",
  ]) as Parameters<typeof createTestimonial>[0];
  await createTestimonial(input);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function updateTestimonialAction(id: number, formData: FormData) {
  await requireAdmin();
  const input = fields(formData, [
    "role_fr", "role_en", "context_fr", "context_en", "quote_fr", "quote_en",
  ]) as Parameters<typeof updateTestimonial>[1];
  await updateTestimonial(id, input);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialAction(id: number, published: boolean) {
  await requireAdmin();
  await setTestimonialPublished(id, published);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonialAction(id: number) {
  await requireAdmin();
  await deleteTestimonial(id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function createNewsPostAction(formData: FormData) {
  await requireAdmin();
  const input = fields(formData, [
    "title_fr", "title_en", "date_label_fr", "date_label_en", "content_fr", "content_en",
  ]) as Parameters<typeof createNewsPost>[0];
  await createNewsPost(input);
  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function updateNewsPostAction(id: number, formData: FormData) {
  await requireAdmin();
  const input = fields(formData, [
    "title_fr", "title_en", "date_label_fr", "date_label_en", "content_fr", "content_en",
  ]) as Parameters<typeof updateNewsPost>[1];
  await updateNewsPost(id, input);
  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function toggleNewsPostAction(id: number, published: boolean) {
  await requireAdmin();
  await setNewsPostPublished(id, published);
  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function deleteNewsPostAction(id: number) {
  await requireAdmin();
  await deleteNewsPost(id);
  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function inviteAdminAction(_prevState: unknown, formData: FormData) {
  const inviter = await getSessionUser();
  if (!inviter) redirect("/admin/login");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Email invalide." };
  }
  if (await findUserByEmail(email)) {
    return { error: "Cette personne a déjà un compte admin." };
  }

  const token = generateInviteToken();
  await createInvite({
    email,
    invitedBy: inviter.id,
    tokenHash: sha256Hex(token),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS).toISOString(),
  });

  const acceptUrl = `${SITE_URL}/admin/accept-invite?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Invitation au dashboard admin — GOSTA TRANS",
    html: inviteEmailHtml({ acceptUrl, invitedByEmail: inviter.email }),
  });

  revalidatePath("/admin/team");
  return { success: `Invitation envoyée à ${email}.` };
}

export async function submitInviteSignupAction(_prevState: unknown, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!firstName || !lastName) {
    return { error: "Nom et prénom sont requis." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }
  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const invite = await findInviteByTokenHash(sha256Hex(token));
  if (!invite || invite.status === "accepted" || new Date(invite.expires_at) < new Date()) {
    return { error: "Cette invitation n'est plus valide." };
  }

  const otp = generateOtp();
  await setInviteSignup({
    tokenHash: sha256Hex(token),
    firstName,
    lastName,
    passwordHash: await hashPassword(password),
    otpHash: sha256Hex(otp),
    otpExpiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });

  await sendEmail({
    to: invite.email,
    subject: "Votre code de confirmation — GOSTA TRANS",
    html: otpEmailHtml({ code: otp }),
  });

  redirect(`/admin/accept-invite/verify?token=${token}`);
}

export async function resendInviteOtpAction(token: string) {
  const invite = await findInviteByTokenHash(sha256Hex(token));
  if (!invite || invite.status !== "otp_sent") return { error: "Invitation invalide." };

  const otp = generateOtp();
  await refreshInviteOtp({
    tokenHash: sha256Hex(token),
    otpHash: sha256Hex(otp),
    otpExpiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });
  await sendEmail({
    to: invite.email,
    subject: "Votre code de confirmation — GOSTA TRANS",
    html: otpEmailHtml({ code: otp }),
  });
  return { success: "Nouveau code envoyé." };
}

export async function verifyInviteOtpAction(_prevState: unknown, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const code = String(formData.get("code") ?? "").trim();

  const invite = await findInviteByTokenHash(sha256Hex(token));
  if (!invite || invite.status !== "otp_sent") {
    return { error: "Invitation invalide ou déjà utilisée." };
  }
  if (!invite.otp_hash || !invite.otp_expires_at || new Date(invite.otp_expires_at) < new Date()) {
    return { error: "Code expiré — demandez-en un nouveau." };
  }
  if (invite.otp_attempts >= OTP_MAX_ATTEMPTS) {
    return { error: "Trop de tentatives — demandez un nouveau code." };
  }

  if (!timingSafeEqualHex(sha256Hex(code), invite.otp_hash)) {
    await incrementInviteOtpAttempts(token ? sha256Hex(token) : "");
    return { error: "Code incorrect." };
  }

  const user = await acceptInvite({
    tokenHash: sha256Hex(token),
    email: invite.email,
    firstName: invite.first_name ?? "",
    lastName: invite.last_name ?? "",
    passwordHash: invite.password_hash ?? "",
  });

  await createSession(user.id);
  redirect("/admin");
}

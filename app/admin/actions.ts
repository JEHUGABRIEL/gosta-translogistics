"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  findUserByEmail,
  hashPassword,
  touchLastLogin,
  verifyPassword,
  getSessionUser,
  sha256Hex,
  generateInviteToken,
  generateOtp,
  timingSafeEqualHex,
  verifyAgainstDummyHash,
  MAX_PASSWORD_LENGTH,
  type AdminUser,
} from "@/lib/admin-auth";
import {
  clearLoginFailures,
  isInviteIpRateLimited,
  isLoginIpRateLimited,
  loginLockRemaining,
  registerLoginFailure,
} from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";
import { SITE_URL } from "@/lib/seo";
import { sendEmail, inviteEmailHtml, otpEmailHtml } from "@/lib/email";
import {
  createNewsPost,
  createTestimonial,
  deleteNewsPost,
  deleteQuoteRequest,
  deleteSessionById,
  deleteSessionsForUser,
  deleteTestimonial,
  logAdminActivity,
  setNewsPostPublished,
  setTestimonialPublished,
  updateAdminPassword,
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
/** Plafond de renvois par invitation : borne aussi le nombre total de codes essayables. */
const OTP_MAX_RESENDS = 5;

const QUOTE_STATUSES: QuoteRequest["status"][] = ["new", "contacted", "done"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validatePasswordStrength(password: string): string | null {
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Le mot de passe ne doit pas dépasser ${MAX_PASSWORD_LENGTH} caractères.`;
  }
  if (password.length < 8) return "Le mot de passe doit faire au moins 8 caractères.";
  if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule.";
  if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une minuscule.";
  if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
  return null;
}

/**
 * Garde d'autorisation des Server Actions et des pages protégées.
 * Retourne l'admin courant, ou redirige vers la connexion.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

// ---------- Authentification ----------

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const ip = await getRequestIp();

  if (await isLoginIpRateLimited(ip)) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const lockedFor = await loginLockRemaining(email, ip);
  if (lockedFor > 0) {
    const minutes = Math.ceil(lockedFor / 60);
    return {
      error: `Trop de tentatives. Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}.`,
    };
  }

  const user = await findUserByEmail(email);
  // Un scrypt de coût équivalent est exécuté même quand l'email est inconnu :
  // sinon le temps de réponse révèle l'existence d'un compte.
  const passwordOk = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyAgainstDummyHash(password);

  if (!user || !passwordOk) {
    const { locked } = await registerLoginFailure(email, ip);
    // Message générique : ni l'existence du compte ni le nombre d'essais
    // restants ne sont divulgués.
    return {
      error: locked
        ? "Trop de tentatives. Compte temporairement bloqué."
        : "Email ou mot de passe incorrect.",
    };
  }

  await clearLoginFailures(email, ip);
  await createSession(user.id);
  await touchLastLogin(user.id);
  await logAdminActivity({ userId: user.id, action: "auth.login" });
  redirect("/admin");
}

export async function logoutAction() {
  const user = await getSessionUser();
  if (user) {
    await logAdminActivity({ userId: user.id, action: "auth.logout" });
  }
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
  const pwdError = validatePasswordStrength(newPassword);
  if (pwdError) return { error: pwdError };

  await updateAdminPassword(user.id, await hashPassword(newPassword));

  // Toutes les sessions ouvertes sont révoquées — y compris celle d'un
  // attaquant qui aurait volé un cookie — puis une nouvelle est créée pour ce
  // navigateur, ce qui renouvelle aussi le token courant.
  await deleteSessionsForUser(user.id);
  await createSession(user.id);
  await logAdminActivity({ userId: user.id, action: "auth.password_changed" });

  return {
    success: "Mot de passe mis à jour. Les autres sessions ont été déconnectées.",
  };
}

export async function revokeSessionAction(id: number) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id)) throw new Error("Session invalide.");

  await deleteSessionById(id, admin.id);
  await logAdminActivity({
    userId: admin.id,
    action: "session.revoked",
    target: String(id),
  });
  revalidatePath("/admin/account");
}

// ---------- Demandes de devis ----------

export async function updateQuoteStatusAction(id: number, status: QuoteRequest["status"]) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id) || !QUOTE_STATUSES.includes(status)) {
    throw new Error("Paramètres invalides.");
  }

  await updateQuoteRequestStatus(id, status);
  await logAdminActivity({
    userId: admin.id,
    action: "quote.status_changed",
    target: `#${id} → ${status}`,
  });
  revalidatePath("/admin/quotes");
}

export async function deleteQuoteAction(id: number) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id)) throw new Error("Identifiant invalide.");

  await deleteQuoteRequest(id);
  await logAdminActivity({
    userId: admin.id,
    action: "quote.deleted",
    target: `#${id}`,
  });
  revalidatePath("/admin/quotes");
}

// ---------- Contenu bilingue ----------

const FIELD_MAX_LENGTHS: Record<string, number> = {
  role_fr: 200,
  role_en: 200,
  context_fr: 500,
  context_en: 500,
  quote_fr: 2000,
  quote_en: 2000,
  title_fr: 300,
  title_en: 300,
  date_label_fr: 100,
  date_label_en: 100,
  content_fr: 5000,
  content_en: 5000,
};
const DEFAULT_FIELD_MAX = 500;

function fields(formData: FormData, names: string[]) {
  return Object.fromEntries(
    names.map((n) => {
      const max = FIELD_MAX_LENGTHS[n] ?? DEFAULT_FIELD_MAX;
      return [n, String(formData.get(n) ?? "").trim().slice(0, max)];
    })
  );
}

export async function createTestimonialAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = fields(formData, [
    "role_fr", "role_en", "context_fr", "context_en", "quote_fr", "quote_en",
  ]) as Parameters<typeof createTestimonial>[0];
  await createTestimonial(input);
  await logAdminActivity({
    userId: admin.id,
    action: "testimonial.created",
    target: input.role_fr,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function updateTestimonialAction(id: number, formData: FormData) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id)) throw new Error("Identifiant invalide.");
  const input = fields(formData, [
    "role_fr", "role_en", "context_fr", "context_en", "quote_fr", "quote_en",
  ]) as Parameters<typeof updateTestimonial>[1];
  await updateTestimonial(id, input);
  await logAdminActivity({
    userId: admin.id,
    action: "testimonial.updated",
    target: `#${id} ${input.role_fr}`,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialAction(id: number, published: boolean) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id) || typeof published !== "boolean") {
    throw new Error("Paramètres invalides.");
  }
  await setTestimonialPublished(id, published);
  await logAdminActivity({
    userId: admin.id,
    action: published ? "testimonial.published" : "testimonial.unpublished",
    target: `#${id}`,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonialAction(id: number) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id)) throw new Error("Identifiant invalide.");
  await deleteTestimonial(id);
  await logAdminActivity({
    userId: admin.id,
    action: "testimonial.deleted",
    target: `#${id}`,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function createNewsPostAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = fields(formData, [
    "title_fr", "title_en", "date_label_fr", "date_label_en", "content_fr", "content_en",
  ]) as Parameters<typeof createNewsPost>[0];
  await createNewsPost(input);
  await logAdminActivity({
    userId: admin.id,
    action: "news.created",
    target: input.title_fr,
  });
  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function updateNewsPostAction(id: number, formData: FormData) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id)) throw new Error("Identifiant invalide.");
  const input = fields(formData, [
    "title_fr", "title_en", "date_label_fr", "date_label_en", "content_fr", "content_en",
  ]) as Parameters<typeof updateNewsPost>[1];
  await updateNewsPost(id, input);
  await logAdminActivity({
    userId: admin.id,
    action: "news.updated",
    target: `#${id} ${input.title_fr}`,
  });
  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function toggleNewsPostAction(id: number, published: boolean) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id) || typeof published !== "boolean") {
    throw new Error("Paramètres invalides.");
  }
  await setNewsPostPublished(id, published);
  await logAdminActivity({
    userId: admin.id,
    action: published ? "news.published" : "news.unpublished",
    target: `#${id}`,
  });
  revalidatePath("/admin/news");
  revalidatePath("/");
}

export async function deleteNewsPostAction(id: number) {
  const admin = await requireAdmin();
  if (!Number.isInteger(id)) throw new Error("Identifiant invalide.");
  await deleteNewsPost(id);
  await logAdminActivity({
    userId: admin.id,
    action: "news.deleted",
    target: `#${id}`,
  });
  revalidatePath("/admin/news");
  revalidatePath("/");
}

// ---------- Invitations ----------

export async function inviteAdminAction(_prevState: unknown, formData: FormData) {
  const inviter = await getSessionUser();
  if (!inviter) redirect("/admin/login");

  const ip = await getRequestIp();
  if (await isInviteIpRateLimited(ip)) {
    return { error: "Trop d'invitations envoyées. Réessayez dans quelques minutes." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
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

  await logAdminActivity({
    userId: inviter.id,
    action: "invite.created",
    target: email,
  });

  revalidatePath("/admin/team");
  return { success: `Invitation envoyée à ${email}.` };
}

export async function submitInviteSignupAction(_prevState: unknown, formData: FormData) {
  const ip = await getRequestIp();
  if (await isInviteIpRateLimited(ip)) {
    return { error: "Trop de demandes. Réessayez dans quelques minutes." };
  }

  const token = String(formData.get("token") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim().slice(0, 100);
  const lastName = String(formData.get("lastName") ?? "").trim().slice(0, 100);
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!firstName || !lastName) {
    return { error: "Nom et prénom sont requis." };
  }
  const pwdError = validatePasswordStrength(password);
  if (pwdError) return { error: pwdError };
  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const invite = await findInviteByTokenHash(sha256Hex(token));
  if (!invite || invite.status !== "pending" || new Date(invite.expires_at) < new Date()) {
    return { error: "Cette invitation n'est plus valide." };
  }
  if (await findUserByEmail(invite.email)) {
    return { error: "Un compte existe déjà pour cette adresse." };
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
  const ip = await getRequestIp();
  if (await isInviteIpRateLimited(ip)) {
    return { error: "Trop de demandes. Réessayez dans quelques minutes." };
  }

  const invite = await findInviteByTokenHash(sha256Hex(token));
  if (!invite || invite.status !== "otp_sent") return { error: "Invitation invalide." };
  if (new Date(invite.expires_at) < new Date()) {
    return { error: "Cette invitation a expiré." };
  }
  if (invite.resend_count >= OTP_MAX_RESENDS) {
    return {
      error: "Nombre maximal de renvois atteint. Demandez une nouvelle invitation.",
    };
  }

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
  const ip = await getRequestIp();
  if (await isInviteIpRateLimited(ip)) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const token = String(formData.get("token") ?? "");
  const code = String(formData.get("code") ?? "").trim();

  const invite = await findInviteByTokenHash(sha256Hex(token));
  if (!invite || invite.status !== "otp_sent") {
    return { error: "Invitation invalide ou déjà utilisée." };
  }
  // L'expiration de l'invitation elle-même (48 h) prime : sans cette
  // vérification, un renvoi d'OTP prolongerait indéfiniment le lien.
  if (new Date(invite.expires_at) < new Date()) {
    return { error: "Cette invitation a expiré. Demandez-en une nouvelle." };
  }
  if (!invite.otp_hash || !invite.otp_expires_at || new Date(invite.otp_expires_at) < new Date()) {
    return { error: "Code expiré — demandez-en un nouveau." };
  }
  if (invite.otp_attempts >= OTP_MAX_ATTEMPTS) {
    return { error: "Trop de tentatives — demandez un nouveau code." };
  }
  if (!/^\d{6}$/.test(code)) {
    return { error: "Le code doit contenir 6 chiffres." };
  }

  if (!timingSafeEqualHex(sha256Hex(code), invite.otp_hash)) {
    await incrementInviteOtpAttempts(sha256Hex(token));
    return { error: "Code incorrect." };
  }

  const user = await acceptInvite({
    tokenHash: sha256Hex(token),
    email: invite.email,
    firstName: invite.first_name ?? "",
    lastName: invite.last_name ?? "",
    passwordHash: invite.password_hash ?? "",
  });

  await logAdminActivity({
    userId: user.id,
    action: "auth.invite_accepted",
    target: invite.email,
  });

  await createSession(user.id);
  redirect("/admin");
}

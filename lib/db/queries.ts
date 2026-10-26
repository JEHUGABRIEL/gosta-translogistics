import "server-only";

import { getDb } from "./client";

export type AdminUserRow = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  email_verified_at: string | null;
  created_at: string;
  last_login_at: string | null;
};

export type AdminInvite = {
  id: number;
  email: string;
  invited_by: number | null;
  token_hash: string;
  status: "pending" | "otp_sent" | "accepted" | "expired";
  first_name: string | null;
  last_name: string | null;
  password_hash: string | null;
  otp_hash: string | null;
  otp_expires_at: string | null;
  otp_attempts: number;
  resend_count: number;
  last_sent_at: string | null;
  expires_at: string;
  created_at: string;
};

export type QuoteRequest = {
  id: number;
  name: string;
  phone: string;
  service: string | null;
  message: string | null;
  status: "new" | "contacted" | "done";
  created_at: string;
};

export type Testimonial = {
  id: number;
  role_fr: string;
  role_en: string;
  context_fr: string;
  context_en: string;
  quote_fr: string;
  quote_en: string;
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type NewsPost = {
  id: number;
  title_fr: string;
  title_en: string;
  date_label_fr: string;
  date_label_en: string;
  content_fr: string | null;
  content_en: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type Faq = {
  id: number;
  question_fr: string;
  question_en: string;
  answer_fr: string;
  answer_en: string;
  published: boolean;
  sort_order: number;
  created_at: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
};

export async function createQuoteRequest(input: {
  name: string;
  phone: string;
  service?: string;
  message?: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO quote_requests (name, phone, service, message)
    VALUES (${input.name}, ${input.phone}, ${input.service ?? null}, ${input.message ?? null})
  `;
}

export async function listQuoteRequests(): Promise<QuoteRequest[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, name, phone, service, message, status, created_at
    FROM quote_requests
    ORDER BY created_at DESC
  `;
  return rows as QuoteRequest[];
}

export async function updateQuoteRequestStatus(id: number, status: QuoteRequest["status"]) {
  const sql = getDb();
  await sql`UPDATE quote_requests SET status = ${status} WHERE id = ${id}`;
}

export async function deleteQuoteRequest(id: number) {
  const sql = getDb();
  await sql`DELETE FROM quote_requests WHERE id = ${id}`;
}

export async function listTestimonials(onlyPublished = false): Promise<Testimonial[]> {
  const sql = getDb();
  const rows = onlyPublished
    ? await sql`SELECT * FROM testimonials WHERE published = true ORDER BY sort_order ASC, created_at DESC`
    : await sql`SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC`;
  return rows as Testimonial[];
}

export async function createTestimonial(input: {
  role_fr: string;
  role_en: string;
  context_fr: string;
  context_en: string;
  quote_fr: string;
  quote_en: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO testimonials (role_fr, role_en, context_fr, context_en, quote_fr, quote_en)
    VALUES (${input.role_fr}, ${input.role_en}, ${input.context_fr}, ${input.context_en}, ${input.quote_fr}, ${input.quote_en})
  `;
}

export async function updateTestimonial(
  id: number,
  input: {
    role_fr: string;
    role_en: string;
    context_fr: string;
    context_en: string;
    quote_fr: string;
    quote_en: string;
  }
) {
  const sql = getDb();
  await sql`
    UPDATE testimonials
    SET role_fr = ${input.role_fr}, role_en = ${input.role_en},
        context_fr = ${input.context_fr}, context_en = ${input.context_en},
        quote_fr = ${input.quote_fr}, quote_en = ${input.quote_en}
    WHERE id = ${id}
  `;
}

export async function setTestimonialPublished(id: number, published: boolean) {
  const sql = getDb();
  await sql`UPDATE testimonials SET published = ${published} WHERE id = ${id}`;
}

export async function deleteTestimonial(id: number) {
  const sql = getDb();
  await sql`DELETE FROM testimonials WHERE id = ${id}`;
}

export async function listNewsPosts(onlyPublished = false): Promise<NewsPost[]> {
  const sql = getDb();
  const rows = onlyPublished
    ? await sql`SELECT * FROM news_posts WHERE published = true ORDER BY sort_order ASC, created_at DESC`
    : await sql`SELECT * FROM news_posts ORDER BY sort_order ASC, created_at DESC`;
  return rows as NewsPost[];
}

export async function createNewsPost(input: {
  title_fr: string;
  title_en: string;
  date_label_fr: string;
  date_label_en: string;
  content_fr?: string;
  content_en?: string;
  image_url?: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO news_posts (title_fr, title_en, date_label_fr, date_label_en, content_fr, content_en, image_url)
    VALUES (${input.title_fr}, ${input.title_en}, ${input.date_label_fr}, ${input.date_label_en}, ${input.content_fr ?? null}, ${input.content_en ?? null}, ${input.image_url ?? null})
  `;
}

export async function updateNewsPost(
  id: number,
  input: {
    title_fr: string;
    title_en: string;
    date_label_fr: string;
    date_label_en: string;
    content_fr?: string;
    content_en?: string;
    image_url?: string;
  }
) {
  const sql = getDb();
  await sql`
    UPDATE news_posts
    SET title_fr = ${input.title_fr}, title_en = ${input.title_en},
        date_label_fr = ${input.date_label_fr}, date_label_en = ${input.date_label_en},
        content_fr = ${input.content_fr ?? null}, content_en = ${input.content_en ?? null},
        image_url = ${input.image_url ?? null}
    WHERE id = ${id}
  `;
}

export async function setNewsPostPublished(id: number, published: boolean) {
  const sql = getDb();
  await sql`UPDATE news_posts SET published = ${published} WHERE id = ${id}`;
}

export async function deleteNewsPost(id: number) {
  const sql = getDb();
  await sql`DELETE FROM news_posts WHERE id = ${id}`;
}

// ---------- FAQ ----------

export async function listFaqs(onlyPublished = false): Promise<Faq[]> {
  const sql = getDb();
  const rows = onlyPublished
    ? await sql`SELECT * FROM faqs WHERE published = true ORDER BY sort_order ASC, created_at ASC`
    : await sql`SELECT * FROM faqs ORDER BY sort_order ASC, created_at ASC`;
  return rows as Faq[];
}

export async function createFaq(input: {
  question_fr: string;
  question_en: string;
  answer_fr: string;
  answer_en: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO faqs (question_fr, question_en, answer_fr, answer_en)
    VALUES (${input.question_fr}, ${input.question_en}, ${input.answer_fr}, ${input.answer_en})
  `;
}

export async function updateFaq(
  id: number,
  input: {
    question_fr: string;
    question_en: string;
    answer_fr: string;
    answer_en: string;
  }
) {
  const sql = getDb();
  await sql`
    UPDATE faqs
    SET question_fr = ${input.question_fr}, question_en = ${input.question_en},
        answer_fr = ${input.answer_fr}, answer_en = ${input.answer_en}
    WHERE id = ${id}
  `;
}

export async function setFaqPublished(id: number, published: boolean) {
  const sql = getDb();
  await sql`UPDATE faqs SET published = ${published} WHERE id = ${id}`;
}

export async function deleteFaq(id: number) {
  const sql = getDb();
  await sql`DELETE FROM faqs WHERE id = ${id}`;
}

// ---------- Messages de contact ----------

export async function createContactMessage(input: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO contact_messages (name, email, phone, message)
    VALUES (${input.name}, ${input.email ?? null}, ${input.phone ?? null}, ${input.message})
  `;
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, name, email, phone, message, status, created_at
    FROM contact_messages
    ORDER BY created_at DESC
  `;
  return rows as ContactMessage[];
}

export async function updateContactMessageStatus(
  id: number,
  status: ContactMessage["status"]
) {
  const sql = getDb();
  await sql`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`;
}

export async function deleteContactMessage(id: number) {
  const sql = getDb();
  await sql`DELETE FROM contact_messages WHERE id = ${id}`;
}

// ---------- Double authentification (TOTP) ----------

export async function getAdminMfaState(userId: number) {
  const sql = getDb();
  const rows = await sql`
    SELECT mfa_secret, mfa_enabled FROM admin_users WHERE id = ${userId}
  `;
  return rows[0] as { mfa_secret: string | null; mfa_enabled: boolean } | undefined;
}

export async function setAdminMfaSecret(userId: number, secret: string | null) {
  const sql = getDb();
  await sql`UPDATE admin_users SET mfa_secret = ${secret} WHERE id = ${userId}`;
}

export async function enableAdminMfa(userId: number) {
  const sql = getDb();
  await sql`UPDATE admin_users SET mfa_enabled = true WHERE id = ${userId}`;
}

export async function disableAdminMfa(userId: number) {
  const sql = getDb();
  await sql`
    UPDATE admin_users SET mfa_enabled = false, mfa_secret = NULL WHERE id = ${userId}
  `;
}

export type MfaChallenge = {
  id: number;
  user_id: number;
  attempts: number;
  expires_at: string;
};

export async function createMfaChallenge(input: {
  userId: number;
  tokenHash: string;
  expiresAt: string;
}) {
  const sql = getDb();
  // Entretien : les défis expirés ne servent plus à rien.
  await sql`DELETE FROM admin_mfa_challenges WHERE expires_at < now()`;
  await sql`
    INSERT INTO admin_mfa_challenges (user_id, token_hash, expires_at)
    VALUES (${input.userId}, ${input.tokenHash}, ${input.expiresAt})
  `;
}

export async function findMfaChallenge(tokenHash: string): Promise<MfaChallenge | undefined> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, user_id, attempts, expires_at
    FROM admin_mfa_challenges
    WHERE token_hash = ${tokenHash} AND expires_at > now()
  `;
  return rows[0] as MfaChallenge | undefined;
}

export async function incrementMfaChallengeAttempts(id: number) {
  const sql = getDb();
  await sql`UPDATE admin_mfa_challenges SET attempts = attempts + 1 WHERE id = ${id}`;
}

export async function deleteMfaChallenge(id: number) {
  const sql = getDb();
  await sql`DELETE FROM admin_mfa_challenges WHERE id = ${id}`;
}

export async function deleteMfaChallengesForUser(userId: number) {
  const sql = getDb();
  await sql`DELETE FROM admin_mfa_challenges WHERE user_id = ${userId}`;
}

// ---------- Sessions ----------

export type SessionRow = {
  id: number;
  token_hash: string;
  created_at: string;
  expires_at: string;
};

export async function deleteExpiredSessions() {
  const sql = getDb();
  await sql`DELETE FROM sessions WHERE expires_at < now()`;
}

export async function listSessionsForUser(userId: number): Promise<SessionRow[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, token_hash, created_at, expires_at
    FROM sessions
    WHERE user_id = ${userId} AND expires_at > now()
    ORDER BY created_at DESC
  `;
  return rows as SessionRow[];
}

export async function deleteSessionById(id: number, userId: number) {
  const sql = getDb();
  await sql`DELETE FROM sessions WHERE id = ${id} AND user_id = ${userId}`;
}

export async function deleteSessionsForUser(userId: number) {
  const sql = getDb();
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
}

export async function updateAdminPassword(userId: number, passwordHash: string) {
  const sql = getDb();
  await sql`UPDATE admin_users SET password_hash = ${passwordHash} WHERE id = ${userId}`;
}

/** Met à jour l'identité affichée de l'admin (prénom / nom). */
export async function updateAdminProfile(
  userId: number,
  firstName: string | null,
  lastName: string | null
) {
  const sql = getDb();
  await sql`
    UPDATE admin_users SET first_name = ${firstName}, last_name = ${lastName}
    WHERE id = ${userId}
  `;
}

// ---------- Journal d'activité ----------

export type ActivityRow = {
  id: number;
  action: string;
  target: string | null;
  created_at: string;
  email: string | null;
};

export async function logAdminActivity(input: {
  userId: number | null;
  action: string;
  target?: string | null;
}) {
  const sql = getDb();
  // Le journal est best-effort : une panne d'écriture ne doit pas faire
  // échouer la mutation elle-même (ni bloquer la connexion avant migration).
  try {
    await sql`
      INSERT INTO admin_activity (user_id, action, target)
      VALUES (${input.userId}, ${input.action}, ${input.target ?? null})
    `;
  } catch (error) {
    console.error("[admin-activity] écriture impossible", error);
  }
}

export async function listRecentActivity(limit = 20): Promise<ActivityRow[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT a.id, a.action, a.target, a.created_at, u.email
    FROM admin_activity a
    LEFT JOIN admin_users u ON u.id = a.user_id
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `;
  return rows as ActivityRow[];
}

export type ActivityFilters = {
  /** Recherche libre (action, cible ou email de l'auteur). */
  q?: string;
  /** Code d'action exact, pour le filtre de la page. */
  action?: string;
};

/** Échappe les jokers ILIKE saisis par l'utilisateur. */
function likePattern(value: string) {
  return `%${value.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}

function activityWhere(filters: ActivityFilters) {
  return {
    q: (filters.q ?? "").trim(),
    action: (filters.action ?? "").trim(),
  };
}

/**
 * Journal d'activité paginé (page /admin/activity) : recherche + filtre par
 * action, compté en SQL pour que la pagination serveur reste juste.
 */
export async function searchActivity(
  filters: ActivityFilters,
  limit: number,
  offset: number
): Promise<{ rows: ActivityRow[]; total: number }> {
  const sql = getDb();
  const { q, action } = activityWhere(filters);

  // L'expression de recherche est écrite en dur dans le template (une valeur
  // interpolée deviendrait un paramètre lieur) ; seuls le motif et le filtre
  // d'action sont paramétrés. `COALESCE` évite qu'un email manquant (compte
  // supprimé) fasse sortir la ligne de la recherche.
  const rows = await sql`
    SELECT a.id, a.action, a.target, a.created_at, u.email
    FROM admin_activity a
    LEFT JOIN admin_users u ON u.id = a.user_id
    WHERE COALESCE(a.action, '') || ' ' || COALESCE(a.target, '') || ' ' || COALESCE(u.email, '')
          ILIKE ${likePattern(q)}
      AND (${action} = '' OR a.action = ${action})
    ORDER BY a.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  const count = await sql`
    SELECT count(*)::int AS total
    FROM admin_activity a
    LEFT JOIN admin_users u ON u.id = a.user_id
    WHERE COALESCE(a.action, '') || ' ' || COALESCE(a.target, '') || ' ' || COALESCE(u.email, '')
          ILIKE ${likePattern(q)}
      AND (${action} = '' OR a.action = ${action})
  `;

  return {
    rows: rows as ActivityRow[],
    total: (count[0] as { total: number } | undefined)?.total ?? 0,
  };
}

/**
 * Purge intégrale du journal (« réinitialiser le journal » depuis le
 * dashboard). L'entrée qui trace l'effacement est écrite après l'appel,
 * dans `resetActivityAction`.
 */
export async function resetAdminActivity() {
  const sql = getDb();
  await sql`DELETE FROM admin_activity`;
}

// ---------- Limitation de débit (état partagé en base) ----------

/**
 * Incrémente le compteur de `key` sur une fenêtre glissante.
 * Retourne le nombre de coups déjà enregistrés dans la fenêtre courante.
 * Le verrou éventuel est remis à zéro : il est reposé explicitement par
 * `lockRateLimit` quand le seuil est atteint.
 */
export async function hitRateLimit(key: string, windowSeconds: number) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO rate_limits (key, count, window_start, locked_until, updated_at)
    VALUES (${key}, 1, now(), NULL, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limits.locked_until IS NOT NULL AND rate_limits.locked_until <= now() THEN 1
        WHEN rate_limits.window_start <= now() - make_interval(secs => ${windowSeconds}::double precision) THEN 1
        ELSE rate_limits.count + 1
      END,
      window_start = CASE
        WHEN (rate_limits.locked_until IS NOT NULL AND rate_limits.locked_until <= now())
          OR rate_limits.window_start <= now() - make_interval(secs => ${windowSeconds}::double precision)
          THEN now()
        ELSE rate_limits.window_start
      END,
      locked_until = NULL,
      updated_at = now()
    RETURNING count
  `;
  return (rows[0] as { count: number }).count;
}

export async function lockRateLimit(key: string, lockSeconds: number) {
  const sql = getDb();
  await sql`
    UPDATE rate_limits
    SET locked_until = now() + make_interval(secs => ${lockSeconds}::double precision),
        updated_at = now()
    WHERE key = ${key}
  `;
}

export async function getRateLimitRow(
  key: string
): Promise<{ count: number; locked_until: string | null } | undefined> {
  const sql = getDb();
  const rows = await sql`
    SELECT count, locked_until FROM rate_limits WHERE key = ${key}
  `;
  return rows[0] as { count: number; locked_until: string | null } | undefined;
}

export async function clearRateLimits(keys: string[]) {
  const sql = getDb();
  // Une suppression par clé plutôt qu'un tableau en paramètre : on ne dépend
  // pas de la sérialisation des arrays JS par le driver HTTP.
  for (const key of keys) {
    await sql`DELETE FROM rate_limits WHERE key = ${key}`;
  }
}

/**
 * Purge les compteurs inactifs. Sans ça, la table grossirait indéfiniment au
 * rythme des adresses email essayées sur le formulaire de connexion.
 */
export async function purgeStaleRateLimits() {
  const sql = getDb();
  await sql`DELETE FROM rate_limits WHERE updated_at < now() - interval '1 day'`;
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, email, first_name, last_name, email_verified_at, created_at, last_login_at
    FROM admin_users
    ORDER BY created_at ASC
  `;
  return rows as AdminUserRow[];
}

export async function createInvite(input: {
  email: string;
  invitedBy: number;
  tokenHash: string;
  expiresAt: string;
}) {
  const sql = getDb();
  await sql`
    INSERT INTO admin_invites (email, invited_by, token_hash, expires_at)
    VALUES (${input.email}, ${input.invitedBy}, ${input.tokenHash}, ${input.expiresAt})
  `;
}

export async function listPendingInvites(): Promise<AdminInvite[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM admin_invites
    WHERE status IN ('pending', 'otp_sent') AND expires_at > now()
    ORDER BY created_at DESC
  `;
  return rows as AdminInvite[];
}

export async function findInviteByTokenHash(tokenHash: string): Promise<AdminInvite | undefined> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM admin_invites WHERE token_hash = ${tokenHash}`;
  return rows[0] as AdminInvite | undefined;
}

export async function setInviteSignup(input: {
  tokenHash: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  otpHash: string;
  otpExpiresAt: string;
}) {
  const sql = getDb();
  await sql`
    UPDATE admin_invites
    SET first_name = ${input.firstName}, last_name = ${input.lastName},
        password_hash = ${input.passwordHash}, otp_hash = ${input.otpHash},
        otp_expires_at = ${input.otpExpiresAt}, otp_attempts = 0,
        resend_count = 0, last_sent_at = now(), status = 'otp_sent'
    WHERE token_hash = ${input.tokenHash}
  `;
}

export async function refreshInviteOtp(input: {
  tokenHash: string;
  otpHash: string;
  otpExpiresAt: string;
}) {
  const sql = getDb();
  // resend_count journalise les renvois : sans plafond, l'endpoint de renvoi
  // permettrait un envoi d'emails illimité et une remise à zéro permanente
  // des tentatives (chaque nouveau code repart à 5 essais).
  await sql`
    UPDATE admin_invites
    SET otp_hash = ${input.otpHash}, otp_expires_at = ${input.otpExpiresAt},
        otp_attempts = 0, resend_count = resend_count + 1, last_sent_at = now()
    WHERE token_hash = ${input.tokenHash}
  `;
}

export async function incrementInviteOtpAttempts(tokenHash: string) {
  const sql = getDb();
  await sql`UPDATE admin_invites SET otp_attempts = otp_attempts + 1 WHERE token_hash = ${tokenHash}`;
}

export async function acceptInvite(input: {
  tokenHash: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}): Promise<{ id: number; email: string }> {
  const sql = getDb();
  const rows = await sql`
    WITH new_user AS (
      INSERT INTO admin_users (email, first_name, last_name, password_hash, email_verified_at)
      VALUES (${input.email}, ${input.firstName}, ${input.lastName}, ${input.passwordHash}, now())
      RETURNING id, email
    ), mark_invite AS (
      UPDATE admin_invites SET status = 'accepted' WHERE token_hash = ${input.tokenHash}
    )
    SELECT id, email FROM new_user
  `;
  return rows[0] as { id: number; email: string };
}

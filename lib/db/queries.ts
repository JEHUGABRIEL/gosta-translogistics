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
  published: boolean;
  sort_order: number;
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
}) {
  const sql = getDb();
  await sql`
    INSERT INTO news_posts (title_fr, title_en, date_label_fr, date_label_en, content_fr, content_en)
    VALUES (${input.title_fr}, ${input.title_en}, ${input.date_label_fr}, ${input.date_label_en}, ${input.content_fr ?? null}, ${input.content_en ?? null})
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
  }
) {
  const sql = getDb();
  await sql`
    UPDATE news_posts
    SET title_fr = ${input.title_fr}, title_en = ${input.title_en},
        date_label_fr = ${input.date_label_fr}, date_label_en = ${input.date_label_en},
        content_fr = ${input.content_fr ?? null}, content_en = ${input.content_en ?? null}
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
        otp_expires_at = ${input.otpExpiresAt}, otp_attempts = 0, status = 'otp_sent'
    WHERE token_hash = ${input.tokenHash}
  `;
}

export async function refreshInviteOtp(input: {
  tokenHash: string;
  otpHash: string;
  otpExpiresAt: string;
}) {
  const sql = getDb();
  await sql`
    UPDATE admin_invites
    SET otp_hash = ${input.otpHash}, otp_expires_at = ${input.otpExpiresAt}, otp_attempts = 0
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

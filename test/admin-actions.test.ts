import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminInvite } from "@/lib/db/queries";

// ---------------------------------------------------------------------------
// Mocks : les Server Actions exigent un contexte de requête Next, on les
// appelle donc directement avec `cookies()`/`headers()` simulés et
// `redirect()` remplacé par une exception sentinelle (comme le vrai framework).
// ---------------------------------------------------------------------------

class RedirectError extends Error {
  constructor(readonly url: string) {
    super(`NEXT_REDIRECT:${url}`);
  }
}

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new RedirectError(url);
  },
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
    set: vi.fn(),
    delete: vi.fn(),
    has: () => false,
  }),
  headers: async () => new Headers(),
}));

vi.mock("@/lib/request-ip", () => ({
  getRequestIp: async () => "203.0.113.7",
  getClientIpFromHeaders: () => "203.0.113.7",
  getClientIpFromRequest: () => "203.0.113.7",
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(async () => ({ id: "email" })),
  inviteEmailHtml: () => "<html></html>",
  otpEmailHtml: () => "<html></html>",
}));

vi.mock("@/lib/seo", () => ({
  SITE_URL: "https://test.local",
  COMPANY: {},
  pageMetadata: vi.fn(),
  getAlternates: vi.fn(),
  localizedPath: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  isLoginIpRateLimited: vi.fn(async () => false),
  isInviteIpRateLimited: vi.fn(async () => false),
  isRateLimited: vi.fn(async () => false),
  loginLockRemaining: vi.fn(async () => 0),
  registerLoginFailure: vi.fn(async () => ({ locked: false })),
  clearLoginFailures: vi.fn(async () => {}),
}));

vi.mock("@/lib/db/queries", () => {
  const fn = () => vi.fn();
  return {
    // devis
    createQuoteRequest: fn(),
    listQuoteRequests: fn(),
    updateQuoteRequestStatus: fn(),
    deleteQuoteRequest: fn(),
    // témoignages
    listTestimonials: fn(),
    createTestimonial: fn(),
    updateTestimonial: fn(),
    setTestimonialPublished: fn(),
    deleteTestimonial: fn(),
    // actualités
    listNewsPosts: fn(),
    createNewsPost: fn(),
    updateNewsPost: fn(),
    setNewsPostPublished: fn(),
    deleteNewsPost: fn(),
    // équipe / invitations
    listAdminUsers: fn(),
    createInvite: fn(),
    listPendingInvites: fn(),
    findInviteByTokenHash: fn(),
    setInviteSignup: fn(),
    refreshInviteOtp: fn(),
    incrementInviteOtpAttempts: fn(),
    acceptInvite: fn(),
    // FAQ
    listFaqs: fn(),
    createFaq: fn(),
    updateFaq: fn(),
    setFaqPublished: fn(),
    deleteFaq: fn(),
    // messages de contact
    createContactMessage: fn(),
    listContactMessages: fn(),
    updateContactMessageStatus: fn(),
    deleteContactMessage: fn(),
    // double authentification
    getAdminMfaState: fn(),
    setAdminMfaSecret: fn(),
    enableAdminMfa: fn(),
    disableAdminMfa: fn(),
    createMfaChallenge: fn(),
    findMfaChallenge: fn(),
    incrementMfaChallengeAttempts: fn(),
    deleteMfaChallenge: fn(),
    deleteMfaChallengesForUser: fn(),
    // sessions / compte
    deleteExpiredSessions: fn(),
    listSessionsForUser: fn(),
    deleteSessionById: fn(),
    deleteSessionsForUser: fn(),
    updateAdminPassword: fn(),
    updateAdminProfile: fn(),
    logAdminActivity: fn(),
    listRecentActivity: fn(),
    searchActivity: fn(),
    resetAdminActivity: fn(),
    // limiteur (non exercé ici : voir test/rate-limit.test.ts)
    hitRateLimit: fn(),
    lockRateLimit: fn(),
    getRateLimitRow: fn(),
    clearRateLimits: fn(),
    purgeStaleRateLimits: fn(),
  };
});

vi.mock("@/lib/mfa", () => ({
  startMfaChallenge: vi.fn(async () => {}),
  verifyTotp: vi.fn(() => true),
  readMfaChallengeToken: vi.fn(async () => null),
  clearMfaChallengeCookie: vi.fn(async () => {}),
  generateTotpSecret: vi.fn(() => "JBSWY3DPEHPK3PXP"),
  buildTotpUri: vi.fn(() => "otpauth://totp/test"),
  MFA_MAX_ATTEMPTS: 5,
}));

vi.mock("@/lib/admin-auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin-auth")>();
  return {
    ...actual,
    getSessionUser: vi.fn(async () => null),
    findUserByEmail: vi.fn(async () => undefined),
    createSession: vi.fn(async () => {}),
    destroySession: vi.fn(async () => {}),
    touchLastLogin: vi.fn(async () => {}),
    verifyAgainstDummyHash: vi.fn(async () => false),
  };
});

import * as actions from "@/app/admin/actions";
import * as queries from "@/lib/db/queries";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  findUserByEmail,
  getSessionUser,
  hashPassword,
  sha256Hex,
  verifyAgainstDummyHash,
} from "@/lib/admin-auth";
import { sendEmail } from "@/lib/email";
import { readMfaChallengeToken, startMfaChallenge, verifyTotp } from "@/lib/mfa";
import {
  clearLoginFailures,
  isLoginIpRateLimited,
  loginLockRemaining,
  registerLoginFailure,
} from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ADMIN = {
  id: 42,
  email: "admin@test.local",
  first_name: "Ada",
  last_name: "Lovelace",
};

const form = (values: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
};

const makeInvite = (overrides: Partial<AdminInvite> = {}): AdminInvite => ({
  id: 1,
  email: "invite@test.local",
  invited_by: ADMIN.id,
  token_hash: "token-hash",
  status: "otp_sent",
  first_name: "Ada",
  last_name: "Lovelace",
  password_hash: "password-hash",
  otp_hash: "0".repeat(64),
  otp_expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
  otp_attempts: 0,
  resend_count: 0,
  last_sent_at: null,
  expires_at: new Date(Date.now() + 60 * 60_000).toISOString(),
  created_at: new Date().toISOString(),
  ...overrides,
});

/** Toutes les fonctions de `queries` qui écrivent. */
const WRITE_QUERIES = [
  queries.updateQuoteRequestStatus,
  queries.deleteQuoteRequest,
  queries.createTestimonial,
  queries.updateTestimonial,
  queries.setTestimonialPublished,
  queries.deleteTestimonial,
  queries.createNewsPost,
  queries.updateNewsPost,
  queries.setNewsPostPublished,
  queries.deleteNewsPost,
  queries.createInvite,
  queries.setInviteSignup,
  queries.refreshInviteOtp,
  queries.incrementInviteOtpAttempts,
  queries.acceptInvite,
  queries.deleteSessionById,
  queries.deleteSessionsForUser,
  queries.updateAdminPassword,
  queries.updateAdminProfile,
  queries.resetAdminActivity,
  queries.createFaq,
  queries.updateFaq,
  queries.setFaqPublished,
  queries.deleteFaq,
  queries.updateContactMessageStatus,
  queries.deleteContactMessage,
  queries.setAdminMfaSecret,
  queries.enableAdminMfa,
  queries.disableAdminMfa,
  sendEmail,
];

function expectNoWrite() {
  for (const query of WRITE_QUERIES) {
    expect(query).not.toHaveBeenCalled();
  }
}

async function expectRedirectTo(fn: () => Promise<unknown>, url = "/admin/login") {
  try {
    await fn();
  } catch (error) {
    expect(error).toBeInstanceOf(RedirectError);
    expect((error as RedirectError).url).toBe(url);
    return;
  }
  throw new Error(`Aucune redirection levée (attendu : ${url})`);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getSessionUser).mockResolvedValue(ADMIN);
  vi.mocked(findUserByEmail).mockResolvedValue(undefined);
  vi.mocked(loginLockRemaining).mockResolvedValue(0);
  vi.mocked(isLoginIpRateLimited).mockResolvedValue(false);
  vi.mocked(registerLoginFailure).mockResolvedValue({ locked: false });
});

// ---------------------------------------------------------------------------
// Autorisation
// ---------------------------------------------------------------------------

describe("autorisation des Server Actions", () => {
  const testimonialForm = () =>
    form({
      role_fr: "Client",
      role_en: "Client",
      context_fr: "Bangui",
      context_en: "Bangui",
      quote_fr: "Très bien",
      quote_en: "Very good",
    });

  const newsForm = () =>
    form({
      title_fr: "Titre",
      title_en: "Title",
      date_label_fr: "Août 2026",
      date_label_en: "August 2026",
    });

  const protectedCalls: Array<[string, () => Promise<unknown>]> = [
    ["updateQuoteStatusAction", () => actions.updateQuoteStatusAction(1, "done")],
    ["deleteQuoteAction", () => actions.deleteQuoteAction(1)],
    ["createTestimonialAction", () => actions.createTestimonialAction(testimonialForm())],
    ["updateTestimonialAction", () => actions.updateTestimonialAction(1, testimonialForm())],
    ["toggleTestimonialAction", () => actions.toggleTestimonialAction(1, false)],
    ["deleteTestimonialAction", () => actions.deleteTestimonialAction(1)],
    ["createNewsPostAction", () => actions.createNewsPostAction(newsForm())],
    ["updateNewsPostAction", () => actions.updateNewsPostAction(1, newsForm())],
    ["toggleNewsPostAction", () => actions.toggleNewsPostAction(1, false)],
    ["deleteNewsPostAction", () => actions.deleteNewsPostAction(1)],
    ["revokeSessionAction", () => actions.revokeSessionAction(1)],
  ];

  it.each(protectedCalls)("%s redirige sans session et ne mute rien", async (_name, call) => {
    vi.mocked(getSessionUser).mockResolvedValue(null);

    await expectRedirectTo(call);
    expectNoWrite();
  });

  it("requireAdmin renvoie l'admin courant quand la session existe", async () => {
    await expect(actions.requireAdmin()).resolves.toEqual(ADMIN);
  });

  it("revokeSessionAction ne vise que les sessions de l'admin courant", async () => {
    await actions.revokeSessionAction(7);

    // (id de session, id de l'admin) : un id d'autrui ne peut pas matcher.
    expect(queries.deleteSessionById).toHaveBeenCalledWith(7, ADMIN.id);
    expect(queries.logAdminActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "session.revoked", userId: ADMIN.id })
    );
  });

  it("revokeSessionAction refuse un identifiant non entier", async () => {
    await expect(actions.revokeSessionAction(1.5)).rejects.toThrow("Session invalide.");
    expect(queries.deleteSessionById).not.toHaveBeenCalled();
  });

  it("logoutAction détruit la session", async () => {
    await expectRedirectTo(() => actions.logoutAction(), "/admin/login");
    expect(destroySession).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Changement de mot de passe et révocation de sessions
// ---------------------------------------------------------------------------

describe("changePasswordAction", () => {
  it("refuse un mot de passe actuel incorrect sans rien modifier", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
      id: ADMIN.id,
      email: ADMIN.email,
      password_hash: await hashPassword("AncienMdp1"),
    });

    const result = await actions.changePasswordAction(
      null,
      form({ currentPassword: "MauvaisMdp1", newPassword: "NouveauMdp1" })
    );

    expect(result).toEqual({ error: "Mot de passe actuel incorrect." });
    expect(queries.updateAdminPassword).not.toHaveBeenCalled();
    expect(queries.deleteSessionsForUser).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it("met à jour, révoque toutes les sessions et en rouvre une", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
      id: ADMIN.id,
      email: ADMIN.email,
      password_hash: await hashPassword("AncienMdp1"),
    });

    const result = await actions.changePasswordAction(
      null,
      form({ currentPassword: "AncienMdp1", newPassword: "NouveauMdp1" })
    );

    expect(result).toMatchObject({ success: expect.stringContaining("mis à jour") });
    expect(queries.updateAdminPassword).toHaveBeenCalledTimes(1);
    // Le point clé : un cookie volé cesse de fonctionner après le changement.
    expect(queries.deleteSessionsForUser).toHaveBeenCalledWith(ADMIN.id);
    expect(createSession).toHaveBeenCalledWith(ADMIN.id);
    expect(queries.logAdminActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "auth.password_changed" })
    );
  });

  it("refuse un mot de passe trop court ou trop long", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
      id: ADMIN.id,
      email: ADMIN.email,
      password_hash: await hashPassword("AncienMdp1"),
    });

    const tooShort = await actions.changePasswordAction(
      null,
      form({ currentPassword: "AncienMdp1", newPassword: "Court1" })
    );
    expect(tooShort.error).toMatch(/8 caractères/);

    const tooLong = await actions.changePasswordAction(
      null,
      form({ currentPassword: "AncienMdp1", newPassword: `Aa1${"x".repeat(200)}` })
    );
    expect(tooLong.error).toMatch(/128 caractères/);

    expect(queries.updateAdminPassword).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Connexion et verrouillage
// ---------------------------------------------------------------------------

describe("loginAction", () => {
  it("renvoie un message générique pour un email inconnu", async () => {
    const result = await actions.loginAction(
      null,
      form({ email: "inconnu@test.local", password: "PeuImporte1" })
    );

    expect(result).toEqual({ error: "Email ou mot de passe incorrect." });
    // Un scrypt de coût équivalent est exécuté : pas d'oracle de temps.
    expect(verifyAgainstDummyHash).toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it("ne vérifie même pas le mot de passe quand le compte est verrouillé", async () => {
    vi.mocked(loginLockRemaining).mockResolvedValue(120);

    const result = await actions.loginAction(
      null,
      form({ email: ADMIN.email, password: "PeuImporte1" })
    );

    expect(result).toEqual({
      error: "Trop de tentatives. Réessayez dans 2 minutes.",
    });
    expect(findUserByEmail).not.toHaveBeenCalled();
  });

  it("bloque quand le quota de tentatives par IP est atteint", async () => {
    vi.mocked(isLoginIpRateLimited).mockResolvedValue(true);

    const result = await actions.loginAction(
      null,
      form({ email: ADMIN.email, password: "PeuImporte1" })
    );

    expect(result.error).toMatch(/Trop de tentatives/);
    expect(findUserByEmail).not.toHaveBeenCalled();
  });

  it("compte l'échec et reste générique", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
      id: ADMIN.id,
      email: ADMIN.email,
      password_hash: await hashPassword("BonMdp123"),
    });

    const result = await actions.loginAction(
      null,
      form({ email: ADMIN.email, password: "MauvaisMdp1" })
    );

    expect(result).toEqual({ error: "Email ou mot de passe incorrect." });
    expect(registerLoginFailure).toHaveBeenCalledWith(ADMIN.email, "203.0.113.7");
    expect(createSession).not.toHaveBeenCalled();
  });

  it("annonce le blocage quand le seuil est franchi", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(undefined);
    vi.mocked(registerLoginFailure).mockResolvedValue({ locked: true });

    const result = await actions.loginAction(
      null,
      form({ email: ADMIN.email, password: "MauvaisMdp1" })
    );

    expect(result).toEqual({ error: "Trop de tentatives. Compte temporairement bloqué." });
  });

  it("ouvre la session et remet les compteurs à zéro", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
      id: ADMIN.id,
      email: ADMIN.email,
      password_hash: await hashPassword("BonMdp123"),
    });

    await expectRedirectTo(
      () =>
        actions.loginAction(
          null,
          form({ email: "  Admin@Test.local ", password: "BonMdp123" })
        ),
      "/admin"
    );

    expect(clearLoginFailures).toHaveBeenCalledWith(ADMIN.email, "203.0.113.7");
    expect(createSession).toHaveBeenCalledWith(ADMIN.id);
  });
});

// ---------------------------------------------------------------------------
// Double authentification
// ---------------------------------------------------------------------------

describe("double authentification", () => {
  const challenge = {
    id: 7,
    user_id: ADMIN.id,
    attempts: 0,
    expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
  };

  it("exige le code TOTP quand MFA est activée (pas de session)", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
      id: ADMIN.id,
      email: ADMIN.email,
      password_hash: await hashPassword("BonMdp123"),
    });
    vi.mocked(queries.getAdminMfaState).mockResolvedValue({
      mfa_secret: "SECRET",
      mfa_enabled: true,
    });

    await expectRedirectTo(
      () =>
        actions.loginAction(
          null,
          form({ email: ADMIN.email, password: "BonMdp123" })
        ),
      "/admin/login/verify"
    );

    expect(startMfaChallenge).toHaveBeenCalledWith(ADMIN.id);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("refuse un défi absent", async () => {
    const result = await actions.verifyMfaLoginAction(null, form({ code: "123456" }));

    expect(result).toEqual({ error: "Session expirée. Reconnectez-vous." });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("refuse un code incorrect et compte la tentative", async () => {
    vi.mocked(readMfaChallengeToken).mockResolvedValue("token");
    vi.mocked(queries.findMfaChallenge).mockResolvedValue(challenge);
    vi.mocked(queries.getAdminMfaState).mockResolvedValue({
      mfa_secret: "SECRET",
      mfa_enabled: true,
    });
    vi.mocked(verifyTotp).mockReturnValue(false);

    const result = await actions.verifyMfaLoginAction(null, form({ code: "000000" }));

    expect(result).toEqual({ error: "Code incorrect." });
    expect(queries.incrementMfaChallengeAttempts).toHaveBeenCalledWith(challenge.id);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("ferme le défi et ouvre la session quand le code est valide", async () => {
    vi.mocked(readMfaChallengeToken).mockResolvedValue("token");
    vi.mocked(queries.findMfaChallenge).mockResolvedValue(challenge);
    vi.mocked(queries.getAdminMfaState).mockResolvedValue({
      mfa_secret: "SECRET",
      mfa_enabled: true,
    });
    vi.mocked(verifyTotp).mockReturnValue(true);

    await expectRedirectTo(
      () => actions.verifyMfaLoginAction(null, form({ code: "123456" })),
      "/admin"
    );

    expect(queries.deleteMfaChallenge).toHaveBeenCalledWith(challenge.id);
    expect(createSession).toHaveBeenCalledWith(ADMIN.id);
  });

  it("exige une session pour enrôler un second facteur", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(null);

    await expectRedirectTo(() => actions.startMfaEnrollmentAction());
    expect(queries.setAdminMfaSecret).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Validation des entrées
// ---------------------------------------------------------------------------

describe("validation des entrées", () => {
  it("refuse un statut de devis hors énumération", async () => {
    await expect(
      actions.updateQuoteStatusAction(1, "hacked" as never)
    ).rejects.toThrow("Paramètres invalides.");
    expect(queries.updateQuoteRequestStatus).not.toHaveBeenCalled();
  });

  it("refuse un identifiant non entier", async () => {
    await expect(actions.deleteQuoteAction(Number.NaN)).rejects.toThrow(
      "Identifiant invalide."
    );
    await expect(actions.deleteNewsPostAction(2.5)).rejects.toThrow(
      "Identifiant invalide."
    );
    expectNoWrite();
  });

  it("refuse une valeur de publication non booléenne", async () => {
    await expect(
      actions.toggleTestimonialAction(1, "on" as never)
    ).rejects.toThrow("Paramètres invalides.");
    expect(queries.setTestimonialPublished).not.toHaveBeenCalled();
  });

  it("refuse un email d'invitation mal formé", async () => {
    const result = await actions.inviteAdminAction(
      null,
      form({ email: "pas-un-email" })
    );

    expect(result).toEqual({ error: "Email invalide." });
    expect(queries.createInvite).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Parcours d'invitation
// ---------------------------------------------------------------------------

describe("parcours d'invitation", () => {
  it("refuse un renvoi au-delà du quota", async () => {
    vi.mocked(queries.findInviteByTokenHash).mockResolvedValue(
      makeInvite({ resend_count: 5 })
    );

    const result = await actions.resendInviteOtpAction("token");

    expect(result.error).toMatch(/Nombre maximal de renvois/);
    expect(queries.refreshInviteOtp).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("refuse un renvoi sur une invitation expirée", async () => {
    vi.mocked(queries.findInviteByTokenHash).mockResolvedValue(
      makeInvite({ expires_at: new Date(Date.now() - 1000).toISOString() })
    );

    const result = await actions.resendInviteOtpAction("token");

    expect(result.error).toMatch(/expiré/);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("renvoie un nouveau code sous le quota", async () => {
    vi.mocked(queries.findInviteByTokenHash).mockResolvedValue(makeInvite());

    const result = await actions.resendInviteOtpAction("token");

    expect(result).toEqual({ success: "Nouveau code envoyé." });
    expect(queries.refreshInviteOtp).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("refuse la vérification d'une invitation expirée même avec un OTP valide", async () => {
    vi.mocked(queries.findInviteByTokenHash).mockResolvedValue(
      makeInvite({
        expires_at: new Date(Date.now() - 1000).toISOString(),
        otp_hash: sha256Hex("123456"),
      })
    );

    const result = await actions.verifyInviteOtpAction(
      null,
      form({ token: "token", code: "123456" })
    );

    expect(result.error).toMatch(/expiré/);
    expect(queries.acceptInvite).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it("refuse un code qui n'a pas 6 chiffres", async () => {
    vi.mocked(queries.findInviteByTokenHash).mockResolvedValue(makeInvite());

    const result = await actions.verifyInviteOtpAction(
      null,
      form({ token: "token", code: "12ab" })
    );

    expect(result.error).toMatch(/6 chiffres/);
    expect(queries.acceptInvite).not.toHaveBeenCalled();
  });

  it("compte une tentative sur code incorrect", async () => {
    vi.mocked(queries.findInviteByTokenHash).mockResolvedValue(
      makeInvite({ otp_hash: sha256Hex("123456") })
    );

    const result = await actions.verifyInviteOtpAction(
      null,
      form({ token: "token", code: "999999" })
    );

    expect(result).toEqual({ error: "Code incorrect." });
    expect(queries.incrementInviteOtpAttempts).toHaveBeenCalledWith(
      sha256Hex("token")
    );
    expect(queries.acceptInvite).not.toHaveBeenCalled();
  });

  it("accepte un code valide, journalise et ouvre la session", async () => {
    vi.mocked(queries.findInviteByTokenHash).mockResolvedValue(
      makeInvite({ otp_hash: sha256Hex("123456") })
    );
    vi.mocked(queries.acceptInvite).mockResolvedValue({
      id: 7,
      email: "invite@test.local",
    });

    await expectRedirectTo(
      () =>
        actions.verifyInviteOtpAction(null, form({ token: "token", code: "123456" })),
      "/admin"
    );

    expect(queries.acceptInvite).toHaveBeenCalledTimes(1);
    expect(queries.logAdminActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "auth.invite_accepted", userId: 7 })
    );
    expect(createSession).toHaveBeenCalledWith(7);
  });
});

// ---------------------------------------------------------------------------
// Profil administrateur
// ---------------------------------------------------------------------------

describe("updateProfileAction", () => {
  it("redirige vers la connexion sans session", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(null);

    await expectRedirectTo(() =>
      actions.updateProfileAction(
        undefined,
        form({ firstName: "Ada", lastName: "Lovelace" })
      )
    );

    expect(queries.updateAdminProfile).not.toHaveBeenCalled();
    expectNoWrite();
  });

  it("exige au moins un prénom ou un nom", async () => {
    const result = await actions.updateProfileAction(
      undefined,
      form({ firstName: "   ", lastName: "" })
    );

    expect(result.error).toMatch(/prénom ou un nom/);
    expect(queries.updateAdminProfile).not.toHaveBeenCalled();
    expect(queries.logAdminActivity).not.toHaveBeenCalled();
  });

  it("nettoie les caractères parasites, borne à 60 caractères et journalise", async () => {
    const result = await actions.updateProfileAction(
      undefined,
      form({
        firstName: "  Ada\u0000  \n Lovelace ",
        lastName: "x".repeat(80),
      })
    );

    expect(result.success).toBe("Profil mis à jour.");
    expect(queries.updateAdminProfile).toHaveBeenCalledWith(
      ADMIN.id,
      "Ada Lovelace",
      "x".repeat(60)
    );
    expect(queries.logAdminActivity).toHaveBeenCalledWith({
      userId: ADMIN.id,
      action: "profile.updated",
      target: `Ada Lovelace ${"x".repeat(60)}`,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/account");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/team");
  });

  it("accepte un prénom seul et efface le nom restant", async () => {
    const result = await actions.updateProfileAction(
      undefined,
      form({ firstName: "Ada", lastName: "" })
    );

    expect(result.success).toBe("Profil mis à jour.");
    expect(queries.updateAdminProfile).toHaveBeenCalledWith(ADMIN.id, "Ada", null);
    expect(queries.logAdminActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: "profile.updated", target: "Ada" })
    );
  });
});

// ---------------------------------------------------------------------------
// Réinitialisation du journal
// ---------------------------------------------------------------------------

describe("resetActivityAction", () => {
  it("redirige vers la connexion sans session", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(null);

    await expectRedirectTo(() => actions.resetActivityAction());

    expect(queries.resetAdminActivity).not.toHaveBeenCalled();
    expectNoWrite();
  });

  it("purge tout le journal puis enregistre l'effacement", async () => {
    await actions.resetActivityAction();

    expect(queries.resetAdminActivity).toHaveBeenCalledTimes(1);
    expect(queries.logAdminActivity).toHaveBeenCalledWith({
      userId: ADMIN.id,
      action: "journal.reset",
      target: "Journal réinitialisé",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/activity");
  });

  it("ne journalise pas la trace si la purge échoue", async () => {
    vi.mocked(queries.resetAdminActivity).mockRejectedValueOnce(
      new Error("base indisponible")
    );

    await expect(actions.resetActivityAction()).rejects.toThrow(
      "base indisponible"
    );
    expect(queries.logAdminActivity).not.toHaveBeenCalled();
  });
});

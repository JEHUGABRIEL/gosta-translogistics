# GOSTA TRANS — project knowledge

Marketing site + small admin dashboard for **GOSTA TRANS LOGISTIQUE & BTP**, a Bangui
(Central African Republic) logistics and construction company. Bilingual FR/EN public
site, French-only admin dashboard, Neon Postgres for admin-managed content and quote
requests. Deployed on Vercel. UI copy, code comments and commit context are in **French** —
match that.

## Working process — required by the project owner

**Never implement before approval.** Before writing any code, whether a new feature or a
one-line bug fix:

1. **Survey the app first.** Read the relevant parts of `app/`, `components/`, `lib/`, `i18n/`
   and `messages/` to understand how the current behaviour actually works — not just the
   file that seems to be at fault. Trace the full path (route → component → query/action →
   schema) and check for an existing pattern that already solves it.
2. **Judge the request against good practice.** Architecture fit, frontend/backend
   separation (server components vs. client, Server Actions vs. API routes), i18n
   completeness, web security (authz on every admin action, input validation, CSP/headers,
   rate limiting, secrets), accessibility, and consistency with the tokens and conventions
   below. Flag it when the request itself leads somewhere unsound, and say why.
3. **Present a plan, then stop:** the approach, the files that will be touched, the trade-offs
   / alternatives worth considering, and any recommendation (including "this should be done
   differently"). Ask for an explicit go-ahead before editing anything.

Small does not mean exempt: a typo fix in a component also gets a quick look at how that
component is used. Only skip the survey when the request is purely a question.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
next-intl 4 · framer-motion · lucide-react · Neon serverless driver (`@neondatabase/serverless`)
· TanStack Query 5 (`@tanstack/react-query`).
Tests: Vitest 4 (`vitest.config.ts`, `test/`). No component library; Query est la seule
couche de données côté client.

## Where things live

| Path | Role |
|---|---|
| `app/[locale]/` | Public site, one segment per locale (`fr`, `en`). Home page composes the section components. |
| `app/[locale]/services/` | Hub « Nos prestations » (les 7 pôles) ; `[pole]` liste un pôle ; `[pole]/[slug]` détail d'une prestation. Les anciennes URL `/services/btp/...` et `/services/logistique/...` restent valides (ce sont des pôles). |
| `app/admin/` | Dashboard (login, quotes, contact messages, FAQ, testimonials, news, team, account). Outside `[locale]`. Protected pages live in the `(protected)` route group, which carries a session guard layout. |
| `app/api/quote/route.ts` | POST quote request, IP rate-limited, field-truncated. |
| `app/api/contact/route.ts` | POST free-form contact message (honeypot + IP rate limit), lue dans `/admin/messages`. |
| `lib/mfa.ts` | TOTP (otpauth) : enrôlement sur `/admin/account`, défi intermédiaire (`admin_mfa_challenges`) avant la session. |
| `components/` | Public site sections (`Header`, `HeroCarousel`, `Services`, `Projects`, `QuoteForm`, …) and `components/admin/` for the dashboard. |
| `lib/db/schema.sql` | Whole DB schema; applied by `scripts/migrate.mjs`. |
| `lib/db/queries.ts` | All SQL, one function per operation. `lib/db/client.ts` exposes `getDb()`. |
| `lib/services.ts` / `lib/services-en.ts` | FR and EN catalogs: 7 pôles (`transport`, `logistique`, `btp`, `electricite`, `climatisation`, `solaire`, `nettoyage`) et 33 prestations au total, slugs identiques dans les deux langues. Use `getServices(locale)` → `{ poles, byPole, all }`, `getServiceBySlug(locale, slug)` (slug globalement unique), `getServicesByPole`, `getPole`, `isPoleId`. Les slugs existants (`gros-oeuvre`, `location-engins`, …) ne doivent pas changer : ils sont indexés. |
| `lib/services-payload.ts` + `app/api/services/route.ts` | Forme sérialisable du catalogue (sans icônes) servie en JSON, consommée par `FeaturedServices` via Query. |
| `components/FeaturedServices.tsx` | Cartes vedette à retournement (7 pôles) : survol/focus sur desktop, IntersectionObserver + tap sur mobile, deux actions (« En savoir plus », « Nous contacter »). La face avant garde l'image du pôle (`Pole.image`, photo réelle du dépôt). |
| `components/QueryProvider.tsx` | `QueryClient` par arbre (jamais un singleton module). Monté dans le layout public **et** dans le layout admin. |
| `app/api/admin/quotes/route.ts` | Liste des devis pour le dashboard (`requireAdmin` → 401 si non authentifié), consommée par `QuotesBoard`. |
| `lib/admin-auth.ts` | scrypt password hashing, sessions, OTP/invite tokens (node:crypto only). |
| `lib/email.ts` | Resend REST calls via `fetch` — no SDK. Bilingual-ish French HTML templates. |
| `lib/rate-limit.ts` | Throttling backed by the Neon `rate_limits` table (login lockout, IP limits). `lib/request-ip.ts` resolves the client IP from forwarded headers. |
| `lib/seo.ts` | `SITE_URL`, `COMPANY` (phones, addresses, socials), `pageMetadata()`, `getAlternates()`. `lib/social.ts` holds social/Maps links and `SITES`. `app/sitemap.ts` / `app/robots.ts` emit both from these constants. |
| `messages/{fr,en}.json` | next-intl message trees — must stay structurally identical. |
| `i18n/{routing,navigation,request}.ts` | Locale config and the localized `Link`/`useRouter`/`usePathname`. |
| `proxy.ts` | next-intl middleware (Next 16 renamed `middleware.ts` → `proxy.ts`). |
| `app/globals.css` | Design tokens + utility classes (`hazard-stripe`, fonts, focus ring, reduced-motion). |
| `AUDIT-DESIGN.md` | Design audit and the fixes applied (tracked at the root). `design/` holds gitignored mockups/scratch — never commit it. |

## Commands

> After pulling changes that touch `lib/db/schema.sql`, run `npm run db:migrate` **before**
> deploying: the dashboard now depends on `rate_limits`, `admin_activity` and the
> `admin_invites.resend_count` / `last_sent_at` columns.

```bash
npm install
npm run dev                    # next dev (Turbopack), http://localhost:3000 → /fr
npm run lint                   # eslint
npx tsc --noEmit               # there is no typecheck script; this is the gate
npm run build                  # next build (also type-checks + lints)
npm start                      # serve the production build
npm test                       # vitest run (SQL suite skipped without TEST_DATABASE_URL)
npm run test:watch             # vitest --watch
npm run db:migrate             # applies lib/db/schema.sql (loads .env.local)
npm run db:seed-admin -- you@example.com   # or: node scripts/seed-admin.mjs <email>
```

`db:seed-admin` prints a generated password once and resets it if the user already exists.

### Tests

Vitest 4 (`vitest.config.ts`). Two suites, in `test/`:

- **`admin-actions.test.ts`** — the admin Server Actions with everything mocked (queries,
  rate limiter, `next/headers`, `next/navigation`, `next/cache`, email). Covers authorization
  per action, session-scoped revocation, password change (session revocation + rotation),
  generic login errors, lockout short-circuit, input validation and the invite flow.
  Runs offline: **`npm test` is enough.**
- **`rate-limit.test.ts`** — the real SQL of the limiter against a database (counter upsert,
  sliding window, per-identity vs global locks, purge, fail-open). Skipped unless
  `TEST_DATABASE_URL` is set:

```bash
TEST_DATABASE_URL="postgres://…neon…/test" npm test
```

Rules that matter:

- **Never `DATABASE_URL` for tests.** The SQL suite writes and deletes rows; `test/setup/env.ts`
  only reads `TEST_DATABASE_URL`, refuses to start if it equals `DATABASE_URL`, and points
  `DATABASE_URL` at the test branch. Use a dedicated Neon branch.
- **Vitest loads `.env*` into `process.env`**, so `DATABASE_URL` is already populated when the
  setup runs — that is exactly why the equality guard exists.
- `test/setup/db.ts` applies `lib/db/schema.sql` the way `scripts/migrate.mjs` does (split on
  `;`), so the test bootstrap also exercises the migration path.
- Actions cannot be invoked through the framework outside a Next runtime: tests call the
  exported functions directly, with `redirect()` replaced by a throwing sentinel.

## Environment

`.env.local` (gitignored; `.env.example` documents the keys):

- `DATABASE_URL` — Neon connection string. Required by `getDb()`, migrations, seeding.
- `RESEND_API_KEY` — required for invite and OTP emails.
- `RESEND_FROM_EMAIL` — optional sender; defaults to `onboarding@resend.dev` (Resend free
  tier without a verified domain).
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — utilisés par
  `uploadNewsImageAction` (Server Action) pour le visuel d'une actualité : envoi signé côté
  serveur, le secret ne quitte jamais le serveur. Sans ces variables, l'upload échoue avec un
  message explicite ; les autres images du site restent des URL statiques.

## Conventions & gotchas

- **No root layout.** `app/[locale]/layout.tsx` and `app/admin/layout.tsx` each render
  their own `<html>`/`<body>`. Adding markup that must appear on both means touching both.
- **The public site must never hard-depend on the database.** The home page wraps
  `listTestimonials` / `listNewsPosts` in `Promise.allSettled` and falls back to static
  content. Keep that pattern: a missing `DATABASE_URL` must not break rendering.
- **Design tokens over hexes.** Colors come from CSS variables in `globals.css`
  (`--navy-deep`, `--red`, `--sand`, `--steel`, `--line`, `--amber`, …). Amber is only ever
  used on dark backgrounds (contrast). Reuse the existing card recipe (radius, shadow,
  hover lift, easing) instead of inventing new styles.
- **Accessibility is enforced by review, not tooling.** Global `:focus-visible` ring,
  `prefers-reduced-motion` plus framer-motion `useReducedMotion()` gate every JS autoplay
  timer, carousels pause on hover/focus. Preserve these when adding motion.
- **Localized content lives in two places.** UI strings in `messages/*.json`; long-form
  service copy in `lib/services*.ts`; DB-managed content uses parallel `*_fr` / `*_en`
  columns. When adding content, update both locales.
- **Locale-aware navigation.** Import `Link`/`useRouter`/`usePathname` from `@/i18n/navigation`,
  not `next/link` or `next/navigation`, on public pages. `app/admin` is outside the locale
  routing and uses plain Next APIs (all admin text is French).
- **The quote endpoint is the only write path from the public site.** It rate-limits per IP
  (10 / 10 min), rejects over-long fields by truncation (`MAX_*` constants), strips control
  characters, and uses a hidden `website` honeypot field that returns fake success without
  inserting. Keep all three layers when touching `components/QuoteForm.tsx` or the route.
- **Admin auth details.** Passwords are `scrypt:16384:<salt>:<hash>`; sessions are hashed
  tokens in the `sessions` table with an httpOnly cookie scoped to `path: /admin` (12 h).
  Invites are two-step (link → form → email OTP, 48 h / 10 min TTLs, max 5 resends); nothing
  is written to `admin_users` until the OTP is validated. Changing a password revokes every
  session and rotates the current one.
- **Session cookie must be cleared on the `/admin` path.** `cookies().delete()` emits a
  `Set-Cookie` with `Path=/`, which does not remove a cookie scoped to `/admin`. Use
  `store.set(COOKIE_NAME, "", { path: "/admin", maxAge: 0 })` (see `destroySession`).
- **Rate limiting is database-backed, not in memory.** State lives in the `rate_limits`
  table so all serverless instances share it. If the DB call fails the limiter **fails
  open** and logs — never let throttling turn into an outage. Login is limited per
  `email + IP` (5) and per email globally (20) to resist distributed attacks without
  letting one IP lock an account.
- **`/admin` is guarded in three places:** `proxy.ts` (cheap cookie-presence redirect),
  `app/admin/(protected)/layout.tsx` (session check for the whole group), and
  `requireAdmin()` inside every action/page that touches data. Keep all three: a layout
  protects neither Server Actions nor direct data access.
- **Audit trail.** Mutations call `logAdminActivity()` (`admin_activity` table, surfaced on
  `/admin/team`); it is best-effort and never fails the mutation. The account page lists
  active sessions with per-session revocation.
- **Server Actions** live in `app/admin/actions.ts` (`"use server"`); mutating queries come
  from `lib/db/queries.ts` and paths are revalidated with `revalidatePath`.
- **Security headers are set in `next.config.ts`.** A new external image host must be added
  to both the CSP `img-src` list and `images.remotePatterns` (Unsplash is the only remote
  host today). `'unsafe-eval'` is dev-only; `'unsafe-inline'` stays because a nonce-based CSP
  would force every page dynamic (they are prerendered via `generateStaticParams`).
- **`server-only` guards the data layer.** `lib/db/client.ts`, `lib/db/queries.ts`,
  `lib/admin-auth.ts`, `lib/rate-limit.ts` and `lib/request-ip.ts` import `"server-only"`;
  client components may only import their **types** (`import type`).
- **Coordonnées : une seule source à mettre à jour.** `lib/seo.ts` (`COMPANY` : adresse
  Gré-Vapendé PK16, 3 numéros, email `gostatranslogistiquelp@outlook.fr`, RCCM/NIU),
  `lib/social.ts` (`SITES` : un seul site, lien Maps), `components/Header.tsx` (`PHONES`,
  email du bandeau) et les messages `footer.sites.*` / `contact.*` / `legal.*`. Aligné sur
  le flyer de l'entreprise ; toute modification doit toucher les quatre endroits.
- **TanStack Query ne remplace pas le rendu serveur.** Les cartes vedette et la liste de
  devis reçoivent un `initialData` rendu côté serveur ; Query ne sert qu'au rafraîchissement
  en arrière-plan (`staleTime` 5 min, pas de refetch au focus). Ne pas transformer une page
  publique en écran de chargement.
- **Cartes à retournement :** les deux faces sont dans le DOM (le verso reste lisible au
  clavier), la carte se retourne aussi sur `focus-within`, et un tap visant un lien ou un
  bouton n'est jamais intercepté. `prefers-reduced-motion` neutralise la transition via
  `globals.css`.
- **`SITE_URL` is hardcoded** in `lib/seo.ts` (`https://gosta-trans.vercel.app`). Change it
  there when a custom domain is attached — canonicals, hreflang, sitemap, OG tags and invite
  links all derive from it.
- **`proxy.ts` matcher** excludes `api`, `trpc`, `_next`, `_vercel` and anything with a file
  extension. `/admin/*` is handled by an explicit branch before the intl middleware, so admin
  routes are never locale-prefixed; only `/admin/login` and `/admin/accept-invite*` are
  public.
- **`AGENTS.md` is regenerated by `next dev`.** Its Next.js-rules block reappears if removed;
  commit it rather than reverting it. Next 16 APIs differ from older training data — consult
  `node_modules/next/dist/docs/` before writing framework code.
- **Verification** = `npx tsc --noEmit` + `npm run lint` + `npm test` + `npm run build` (renders
  all pages), plus exercising the changed flow in the browser (quote form, admin login, locale
  switch). `npm run lint` exits 0; two warnings remain (custom `<link>` font in the locale
  layout, unused `locale` in `ServiceDetailTemplate`) and are accepted.
- **`.agents/**` is excluded from ESLint** (`globalIgnores`) : c'est le scaffolding du SDK
  d'agent, non versionné, dont les types génériques utilisent `any` volontairement. Ne pas
  le lint-er ; ne pas le committer non plus.

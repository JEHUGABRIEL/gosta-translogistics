# GOSTA TRANS — project knowledge

Marketing site + small admin dashboard for **GOSTA TRANS LOGISTIQUE ET BTP** (nom officiel complet, jamais « & »), a Bangui
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

**Ce que le plan doit livrer**, toujours dans cet ordre :

- l'approche retenue et le parcours réellement concerné (route → composant → action/requête →
  schéma), en citant le pattern existant réutilisé s'il y en a un ;
- la liste des fichiers créés / modifiés / supprimés ;
- les points sensibles touchés : authz (`requireAdmin`, `getSessionUser`), validation des
  entrées, rate limit, CSP / `images.remotePatterns`, secrets, i18n FR/EN, accessibilité ;
- les alternatives écartées et la recommandation, y compris « ce n'est pas comme ça qu'il faut
  le faire » et pourquoi ;
- ce qui sera vérifié après (`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`,
  plus le parcours manuel concerné).

Rien n'est écrit avant un « go » explicite. Une demande de changement après le plan relance
l'analyse (nouveau plan), elle n'autorise pas l'implémentation.

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
| `app/admin/` | Dashboard (login, quotes, contact messages, FAQ, testimonials, news, team, activity journal, account). Outside `[locale]`. Protected pages live in the `(protected)` route group, which carries a session guard layout. |
| `app/api/admin/quotes/route.ts` | Liste des devis pour le dashboard (`requireAdmin` → 401 si non authentifié), consommée par `QuotesBoard`. |
| `app/api/admin/notifications/route.ts` | Badge du dashboard : devis et messages au statut `new`, filtrés par le paramètre `since` (effacement côté client, rien n'est écrit en base). Types dans `lib/admin-notifications.ts`. |
| `app/api/admin/activity/export/route.ts` | Export CSV du journal (`;`, BOM UTF-8, plafond 5000 lignes, fuseau `Africa/Bangui`), protégé par `requireAdmin`. |
| `app/api/quote/route.ts` | POST quote request, IP rate-limited, field-truncated. |
| `app/api/contact/route.ts` | POST free-form contact message (honeypot + IP rate limit), lue dans `/admin/messages`. |
| `lib/mfa.ts` | TOTP (otpauth) : enrôlement sur `/admin/account`, défi intermédiaire (`admin_mfa_challenges`) avant la session. |
| `components/` | Public site sections (`Header`, `HeroCarousel` + `HeroScene`, `Expertise` + `ExpertiseCards`, `WhyUs`, `Projects`, `ContactBand`, `FAQAccordion`, `QuoteForm`, …) and `components/admin/` for the dashboard. `HeroCarousel` n'a plus qu'une composition, partagée par l'accueil, les pages pôle, les fiches prestation **et** `/a-propos` : la photo de la slide occupe tout le fond de la section (plein cadre, fondu enchaîné de 0,9 s d'une slide à l'autre), avec un voile `black/55` et un dégradé bas (`from-black/75 via-black/20`) pour la lisibilité ; le texte se pose dessus, à gauche (sur-titre ambre, titre blanc, `BrushUnderline` ambre, CTA rouge). Plus de panneau navy, de cadre photo à droite, d'aplat rouge décalé ni de barre ambre. `/a-propos` garde son propre montage statique (une seule photo, pas de carrousel) mais le même fond plein cadre et le même voile. L'ancienne variante `editorial` (fond clair, photo collée au bord droit) a été supprimée. Autoplay, pause au survol/focus et `prefers-reduced-motion` sont communs ; il n'y a **plus** de points ni de flèches prev/next visibles (WCAG 2.2.2 tenu par la pause au survol/focus et le respect de `prefers-reduced-motion`). L'accueil affiche 3 slides, une par message (port/chantier, logistique, BTP) avec `hero-1`, `hero-4`, `hero-2`. Le titre de hero tient sur **deux lignes maximum** : colonne pleine largeur (`max-w-7xl`) et taille calibrée sur la ligne la plus longue de chaque langue — FR `clamp(0.85rem,5vw,3.6rem)`, EN `clamp(0.8rem,4vw,3.6rem)` (la ligne EN la plus longue est « FROM STRUCTURAL TO FINISHING WORKS. ») — toute nouvelle ligne de message plus longue que celle-ci ferait passer le titre à trois lignes. La hero a une hauteur minimale de `clamp(30rem,86svh,52rem)` (contenu posé en bas via `flex flex-col justify-end`), reprise par `/a-propos`. La section `About` n'affiche plus le bloc « Siège social » (adresse retirée) ; l'adresse reste dans le footer, la page contact et les mentions légales. **Pastille de défilement** : la hero porte une propriété `scrollTo` (id de la section suivante — `chiffres` sur l'accueil, `prestations` sur les pages pôle, `contenu` sur les fiches) ; une **bosse** (`w-20`, `rounded-b-full`, dégradé noir `from-[#15191e] via-[#0b0e12] to-black` qui prolonge le bas voilé de la photo — pas de bleu, sans liseré ni contour) prolonge le bord bas de la hero : son haut est noyé dans la section, seule la partie arrondie dépasse (`translate-y-[calc(100%-20px)]`, wrapper `relative z-10`, section en `overflow-hidden`), avec un `ChevronDown` dedans qui passe à l'ambre au survol et fait défiler vers cette section. Composant `components/HeroScrollBump.tsx` (props `target` + `label`), utilisé par `HeroCarousel` **et** par la hero de `/a-propos` : toute nouvelle hero doit passer par lui plutôt que de redessiner la bosse. Sur `/a-propos`, la cible est `#chiffres` (`KeyFigures`) ; le CTA « Découvrir » continue de pointer vers `#presentation`. La section visée porte `scroll-mt-[var(--header-h)]` et un padding haut suffisant pour que la pastille ne recouvre pas son premier texte. **Textes de héros** : même traitement partout — sur-titre `font-mono` en capitales précédé d'un filet (ambre), titre `[text-wrap:balance]` + `tracking-[-0.01em]`, `text-shadow` douce sur les héros à photo et `BrushUnderline` ambre sous le titre (carrousel, `/contact`, `/services`, `/a-propos`). **Bandeau d'infos** : sa hauteur est **fixe** (`h-[var(--topbar-h)]`, `flex-nowrap`), elle ne doit pas dépendre de son contenu. Sinon, sur mobile (où la pastille de langue le faisait grandir à 49 px), le header dépassait `--header-h` et la hero, remontée de `--header-h`, laissait une bande claire (`--sand`) au-dessus de la barre. **Dernière ligne animée** : sur l'accueil, la dernière ligne du titre passe par `components/TypewriterLine.tsx` (client) — frappe lettre par lettre (55 ms), pause de 1,5 s, effacement lettre par lettre (30 ms), puis reprise en boucle ; le texte complet reste présent en calque `invisible` (la hauteur du titre ne bouge pas) et en `sr-only` pour les lecteurs d'écran ; `prefers-reduced-motion` affiche le texte d'un bloc. L'animation repart à chaque changement de slide (remontage par `AnimatePresence`). `Header` prend un prop `tone` (`"light"` n'est plus utilisé, la barre est transparente sur la hero ; `"dark"` par défaut : barre transparente, car tous les héros passent derrière le header via `-mt-[var(--header-h)]`). Au défilement, la barre reprend `--navy-mid/95`. Le bandeau d'infos (téléphone, horaires, réseaux, langue) suit la même règle que la barre : transparent par-dessus la hero (tous les héros sont navy), puis bleu au scroll. |
| `migrations/` | Migrations versionnées (`0001_initial_schema.sql`, `0002_…`), appliquées dans l'ordre par `scripts/migrate.mjs`. Le suivi vit dans la table `schema_migrations` (version + empreinte SHA-256) ; un fichier déjà appliqué ne se modifie plus. |
| `lib/db/queries.ts` | All SQL, one function per operation. `lib/db/client.ts` exposes `getDb()`. |
| `lib/services.ts` / `lib/services-en.ts` | FR and EN catalogs: 7 pôles (`transport`, `logistique`, `btp`, `electricite`, `climatisation`, `solaire`, `nettoyage`) et 33 prestations au total, slugs identiques dans les deux langues. Use `getServices(locale)` → `{ poles, byPole, all }`, `getServiceBySlug(locale, slug)` (slug globalement unique), `getServicesByPole`, `getPole`, `isPoleId`. Les slugs existants (`gros-oeuvre`, `location-engins`, …) ne doivent pas changer : ils sont indexés. |
| `lib/services-payload.ts` + `app/api/services/route.ts` | Forme sérialisable du catalogue (sans icônes) servie en JSON. Aucun consommateur côté site pour l'instant : l'ancienne grille `FeaturedServices` a été supprimée, la route reste pour un usage client futur. |
| `lib/projects.ts` | Les 6 réalisations du site (FR + EN, slugs identiques) : source des cartes de la section « Nos réalisations », de la page index `app/[locale]/realisations/` **et** des pages `app/[locale]/realisations/[slug]/`. `getProjects(locale)` / `getProject(locale, slug)`. Les textes reprennent des contenus déjà publiés (catalogue de prestations, messages) — ne rien inventer (pas de date, de chiffre ni de lieu de chantier absent de `knowledge.md`/du site). Les entrées `home.projects.items` des messages ont été supprimées : tout vit ici. |
| `lib/news.ts` | Actualités éditoriales du site (FR + EN, slugs identiques) : source des 3 cartes de la home **et** des pages `app/[locale]/actualites/[slug]/`. `getNewsPosts(locale)` / `getNewsPost(locale, slug)`. La page index `app/[locale]/actualites/` liste **toutes** les actualités : les éditoriales puis celles publiées depuis le dashboard (dédoublonnées par slug). `newsSlug(title)` dérive l'URL d'une actualité publiée depuis le dashboard (titre FR, donc même URL dans les deux langues). Pour ajouter une actualité : ajouter l'entrée FR **et** l'entrée EN (même slug), les photos dans `public/actualites/`. |
| `lib/hero-images.ts` | Photos de fond des héros (Unsplash, `w=2560`) : `SERVICES_HERO_IMAGE`, `ABOUT_HERO_IMAGE`, `CONTACT_HERO_IMAGE`, `POLE_HERO_IMAGES`. Aucune URL d'image en dur dans les pages. |
| `components/ExpertiseCards.tsx` | Six cartes photo du « savoir-faire » de l'accueil (client). La carte active s'agrandit (`md:scale-[1.035]`) et laisse remonter un encart clair (`bg-[var(--surface)]`) avec titre, texte et « Voir le détail ». Activation au survol/focus sur les appareils pointeurs, sinon via `IntersectionObserver` (`rootMargin: -45%`), donc au défilement sur mobile. Les visuels et les liens vivent dans `ExpertiseCards`/`Expertise`, les textes dans `home.expertise.cards` (6 entrées). |
| `components/WhyUs.tsx` | « Pourquoi nous » : titre souligné + encart d'intro à gauche, quatre arguments sur deux colonnes (icônes dans un carré navy, trait fin au-dessus). Aucune marge négative : la section est posée **par-dessus** l'image plein cadre qui la précède (voir ci-dessous). |
| `app/[locale]/page.tsx` (accueil) | Ordre : `HeroCarousel` (héro navy, 3 slides, identique aux pages pôle) → `KeyFigures` → `Expertise` → `About` → image plein cadre + `WhyUs` → `Projects` + `ContactBand` → `News` (exactement 3 cartes, chacune vers sa page `/actualites/[slug]` ; réalisations : 6 cartes de `lib/projects.ts` vers `/realisations/[slug]`) → `Partners` → FAQ → `Testimonials` (section commentaires) → `CTASection` → `Footer`. Les effets de recouvrement sont un wrapper `relative` contenant le bloc du dessous en `sticky top-0 z-0` et le bloc du dessus en `relative z-10` : au défilement, le second remonte et masque le premier. Le même montage sert sur `/a-propos` (`VisionBand` épinglée, `Values` par-dessus). Les anciennes sections `FeaturedServices` et `TestimonialsQuoteSection` ont été supprimées (composants et clés `home.featured` / `home.quote`). Sur `/a-propos`, les sections « Repères » et « Notre équipe » ont été retirées à la demande : la page enchaîne hero → `KeyFigures` → `About` → `VisionBand`/`Values` → `ProcessSteps` → `Partners` → `CTASection` (`components/OurTeam.tsx` et les clés `home.team` / `about.facts` restent dans le dépôt mais ne sont plus rendues). L'index `/realisations` reprend le montage des hubs (`services`) : bandeau photo (hero-3) + titre souligné + intro, puis les 6 réalisations en grille (visuel, famille, titre, premier paragraphe, « Voir la réalisation ») ; il est atteint depuis le lien « Toutes les réalisations » de la section « Nos réalisations » de la home (`home.projects.all`). L'index `/actualites` suit le même montage (bandeau photo hero-1, titre souligné, grille de cartes avec date, titre, premier paragraphe et « Lire la suite »), alimenté par `lib/news.ts` **et** par les actualités du dashboard ; il est atteint depuis le lien « Toutes les actualités » de la section `News` de la home (`home.news.all`). Textes dans le namespace `news.hub`. **Pagination** (commune à `/actualites` et `/realisations`) : `PER_PAGE = 9` (3 × 3) dans chaque page index, paramètre `?page=` borné entre 1 et le nombre de pages (hors bornes → dernière page, pas de 404). La barre vit dans `components/Pagination.tsx` (`basePath`, `current`, `total`) : `Précédent` / `Page X sur Y` / `Suivant`, liens `rel=prev|next`, états désactivés en `aria-disabled`, rien d'affiché s'il n'y a qu'une page. Libellés dans le namespace `pagination`. Le `searchParams` rend ces deux routes dynamiques (`ƒ`) à la compilation : c'est normal. Les pages de détail `/realisations/[slug]` et `/actualites/[slug]` partagent le même montage : bandeau photo plein cadre (retour vers l'ancre de la home, famille de travaux ou date, titre), corps en `max-w-5xl` (texte à 17 px, interligne 1.8 — élargi à la demande : les colonnes `max-w-3xl` étaient trop étroites/centrées), galerie `ImageCarousel`, puis le bloc `components/RelatedCards.tsx` (« Autres réalisations » / « Autres actualités » : 3 cartes vers les contenus voisins, en excluant la page courante) avant `CTASection` et `Footer`. Les clés de textes ajoutées : `home.projects.back` / `home.projects.other` et `home.news.back` / `home.news.other`. |
| `components/QueryProvider.tsx` | `QueryClient` par arbre (jamais un singleton module). Monté dans le layout public **et** dans le layout admin. |
| `lib/admin-auth.ts` | scrypt password hashing, sessions, OTP/invite tokens (node:crypto only). |
| `lib/admin-activity.ts` | `ADMIN_ACTION_LABELS` : libellés FR des codes écrits par `logAdminActivity`. Ajouter une entrée à chaque nouveau code, sinon l'action s'affiche brute dans `/admin/activity`. |
| `lib/email.ts` | Resend REST calls via `fetch` — no SDK. Bilingual-ish French HTML templates. |
| `lib/rate-limit.ts` | Throttling backed by the Neon `rate_limits` table (login lockout, IP limits). `lib/request-ip.ts` resolves the client IP from forwarded headers. |
| `lib/seo.ts` | `SITE_URL`, `COMPANY` (phones, addresses, socials), `pageMetadata()`, `getAlternates()`. `lib/social.ts` holds social/Maps links and `SITES`. `app/sitemap.ts` / `app/robots.ts` emit both from these constants. |
| `messages/{fr,en}.json` | next-intl message trees — must stay structurally identical. |
| `app/[locale]/faq` | Dossier vide : il n'y a **pas** de page `/faq`. La FAQ publique est la section `FAQAccordion` de l'accueil, alimentée par `listFaqs` et éditée dans `/admin/faq`. |
| `i18n/{routing,navigation,request}.ts` | Locale config and the localized `Link`/`useRouter`/`usePathname`. |
| `proxy.ts` | next-intl middleware (Next 16 renamed `middleware.ts` → `proxy.ts`). |
| `app/globals.css` | Design tokens + utility classes (`hazard-stripe`, fonts, focus ring, reduced-motion). |
| `AUDIT-DESIGN.md` | Design audit and the fixes applied (tracked at the root). `design/` holds gitignored mockups/scratch — never commit it. |

## Commands

> After pulling changes that add a file to `migrations/`, run `npm run db:migrate` **before**
> deploying. `npm run db:status` liste les versions appliquées / en attente sans rien écrire.

```bash
npm install
npm run dev                    # next dev (Turbopack), http://localhost:3000 → /fr
npm run lint                   # eslint
npx tsc --noEmit               # there is no typecheck script; this is the gate
npm run build                  # next build (also type-checks + lints)
npm start                      # serve the production build
npm test                       # vitest run (SQL suite skipped without TEST_DATABASE_URL)
npm run test:watch             # vitest --watch
npm run db:migrate             # applique les migrations en attente (charge .env/.env.local)
npm run db:status              # état des versions, lecture seule
npm run db:seed-admin -- you@example.com   # or: node scripts/seed-admin.mjs <email>
```

`db:seed-admin` prints a generated password once and resets it if the user already exists.

```bash
NODE_COMPILE_CACHE= vercel whoami     # CLI Vercel — sans le préfixe il reste bloqué
NODE_COMPILE_CACHE= vercel --prod     # déploiement prod (sinon : push sur main = intégration Git)
```

### Tests

Vitest 4 (`vitest.config.ts`). Three suites, in `test/`:

- **`activity-export.test.ts`** — `GET /api/admin/activity/export` : 401 hors session, BOM
  UTF-8 vérifié sur les octets, séparateur `;`, échappement des guillemets et des retours à
  la ligne, transmission des filtres `q`/`action` et marqueur d'export tronqué. Tout est
  mocké, la suite tourne hors ligne.

- **`admin-actions.test.ts`** — the admin Server Actions with everything mocked (queries,
  rate limiter, `next/headers`, `next/navigation`, `next/cache`, email). Covers authorization
  per action, session-scoped revocation, password change (session revocation + rotation),
  generic login errors, lockout short-circuit, input validation and the invite flow.
  Runs offline: **`npm test` is enough.**
- **`i18n-parity.test.ts`** — arbres `messages/fr.json` / `en.json` identiques (clés,
  longueurs de tableaux, aucune valeur vide) et catalogue de prestations identique
  en pôles et slugs. À lancer après toute retouche de contenu bilingue.
- **`migrations.test.ts`** — découpage SQL (points-virgules dans les chaînes, les identifiants,
  les commentaires, les blocs `$$ … $$`), nommage et numérotation des fichiers, empreintes
  SHA-256, plan d'application (en attente / modifiée / orpheline) et diagnostic d'erreur.
  Hors ligne, sans base.

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
- `test/setup/db.ts` applique `migrations/` avec `applyMigrations` — le **même** runner que
  `scripts/migrate.mjs` : le bootstrap des tests exerce donc le vrai chemin de migration.
- `vitest.config.ts` aliases `@/` to the repo root and `server-only` to
  `test/stubs/server-only.ts` — that stub is why modules importing `"server-only"` can be
  imported in Node tests. Don't delete it.
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
  `listTestimonials` / `listNewsPosts` / `listFaqs` in `Promise.allSettled` and falls back to
  static content (the FAQ falls back to the `faq.items` messages). Keep that pattern: a
  missing `DATABASE_URL` must not break rendering.
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
  tokens in the `sessions` table with an httpOnly cookie at `path: /` (12 h) — it must
  cover `/api/admin/*`, whose route handlers authenticate with `getSessionUser()`.
  Invites are two-step (link → form → email OTP, 48 h / 10 min TTLs, max 5 resends); nothing
  is written to `admin_users` until the OTP is validated. Changing a password revokes every
  session and rotates the current one.
- **Session cookie clearing.** `destroySession` writes an empty cookie on both `/` and
  the legacy `/admin` path, so sessions issued before the cookie was widened are removed too.
- **Rate limiting is database-backed, not in memory.** State lives in the `rate_limits`
  table so all serverless instances share it. If the DB call fails the limiter **fails
  open** and logs — never let throttling turn into an outage. Login is limited per
  `email + IP` (5) and per email globally (20) to resist distributed attacks without
  letting one IP lock an account.
- **`/admin` is guarded in three places:** `proxy.ts` (cheap cookie-presence redirect),
  `app/admin/(protected)/layout.tsx` (session check for the whole group, via `getSessionUser`),
  and `requireAdmin()` (defined in `lib/admin-guard.ts`, hors du module `"use server"`
  pour ne pas devenir un endpoint d'action) inside every action, page and
  `/api/admin/*` route that touches data. Keep all three: a layout protects neither Server
  Actions nor direct data access. Dans un route handler, `requireAdmin()` échoue par une
  redirection (307) : l'envelopper dans un `try/catch` pour répondre 401, comme le fait
  `app/api/admin/quotes/route.ts`.
- **Rôles admin.** `admin_users.role` vaut `owner` (compte de bootstrap créé par
  `db:seed-admin`, seul à pouvoir inviter un admin et purger le journal) ou `admin`.
  Garde correspondante : `requireOwner()` dans `lib/admin-guard.ts`.
- **Audit trail.** Mutations call `logAdminActivity()` (`admin_activity` table, surfaced on
  `/admin/activity` avec filtres `q` / `action` et export CSV, and on `/admin/team`); it is
  best-effort and never fails the mutation. The account page lists active sessions with
  per-session revocation.
- **Migrations versionnées.** Un fichier par changement : `NNNN_nom_en_minuscules.sql`, numéroté
  à partir de 1 sans trou, en SQL idempotent (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).
  `scripts/migrate.mjs` applique chaque fichier en attente dans **sa propre transaction** et
  enregistre version + empreinte dans `schema_migrations` ; modifier un fichier déjà appliqué
  fait échouer la commande (ajouter une nouvelle migration à la place). Le découpage des
  instructions (`scripts/lib/migrations.mjs`) suit l'état lexical du SQL, donc les points-virgules
  dans les chaînes, les identifiants, les commentaires et les blocs `$tag$` ne cassent plus rien —
  les blocs `DO $$ … $$` sont utilisables. Erreurs journalisées avec code/detail/hint Postgres,
  instruction fautive et piste réseau (`P2003`, `ETIMEDOUT`, …), sans jamais afficher le mot de
  passe de `DATABASE_URL`.
- **Server Actions** live in `app/admin/actions.ts` (`"use server"`); mutating queries come
  from `lib/db/queries.ts` and paths are revalidated with `revalidatePath`.
- **Security headers are set in `next.config.ts`.** A new external image host must be added
  to both the CSP `img-src` list and `images.remotePatterns` — `images.unsplash.com` and
  `res.cloudinary.com` (actualités) are the two allowed today. `'unsafe-eval'` is dev-only;
  `'unsafe-inline'` stays because a nonce-based CSP would force every page dynamic (they are
  prerendered via `generateStaticParams`). Les polices viennent d'un `<link>` Google Fonts
  dans `app/[locale]/layout.tsx` : `style-src` doit donc autoriser
  `https://fonts.googleapis.com` (et `font-src` `https://fonts.gstatic.com`). Sans le
  premier, le site retombait **silencieusement** sur la police système — Manrope et JetBrains
  Mono ne se chargeaient jamais, en dev comme en prod.
- **`server-only` guards the data layer.** `lib/db/client.ts`, `lib/db/queries.ts`,
  `lib/admin-auth.ts`, `lib/rate-limit.ts` and `lib/request-ip.ts` import `"server-only"`;
  client components may only import their **types** (`import type`).
- **Coordonnées : une seule source à mettre à jour.** `lib/seo.ts` (`COMPANY` : adresse
  Gré-Vapendé PK16, 3 numéros, email `gostatranslogistiquelp@outlook.fr`),
  `lib/social.ts` (`SITES` : un seul site, lien Maps), `components/Header.tsx` (`PHONES`,
  email du bandeau) et les messages `footer.sites.*` / `contact.*` / `legal.*`. Aligné sur
  le flyer de l'entreprise ; toute modification doit toucher les quatre endroits.
- **TanStack Query ne remplace pas le rendu serveur.** Les cartes vedette reçoivent un
  `initialData` rendu côté serveur ; Query ne sert qu'au rafraîchissement en arrière-plan
  (`staleTime` 5 min, pas de refetch au focus). Ne pas transformer une page publique en
  écran de chargement.
- **Devis et messages sont paginés côté serveur.** `?page`, `?q` et `?status` sont lus par
  `app/admin/(protected)/quotes/page.tsx` et `messages/page.tsx`, puis passés à
  `listQuoteRequests` / `listContactMessages` (`limit` + `offset`) et à leurs `count*`.
  Les filtres portent donc sur toute la table, pas sur la page affichée. Le bouton
  « Rafraîchir » et les mutations passent par `router.refresh()` ; `/api/admin/quotes`
  accepte les mêmes paramètres.
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
- **`README.md` is stock create-next-app boilerplate** and describes a `app/page.tsx` that
  does not exist. This file is the real documentation; update it here, not there.
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

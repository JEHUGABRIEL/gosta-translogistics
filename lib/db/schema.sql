-- Schéma du dashboard admin GOSTA TRANS.
-- Exécuté via `npm run db:migrate` (scripts/migrate.mjs).

-- ---------- Authentification ----------

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  password_hash TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invitation d'un nouvel admin : email -> lien d'invitation -> formulaire
-- (nom/prénom/mot de passe) -> OTP envoyé par email -> compte créé dans
-- admin_users seulement une fois l'OTP validé. Toute la donnée "en attente"
-- reste ici, jamais dans admin_users tant que l'email n'est pas confirmé.
CREATE TABLE IF NOT EXISTS admin_invites (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  invited_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  token_hash TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | otp_sent | accepted | expired
  first_name TEXT,
  last_name TEXT,
  password_hash TEXT,
  otp_hash TEXT,
  otp_expires_at TIMESTAMPTZ,
  otp_attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Demandes de devis (public -> admin) ----------

CREATE TABLE IF NOT EXISTS quote_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new | contacted | done
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Contenu bilingue (une ligne par élément, colonnes _fr/_en —
-- messages/fr.json et messages/en.json sont déjà des arbres parallèles
-- indexés à l'identique, aucun composant ne gère un contenu mono-langue) ----------

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  role_fr TEXT NOT NULL, role_en TEXT NOT NULL,
  context_fr TEXT NOT NULL, context_en TEXT NOT NULL,
  quote_fr TEXT NOT NULL, quote_en TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news_posts (
  id SERIAL PRIMARY KEY,
  title_fr TEXT NOT NULL, title_en TEXT NOT NULL,
  date_label_fr TEXT NOT NULL, date_label_en TEXT NOT NULL,
  content_fr TEXT, content_en TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 0003 — Double authentification (TOTP).
-- `mfa_secret` porte un secret enrôlé mais pas encore confirmé : il ne suffit
-- pas à ouvrir une session tant que `mfa_enabled` est faux.

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS mfa_secret TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT false;

-- Défi intermédiaire entre le mot de passe et le code TOTP. Aucune session
-- n'est créée tant que le code n'est pas validé ; le cookie ne porte qu'un
-- token opaque dont le hachage vit ici.
CREATE TABLE IF NOT EXISTS admin_mfa_challenges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_mfa_challenges_expires_at_idx
  ON admin_mfa_challenges (expires_at);

-- 0002 — Quota de renvoi des OTP d'invitation.
-- Sans lui, l'endpoint de renvoi permet de spammer la boîte mail de l'invité
-- et de remettre les tentatives à zéro indéfiniment.

ALTER TABLE admin_invites ADD COLUMN IF NOT EXISTS resend_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE admin_invites ADD COLUMN IF NOT EXISTS last_sent_at TIMESTAMPTZ;

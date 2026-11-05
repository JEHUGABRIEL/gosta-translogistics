-- 0005 — Rôles admin.
-- `owner` : compte fondateur, seul à pouvoir inviter un admin et purger le
-- journal d'activité. `admin` : accès complet au contenu et aux demandes.
-- Le premier compte créé (bootstrap via db:seed-admin) devient propriétaire.

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin';

UPDATE admin_users SET role = 'owner'
  WHERE id = (SELECT min(id) FROM admin_users)
    AND NOT EXISTS (SELECT 1 FROM admin_users WHERE role = 'owner');

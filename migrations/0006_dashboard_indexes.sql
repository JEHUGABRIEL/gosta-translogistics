-- 0006 — Index de lecture du dashboard et des contenus publics.

-- Listes triées par date et filtre du badge de notifications.
CREATE INDEX IF NOT EXISTS quote_requests_status_created_idx
  ON quote_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_status_created_idx
  ON contact_messages (status, created_at DESC);

-- Sessions : révocation par utilisateur et purge des expirées.
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

-- Contenus publics : tri par ordre d'affichage des éléments publiés.
CREATE INDEX IF NOT EXISTS news_posts_published_sort_idx ON news_posts (published, sort_order);
CREATE INDEX IF NOT EXISTS faqs_published_sort_idx ON faqs (published, sort_order);
CREATE INDEX IF NOT EXISTS testimonials_published_sort_idx ON testimonials (published, sort_order);

CREATE INDEX IF NOT EXISTS admin_invites_status_expires_idx ON admin_invites (status, expires_at);

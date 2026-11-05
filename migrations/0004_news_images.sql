-- 0004 — Visuel des actualités (upload Cloudinary depuis le dashboard).

ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS image_url TEXT;

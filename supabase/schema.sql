-- ================================================================
-- BAAM System L (Legal/Asylum) — Supabase Schema
-- Run in order. Safe to re-run (IF NOT EXISTS).
-- ================================================================

-- 1. Consultation / intake form submissions
CREATE TABLE IF NOT EXISTS consultation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL DEFAULT 'asylum-attorney-la',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wechat TEXT,
  email TEXT,
  language TEXT NOT NULL DEFAULT '普通话',
  in_us TEXT,
  has_nta TEXT,
  filed_i589 TEXT,
  past_one_year TEXT,
  has_court_date TEXT,
  court_date DATE,
  nationality TEXT,
  primary_concern TEXT,
  family_members TEXT,
  previous_applications TEXT,
  additional_notes TEXT,
  source TEXT DEFAULT 'consultation',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Contact form quick submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL DEFAULT 'asylum-attorney-la',
  name TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Content entries (for admin CMS — Phase 3)
CREATE TABLE IF NOT EXISTS content_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'zh',
  path TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, locale, path)
);

-- 4. Sites registry
CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  enabled BOOLEAN DEFAULT true,
  supported_locales TEXT[] DEFAULT ARRAY['zh', 'en'],
  default_locale TEXT DEFAULT 'zh',
  herb_store_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site domains
CREATE TABLE IF NOT EXISTS site_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id),
  domain TEXT NOT NULL,
  environment TEXT DEFAULT 'prod',
  is_primary BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, domain, environment)
);

-- 6. SEO pages registry
CREATE TABLE IF NOT EXISTS site_seo_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'zh',
  slug TEXT NOT NULL,
  page_type TEXT NOT NULL, -- 'core-landing', 'service', 'condition', 'resource', 'near-location'
  title TEXT,
  h1 TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  schema_types TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, locale, slug)
);

-- 7. Admin users (for Phase 3)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'editor', -- 'super_admin', 'site_admin', 'editor'
  site_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Media registry (for Phase 3)
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Admin audit logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id TEXT,
  actor_email TEXT,
  action TEXT NOT NULL,
  site_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Content revisions (history for content entries)
CREATE TABLE IF NOT EXISTS content_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL REFERENCES content_entries(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_by TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_by column to content_entries if missing
ALTER TABLE content_entries ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consultation_requests_site ON consultation_requests(site_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_site ON contact_submissions(site_id);
CREATE INDEX IF NOT EXISTS idx_content_entries_site_locale ON content_entries(site_id, locale);
CREATE INDEX IF NOT EXISTS idx_content_entries_path ON content_entries(path);
CREATE INDEX IF NOT EXISTS idx_site_seo_pages_site ON site_seo_pages(site_id, locale);
CREATE INDEX IF NOT EXISTS idx_media_site ON media(site_id);

-- Seed default site
INSERT INTO sites (id, name, enabled, supported_locales, default_locale)
VALUES ('asylum-attorney-la', '宇霞移民服务中心', true, ARRAY['zh', 'en'], 'zh')
ON CONFLICT (id) DO NOTHING;

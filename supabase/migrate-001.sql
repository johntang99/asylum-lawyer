-- Migration 001: Add missing columns and tables
-- Safe to re-run (uses IF NOT EXISTS / IF NOT EXISTS patterns)

-- sites: add missing columns
ALTER TABLE sites ADD COLUMN IF NOT EXISTS domain TEXT;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS herb_store_slug TEXT;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- site_domains: add missing columns
ALTER TABLE site_domains ADD COLUMN IF NOT EXISTS environment TEXT DEFAULT 'prod';
ALTER TABLE site_domains ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE site_domains ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Drop old unique constraint on domain only, add new composite unique
ALTER TABLE site_domains DROP CONSTRAINT IF EXISTS site_domains_domain_key;
-- Create composite unique if not exists (ignore error if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'site_domains_site_id_domain_environment_key'
  ) THEN
    ALTER TABLE site_domains ADD CONSTRAINT site_domains_site_id_domain_environment_key
      UNIQUE (site_id, domain, environment);
  END IF;
END $$;

-- content_entries: add updated_by column
ALTER TABLE content_entries ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id TEXT,
  actor_email TEXT,
  action TEXT NOT NULL,
  site_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- content_revisions table
CREATE TABLE IF NOT EXISTS content_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL REFERENCES content_entries(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_by TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_site ON admin_audit_logs(site_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_content_revisions_entry ON content_revisions(entry_id);

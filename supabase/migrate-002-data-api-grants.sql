-- Migration 002: Supabase Data API explicit grants
-- Context:
-- Supabase is removing implicit Data API access on tables in public schema.
-- New tables must be explicitly granted to roles that access PostgREST/GraphQL.
--
-- This project uses SUPABASE_SERVICE_ROLE_KEY on the server, so we grant
-- Data API access to service_role explicitly.
--
-- Safe to re-run.

-- Schema access for Data API role
GRANT USAGE ON SCHEMA public TO service_role;

-- Existing tables used by this app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.consultation_requests TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_submissions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.content_entries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sites TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.site_domains TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.site_seo_pages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.media TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_audit_logs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.content_revisions TO service_role;

-- Future-proof for identity/serial sequences (if any are added later)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Default privileges for future tables/sequences created by the same owner role
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO service_role;

-- Recommended security baseline: keep RLS enabled on write-heavy tables.
-- service_role bypasses RLS, so server-side API behavior is unchanged.
ALTER TABLE IF EXISTS public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

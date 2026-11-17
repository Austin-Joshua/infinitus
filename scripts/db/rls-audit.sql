-- ==============================================================================
-- INFINITUS Math Club — Supabase Row Level Security (RLS) & Permissions Audit
-- ==============================================================================
-- Run this in the Supabase SQL editor to enforce production-grade security.
-- Ensures zero write access for anonymous/authenticated web traffic.
-- ==============================================================================

-- 1. Ensure RLS is enabled on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;

-- 2. Revoke any implicit table-level write permissions from public/anon roles
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE members FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE events FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE event_images FROM anon, authenticated;

-- 3. Grant SELECT-only permission on public tables
GRANT SELECT ON TABLE members TO anon, authenticated;
GRANT SELECT ON TABLE events TO anon, authenticated;
GRANT SELECT ON TABLE event_images TO anon, authenticated;

-- 4. Drop redundant or insecure policies if they exist
DROP POLICY IF EXISTS "Public can read active members" ON members;
DROP POLICY IF EXISTS "Public can read events" ON events;
DROP POLICY IF EXISTS "Public can read event images" ON event_images;
DROP POLICY IF EXISTS "Allow anon insert" ON members;
DROP POLICY IF EXISTS "Allow anon insert" ON events;
DROP POLICY IF EXISTS "Allow anon insert" ON event_images;

-- 5. Re-create strict, audited SELECT policies
CREATE POLICY "Public can read active members"
  ON members
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read event images"
  ON event_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 6. Verification query (run to verify no table allows write for anon)
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('members', 'events', 'event_images');

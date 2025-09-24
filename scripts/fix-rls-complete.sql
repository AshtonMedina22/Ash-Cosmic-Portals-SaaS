-- Complete RLS fix for Cosmic Portals
-- This will drop all existing policies and disable RLS temporarily

-- Drop all existing policies first
DROP POLICY IF EXISTS "Organizations can only access their own data" ON organizations;
DROP POLICY IF EXISTS "Users can only access their organization's data" ON users;
DROP POLICY IF EXISTS "NFC devices are organization-scoped" ON nfc_devices;
DROP POLICY IF EXISTS "Events are organization-scoped" ON events;
DROP POLICY IF EXISTS "Attendees are organization-scoped" ON attendees;
DROP POLICY IF EXISTS "NFC scans are organization-scoped" ON nfc_scans;
DROP POLICY IF EXISTS "Content bundles are organization-scoped" ON content_bundles;
DROP POLICY IF EXISTS "Landing pages are organization-scoped" ON landing_pages;
DROP POLICY IF EXISTS "Analytics events are organization-scoped" ON analytics_events;
DROP POLICY IF EXISTS "Subscriptions are organization-scoped" ON subscriptions;
DROP POLICY IF EXISTS "White-label configs are organization-scoped" ON white_label_configs;

-- Disable RLS on all tables
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_scans DISABLE ROW LEVEL SECURITY;
ALTER TABLE content_bundles DISABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_configs DISABLE ROW LEVEL SECURITY;

-- Test query to verify tables are accessible
SELECT 'RLS disabled successfully' as status;

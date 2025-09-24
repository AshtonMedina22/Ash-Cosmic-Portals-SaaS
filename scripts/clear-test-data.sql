-- Clear test data and start fresh
-- This will remove all the test data we created

-- Delete in reverse order of dependencies (only from tables that exist)
DELETE FROM attendees;
DELETE FROM nfc_scans;
DELETE FROM events;
DELETE FROM nfc_devices;
DELETE FROM users;
DELETE FROM organizations;

-- Verify everything is cleared
SELECT 'Test data cleared successfully' as status;
SELECT COUNT(*) as organization_count FROM organizations;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as nfc_device_count FROM nfc_devices;
SELECT COUNT(*) as event_count FROM events;
SELECT COUNT(*) as attendee_count FROM attendees;

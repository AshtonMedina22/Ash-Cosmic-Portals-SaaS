-- Create test data for Cosmic Portals
-- This will create a sample organization and user

-- Insert test organization
INSERT INTO organizations (name, slug, plan_type, subscription_status, settings, white_label_config)
VALUES (
    'Cosmic Portals Demo',
    'cosmic-portals-demo',
    'professional',
    'active',
    '{"theme": "dark", "branding": "cosmic"}'::jsonb,
    '{"custom_domain": "demo.cosmicportals.com", "logo_url": "https://example.com/logo.png"}'::jsonb
);

-- Get the organization ID for the user
-- Note: In a real app, this would be done programmatically
-- For now, we'll use a placeholder user ID
INSERT INTO users (clerk_id, organization_id, email, first_name, last_name, role, permissions)
VALUES (
    'user_test123',
    (SELECT id FROM organizations WHERE slug = 'cosmic-portals-demo'),
    'demo@cosmicportals.com',
    'Demo',
    'User',
    'owner',
    '{"can_manage_organization": true, "can_manage_users": true, "can_manage_events": true}'::jsonb
);

-- Insert test NFC device
INSERT INTO nfc_devices (organization_id, device_id, device_type, status, metadata)
VALUES (
    (SELECT id FROM organizations WHERE slug = 'cosmic-portals-demo'),
    'nfc_demo_001',
    'business_card',
    'active',
    '{"name": "Demo Business Card", "description": "Test NFC device for demonstration"}'::jsonb
);

-- Insert test event
INSERT INTO events (organization_id, name, description, event_type, start_date, end_date, location, status, settings)
VALUES (
    (SELECT id FROM organizations WHERE slug = 'cosmic-portals-demo'),
    'Cosmic Portals Launch Event',
    'Official launch event for Cosmic Portals SaaS platform',
    'corporate',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '4 hours',
    'Virtual Event',
    'draft',
    '{"max_attendees": 100, "registration_required": true}'::jsonb
);

-- Verify data was inserted
SELECT 'Test data created successfully' as status;
SELECT COUNT(*) as organization_count FROM organizations;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as nfc_device_count FROM nfc_devices;
SELECT COUNT(*) as event_count FROM events;

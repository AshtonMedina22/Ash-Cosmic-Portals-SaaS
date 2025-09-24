-- Create REAL data for Cosmic Portals
-- Using actual user accounts for testing

-- 1. Create Cosmic Portals Master Organization (Your admin account)
INSERT INTO organizations (name, slug, plan_type, subscription_status, settings, white_label_config)
VALUES (
    'Cosmic Portals Master',
    'cosmic-portals-master',
    'enterprise',
    'active',
    '{"theme": "dark", "branding": "cosmic", "master_admin": true}'::jsonb,
    '{"custom_domain": "cosmicportals.com", "logo_url": "https://cosmicportals.com/logo.png"}'::jsonb
);

-- 2. Create Party Time Texas Organization (Your sister company)
INSERT INTO organizations (name, slug, plan_type, subscription_status, settings, white_label_config)
VALUES (
    'Party Time Texas',
    'party-time-texas',
    'professional',
    'active',
    '{"theme": "party", "branding": "party-time-texas", "industry": "event-planning"}'::jsonb,
    '{"custom_domain": "party.partytimetexas.com", "logo_url": "https://partytimetexas.com/logo.png"}'::jsonb
);

-- 3. Create your master admin user (ashtonmedina22@gmail.com)
INSERT INTO users (clerk_id, organization_id, email, first_name, last_name, role, permissions)
VALUES (
    'clerk_master_admin', -- This will be replaced with your actual Clerk ID
    (SELECT id FROM organizations WHERE slug = 'cosmic-portals-master'),
    'ashtonmedina22@gmail.com',
    'Ashton',
    'Medina',
    'owner',
    '{"can_manage_organization": true, "can_manage_users": true, "can_manage_events": true, "can_access_all_organizations": true, "master_admin": true}'::jsonb
);

-- 4. Create your Party Time Texas business admin user (ashton@partytimetexas.com)
INSERT INTO users (clerk_id, organization_id, email, first_name, last_name, role, permissions)
VALUES (
    'clerk_party_time_admin', -- This will be replaced with your actual Clerk ID
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'ashton@partytimetexas.com',
    'Ashton',
    'Medina',
    'owner',
    '{"can_manage_organization": true, "can_manage_users": true, "can_manage_events": true, "can_manage_nfc_devices": true}'::jsonb
);

-- 5. Create Party Time Texas NFC devices (real business use case)
INSERT INTO nfc_devices (organization_id, device_id, device_type, status, metadata)
VALUES 
(
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'ptt_business_card_001',
    'business_card',
    'active',
    '{"name": "Ashton Medina Business Card", "description": "Party Time Texas business card for networking", "contact_info": {"phone": "+1-555-PARTY", "email": "ashton@partytimetexas.com"}}'::jsonb
),
(
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'ptt_wedding_sign_001',
    'signage',
    'active',
    '{"name": "Wedding Welcome Sign", "description": "NFC-enabled welcome sign for wedding events", "event_type": "wedding"}'::jsonb
),
(
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'ptt_corporate_badge_001',
    'event_badge',
    'active',
    '{"name": "Corporate Event Badge", "description": "NFC badge for corporate events", "event_type": "corporate"}'::jsonb
);

-- 6. Create Party Time Texas events (real business scenarios)
INSERT INTO events (organization_id, name, description, event_type, start_date, end_date, location, status, settings)
VALUES 
(
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'Smith Wedding Reception',
    'Elegant wedding reception with 150 guests',
    'wedding',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '6 hours',
    'The Grand Ballroom, Dallas TX',
    'confirmed',
    '{"max_attendees": 150, "registration_required": true, "meal_choices": ["chicken", "beef", "vegetarian"], "plus_ones_allowed": true}'::jsonb
),
(
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'TechCorp Annual Gala',
    'Annual corporate gala for 300 employees',
    'corporate',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days' + INTERVAL '4 hours',
    'Convention Center, Austin TX',
    'draft',
    '{"max_attendees": 300, "registration_required": true, "dress_code": "black_tie", "networking_focused": true}'::jsonb
);

-- 7. Create some test attendees for the wedding
INSERT INTO attendees (event_id, organization_id, name, email, phone, plus_ones, meal_choice, dietary_restrictions, metadata)
VALUES 
(
    (SELECT id FROM events WHERE name = 'Smith Wedding Reception'),
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'John Smith',
    'john.smith@email.com',
    '+1-555-0123',
    1,
    'beef',
    'None',
    '{"rsvp_date": "2024-01-15", "guest_name": "Jane Smith"}'::jsonb
),
(
    (SELECT id FROM events WHERE name = 'Smith Wedding Reception'),
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'Sarah Johnson',
    'sarah.johnson@email.com',
    '+1-555-0456',
    0,
    'chicken',
    'Gluten-free',
    '{"rsvp_date": "2024-01-16", "special_requests": "High chair needed"}'::jsonb
);

-- Verify data was inserted
SELECT 'Real data created successfully' as status;
SELECT 'Organizations:' as label, COUNT(*) as count FROM organizations;
SELECT 'Users:' as label, COUNT(*) as count FROM users;
SELECT 'NFC Devices:' as label, COUNT(*) as count FROM nfc_devices;
SELECT 'Events:' as label, COUNT(*) as count FROM events;
SELECT 'Attendees:' as label, COUNT(*) as count FROM attendees;

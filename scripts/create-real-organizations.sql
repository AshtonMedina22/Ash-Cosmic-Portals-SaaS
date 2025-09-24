-- Create real organizations for your accounts
-- This will create the organizations without test data

-- 1. Create Cosmic Portals Master Organization
INSERT INTO organizations (name, slug, plan_type, subscription_status, settings, white_label_config)
VALUES (
    'Cosmic Portals Master',
    'cosmic-portals-master',
    'enterprise',
    'active',
    '{"theme": "dark", "branding": "cosmic", "master_admin": true}'::jsonb,
    '{"custom_domain": "cosmicportals.com"}'::jsonb
);

-- 2. Create Party Time Texas Organization
INSERT INTO organizations (name, slug, plan_type, subscription_status, settings, white_label_config)
VALUES (
    'Party Time Texas',
    'party-time-texas',
    'professional',
    'active',
    '{"theme": "party", "branding": "party-time-texas", "industry": "event-planning"}'::jsonb,
    '{"custom_domain": "party.partytimetexas.com"}'::jsonb
);

-- 3. Create your master admin user
INSERT INTO users (clerk_id, organization_id, email, first_name, last_name, role, permissions)
VALUES (
    'user_339NGNvs776RVVWRdLkI1HbY7Y6',
    (SELECT id FROM organizations WHERE slug = 'cosmic-portals-master'),
    'ashtonmedina22@gmail.com',
    'Ashton',
    'Medina',
    'owner',
    '{"can_manage_organization": true, "can_manage_users": true, "can_manage_events": true, "can_access_all_organizations": true, "master_admin": true}'::jsonb
);

-- 4. Create your Party Time Texas business admin user
INSERT INTO users (clerk_id, organization_id, email, first_name, last_name, role, permissions)
VALUES (
    'user_339gbDa0AgrHZrm4IFR0qdX5RYm',
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'ashton@partytimetexas.com',
    'Ashton',
    'Medina',
    'owner',
    '{"can_manage_organization": true, "can_manage_users": true, "can_manage_events": true, "can_manage_nfc_devices": true}'::jsonb
);

-- Verify the setup
SELECT 'Real organizations created successfully' as status;
SELECT name, slug, plan_type FROM organizations;
SELECT email, first_name, last_name, role FROM users;

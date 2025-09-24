-- Manual registration of Party Time Texas keychain
-- This will add your keychain to the database so you can start tracking analytics

-- First, let's check if the organization exists
SELECT 'Party Time Texas organization found' as status, name, slug 
FROM organizations 
WHERE slug = 'party-time-texas';

-- Register the keychain device
INSERT INTO nfc_devices (organization_id, device_id, device_type, status, metadata)
VALUES (
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'ptt_keychain_' || extract(epoch from now())::bigint,
    'business_card',
    'active',
    '{
        "name": "Party Time Texas Keychain",
        "description": "Official Party Time Texas keychain with NFC",
        "assigned_to": "Ashton Medina",
        "contact_email": "ashton@partytimetexas.com",
        "programmed_by": "Cosmic Portals",
        "programmed_date": "' || now()::text || '",
        "device_type": "keychain",
        "physical_device": true,
        "manual_registration": true
    }'::jsonb
);

-- Verify the device was added
SELECT 'Party Time Texas keychain registered successfully' as status;
SELECT 
    device_id, 
    device_type, 
    status, 
    metadata->>'name' as name,
    metadata->>'assigned_to' as assigned_to,
    created_at
FROM nfc_devices 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'party-time-texas')
ORDER BY created_at DESC;

-- Manually register your Party Time Texas keychain
-- This will add it to your account so you can start tracking analytics

INSERT INTO nfc_devices (organization_id, device_id, device_type, status, metadata)
VALUES (
    (SELECT id FROM organizations WHERE slug = 'party-time-texas'),
    'ptt_keychain_001',
    'business_card',
    'active',
    '{
        "name": "Party Time Texas Keychain",
        "description": "Official Party Time Texas keychain with NFC",
        "assigned_to": "Ashton Medina",
        "contact_email": "ashton@partytimetexas.com",
        "programmed_by": "Cosmic Portals",
        "programmed_date": "2024-01-24T00:00:00.000Z",
        "device_type": "keychain",
        "physical_device": true
    }'::jsonb
);

-- Verify the device was added
SELECT 'Party Time Texas keychain registered successfully' as status;
SELECT device_id, device_type, status, metadata->>'name' as name 
FROM nfc_devices 
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'party-time-texas');

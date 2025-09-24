-- Update Party Time Texas to reflect corporate business capabilities
-- This will update the organization settings to show it's a full corporate business

UPDATE organizations 
SET 
  settings = '{"theme": "corporate", "branding": "party-time-texas", "industry": "corporate-engagement", "business_type": "corporate", "capabilities": ["landing_pages", "nfc_tracking", "analytics", "events", "multi_tenant"]}'::jsonb,
  white_label_config = '{"custom_domain": "party.partytimetexas.com", "corporate_features": true, "landing_pages": true, "nfc_tracking": true, "analytics": true}'::jsonb
WHERE slug = 'party-time-texas';

-- Verify the update
SELECT name, slug, plan_type, settings, white_label_config 
FROM organizations 
WHERE slug = 'party-time-texas';

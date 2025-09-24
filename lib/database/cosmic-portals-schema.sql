-- Cosmic Portals Database Schema
-- Multi-tenant SaaS platform for NFC engagement and event management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations (Multi-tenant root)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'starter',
    subscription_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}',
    white_label_config JSONB DEFAULT '{}'
);

-- Users (Clerk integration)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'member',
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFC Devices
CREATE TABLE nfc_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    device_id VARCHAR(255) UNIQUE NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- 'business_card', 'signage', 'event_badge'
    status VARCHAR(50) DEFAULT 'active',
    last_scan TIMESTAMP WITH TIME ZONE,
    scan_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'business', 'wedding', 'corporate', 'school', 'nonprofit'
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Attendees
CREATE TABLE attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    photo_url TEXT,
    plus_ones INTEGER DEFAULT 0,
    meal_choice VARCHAR(100),
    dietary_restrictions TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFC Scans (Analytics)
CREATE TABLE nfc_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    device_id UUID REFERENCES nfc_devices(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scan_type VARCHAR(50) NOT NULL, -- 'nfc_tap', 'qr_scan', 'link_click'
    ip_address INET,
    user_agent TEXT,
    location_data JSONB,
    utm_params JSONB,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Bundles (Photos, Documents)
CREATE TABLE content_bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bundle_type VARCHAR(50) NOT NULL, -- 'photo_gallery', 'document_pack', 'media_kit'
    files JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events (Detailed tracking)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    page_url TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    location JSONB,
    custom_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing Pages (Custom pages with tracking)
CREATE TABLE landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    settings JSONB DEFAULT '{}',
    tracking_enabled BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- Subscriptions and Billing
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- White-label Customizations
CREATE TABLE white_label_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    custom_domain VARCHAR(255),
    custom_css TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_nfc_devices_organization_id ON nfc_devices(organization_id);
CREATE INDEX idx_nfc_devices_device_id ON nfc_devices(device_id);
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_attendees_event_id ON attendees(event_id);
CREATE INDEX idx_attendees_organization_id ON attendees(organization_id);
CREATE INDEX idx_nfc_scans_organization_id ON nfc_scans(organization_id);
CREATE INDEX idx_nfc_scans_created_at ON nfc_scans(created_at);
CREATE INDEX idx_analytics_events_organization_id ON analytics_events(organization_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_landing_pages_organization_id ON landing_pages(organization_id);
CREATE INDEX idx_landing_pages_slug ON landing_pages(organization_id, slug);

-- Row Level Security (RLS) Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for multi-tenant isolation
CREATE POLICY "Users can only access their organization's data" ON users
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Organizations can only access their own data" ON organizations
    FOR ALL USING (id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "NFC devices are organization-scoped" ON nfc_devices
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Events are organization-scoped" ON events
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Attendees are organization-scoped" ON attendees
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "NFC scans are organization-scoped" ON nfc_scans
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Content bundles are organization-scoped" ON content_bundles
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Analytics events are organization-scoped" ON analytics_events
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Landing pages are organization-scoped" ON landing_pages
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Subscriptions are organization-scoped" ON subscriptions
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "White-label configs are organization-scoped" ON white_label_configs
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ));

-- Functions for analytics aggregation
CREATE OR REPLACE FUNCTION get_organization_analytics(org_id UUID, start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_scans', COUNT(*),
        'unique_devices', COUNT(DISTINCT device_id),
        'scan_types', jsonb_object_agg(scan_type, scan_count),
        'daily_breakdown', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', date_trunc('day', created_at),
                    'scans', COUNT(*)
                )
            )
            FROM nfc_scans 
            WHERE organization_id = org_id 
            AND created_at BETWEEN start_date AND end_date
            GROUP BY date_trunc('day', created_at)
            ORDER BY date_trunc('day', created_at)
        )
    ) INTO result
    FROM (
        SELECT device_id, scan_type, COUNT(*) as scan_count
        FROM nfc_scans 
        WHERE organization_id = org_id 
        AND created_at BETWEEN start_date AND end_date
        GROUP BY device_id, scan_type
    ) scan_summary;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nfc_devices_updated_at BEFORE UPDATE ON nfc_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendees_updated_at BEFORE UPDATE ON attendees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_bundles_updated_at BEFORE UPDATE ON content_bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_white_label_configs_updated_at BEFORE UPDATE ON white_label_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

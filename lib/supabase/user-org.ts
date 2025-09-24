// User and Organization utilities for Cosmic Portals
import { supabase } from './client';

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan_type: string;
  subscription_status: string;
  settings: any;
  white_label_config: any;
}

export interface OrganizationData {
  user: User;
  organization: Organization;
  nfcDevices: any[];
  events: any[];
  attendees: any[];
}

/**
 * Get user and organization data by Clerk user ID
 */
export async function getUserOrganizationData(clerkUserId: string): Promise<OrganizationData | null> {
  try {
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUserId)
      .single();

    if (userError || !user) {
      console.error('User not found:', userError);
      return null;
    }

    // Get organization data
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', user.organization_id)
      .single();

    if (orgError || !organization) {
      console.error('Organization not found:', orgError);
      return null;
    }

    // Get NFC devices for this organization
    const { data: nfcDevices, error: devicesError } = await supabase
      .from('nfc_devices')
      .select('*')
      .eq('organization_id', user.organization_id);

    // Get events for this organization
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('organization_id', user.organization_id);

    // Get attendees for this organization
    const { data: attendees, error: attendeesError } = await supabase
      .from('attendees')
      .select('*')
      .eq('organization_id', user.organization_id);

    return {
      user,
      organization,
      nfcDevices: nfcDevices || [],
      events: events || [],
      attendees: attendees || [],
    };
  } catch (error) {
    console.error('Error fetching user organization data:', error);
    return null;
  }
}

/**
 * Get organization statistics
 */
export async function getOrganizationStats(organizationId: string) {
  try {
    const [nfcDevices, events, attendees, nfcScans] = await Promise.all([
      supabase.from('nfc_devices').select('*').eq('organization_id', organizationId),
      supabase.from('events').select('*').eq('organization_id', organizationId),
      supabase.from('attendees').select('*').eq('organization_id', organizationId),
      supabase.from('nfc_scans').select('*').eq('organization_id', organizationId),
    ]);

    return {
      nfcDevices: nfcDevices.data?.length || 0,
      events: events.data?.length || 0,
      attendees: attendees.data?.length || 0,
      totalScans: nfcScans.data?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    return {
      nfcDevices: 0,
      events: 0,
      attendees: 0,
      totalScans: 0,
    };
  }
}

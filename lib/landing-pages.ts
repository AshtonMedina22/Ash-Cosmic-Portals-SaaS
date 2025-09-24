/**
 * Landing Page Management for Cosmic Portals
 */

import { supabase } from './supabase/client';

export interface LandingPage {
  id?: string;
  organization_id: string;
  name: string;
  slug: string;
  content: {
    title: string;
    subtitle: string;
    description: string;
    contact: {
      email: string;
      phone: string;
      website: string;
    };
    social: {
      facebook: string;
      instagram: string;
      linkedin: string;
    };
    branding: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
  };
  status: 'draft' | 'published' | 'archived';
  permissions: {
    owner_id: string;
    editors: string[];
    viewers: string[];
  };
  created_at?: string;
  updated_at?: string;
  scan_count?: number;
  last_scan?: string;
}

export interface PageTemplate {
  id: string;
  name: string;
  category: string;
  content: LandingPage['content'];
  preview_image: string;
}

export const createLandingPage = async (page: Omit<LandingPage, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .insert([page])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getLandingPage = async (id: string) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getLandingPageBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
};

export const updateLandingPage = async (id: string, updates: Partial<LandingPage>) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteLandingPage = async (id: string) => {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
};

export const getAllLandingPages = async () => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      organizations (
        id,
        name,
        owner_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getOrganizationLandingPages = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getUserLandingPages = async (userId: string) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select(`
      *,
      organizations (
        id,
        name
      )
    `)
    .or(`permissions->owner_id.eq.${userId},permissions->editors.cs.{${userId}},permissions->viewers.cs.{${userId}}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updatePagePermissions = async (pageId: string, permissions: LandingPage['permissions']) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .update({ permissions })
    .eq('id', pageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const recordPageScan = async (pageId: string, scanData: {
  ip_address?: string;
  user_agent?: string;
  location_data?: Record<string, any>;
  utm_params?: Record<string, any>;
  referrer?: string;
}) => {
  // Record the scan
  const { data: scan, error: scanError } = await supabase
    .from('landing_page_scans')
    .insert({
      page_id: pageId,
      ip_address: scanData.ip_address,
      user_agent: scanData.user_agent,
      location_data: scanData.location_data,
      utm_params: scanData.utm_params,
      referrer: scanData.referrer
    })
    .select()
    .single();

  if (scanError) throw scanError;

  // Update page scan count
  const { error: updateError } = await supabase
    .from('landing_pages')
    .update({ 
      scan_count: supabase.raw('scan_count + 1'),
      last_scan: new Date().toISOString()
    })
    .eq('id', pageId);

  if (updateError) throw updateError;

  return scan;
};

export const getPageAnalytics = async (pageId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('landing_page_scans')
    .select('*')
    .eq('page_id', pageId);

  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  const { data: scans, error } = await query;
  if (error) throw error;

  const total_scans = scans?.length || 0;
  
  // Daily breakdown
  const dailyMap = new Map<string, number>();
  scans?.forEach(scan => {
    const date = scan.created_at.split('T')[0];
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  });
  const daily_scans = Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count }));

  // Geographic breakdown
  const locationMap = new Map<string, number>();
  scans?.forEach(scan => {
    if (scan.location_data?.country) {
      const country = scan.location_data.country;
      locationMap.set(country, (locationMap.get(country) || 0) + 1);
    }
  });
  const top_locations = Array.from(locationMap.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Device breakdown
  const deviceMap = new Map<string, number>();
  scans?.forEach(scan => {
    if (scan.user_agent) {
      const device = scan.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop';
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    }
  });
  const device_breakdown = Array.from(deviceMap.entries()).map(([device, count]) => ({ device, count }));

  return {
    total_scans,
    daily_scans,
    top_locations,
    device_breakdown
  };
};

// Template management
export const getPageTemplates = async () => {
  const { data, error } = await supabase
    .from('page_templates')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
};

export const createPageTemplate = async (template: Omit<PageTemplate, 'id'>) => {
  const { data, error } = await supabase
    .from('page_templates')
    .insert([template])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const generatePageSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const validatePageSlug = async (slug: string, excludeId?: string): Promise<boolean> => {
  let query = supabase
    .from('landing_pages')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return data.length === 0;
};

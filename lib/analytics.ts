/**
 * Analytics System for Cosmic Portals
 */

import { createClient } from './supabase/client';

export interface AnalyticsEvent {
  id: string;
  organization_id: string;
  event_type: string;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  location?: Record<string, any>;
  custom_data?: Record<string, any>;
  created_at: string;
}

export interface AnalyticsDashboard {
  total_events: number;
  total_scans: number;
  unique_users: number;
  conversion_rate: number;
  top_events: Array<{ event_type: string; count: number }>;
  daily_activity: Array<{ date: string; events: number; scans: number }>;
  device_breakdown: Record<string, number>;
  location_breakdown: Record<string, number>;
}

export interface UTMData {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export class AnalyticsService {
  private supabase = createClient();

  /**
   * Track an analytics event
   */
  async trackEvent(data: {
    organization_id: string;
    event_type: string;
    user_id?: string;
    session_id?: string;
    page_url?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    location?: Record<string, any>;
    custom_data?: Record<string, any>;
  }): Promise<AnalyticsEvent> {
    const { data: event, error } = await this.supabase
      .from('analytics_events')
      .insert({
        organization_id: data.organization_id,
        event_type: data.event_type,
        user_id: data.user_id,
        session_id: data.session_id,
        page_url: data.page_url,
        referrer: data.referrer,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        device_type: data.device_type,
        browser: data.browser,
        os: data.os,
        location: data.location,
        custom_data: data.custom_data
      })
      .select()
      .single();

    if (error) throw error;
    return event;
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboardData(organizationId: string, startDate?: string, endDate?: string): Promise<AnalyticsDashboard> {
    let query = this.supabase
      .from('analytics_events')
      .select('*')
      .eq('organization_id', organizationId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    const total_events = events?.length || 0;
    const unique_users = new Set(events?.map(e => e.user_id).filter(Boolean)).size;
    
    // Calculate conversion rate (simplified)
    const conversion_events = events?.filter(e => e.event_type === 'conversion').length || 0;
    const conversion_rate = total_events > 0 ? (conversion_events / total_events) * 100 : 0;

    // Top events breakdown
    const eventTypeMap = new Map<string, number>();
    events?.forEach(event => {
      eventTypeMap.set(event.event_type, (eventTypeMap.get(event.event_type) || 0) + 1);
    });
    const top_events = Array.from(eventTypeMap.entries())
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Daily activity
    const dailyMap = new Map<string, { events: number; scans: number }>();
    events?.forEach(event => {
      const date = event.created_at.split('T')[0];
      const current = dailyMap.get(date) || { events: 0, scans: 0 };
      current.events += 1;
      if (event.event_type === 'nfc_scan') {
        current.scans += 1;
      }
      dailyMap.set(date, current);
    });
    const daily_activity = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Device breakdown
    const deviceMap = new Map<string, number>();
    events?.forEach(event => {
      if (event.device_type) {
        deviceMap.set(event.device_type, (deviceMap.get(event.device_type) || 0) + 1);
      }
    });
    const device_breakdown = Object.fromEntries(deviceMap);

    // Location breakdown
    const locationMap = new Map<string, number>();
    events?.forEach(event => {
      if (event.location?.country) {
        locationMap.set(event.location.country, (locationMap.get(event.location.country) || 0) + 1);
      }
    });
    const location_breakdown = Object.fromEntries(locationMap);

    return {
      total_events,
      total_scans: events?.filter(e => e.event_type === 'nfc_scan').length || 0,
      unique_users,
      conversion_rate,
      top_events,
      daily_activity,
      device_breakdown,
      location_breakdown
    };
  }

  /**
   * Get UTM campaign performance
   */
  async getUTMPerformance(organizationId: string, startDate?: string, endDate?: string): Promise<Array<{
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    events: number;
    unique_users: number;
    conversion_rate: number;
  }>> {
    let query = this.supabase
      .from('analytics_events')
      .select('utm_source, utm_medium, utm_campaign, user_id, event_type')
      .eq('organization_id', organizationId)
      .not('utm_source', 'is', null);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    // Group by UTM parameters
    const utmGroups = new Map<string, {
      utm_source: string;
      utm_medium: string;
      utm_campaign: string;
      events: AnalyticsEvent[];
    }>();

    events?.forEach(event => {
      const key = `${event.utm_source}-${event.utm_medium}-${event.utm_campaign}`;
      if (!utmGroups.has(key)) {
        utmGroups.set(key, {
          utm_source: event.utm_source || '',
          utm_medium: event.utm_medium || '',
          utm_campaign: event.utm_campaign || '',
          events: []
        });
      }
      utmGroups.get(key)?.events.push(event);
    });

    return Array.from(utmGroups.values()).map(group => {
      const events = group.events;
      const unique_users = new Set(events.map(e => e.user_id).filter(Boolean)).size;
      const conversions = events.filter(e => e.event_type === 'conversion').length;
      const conversion_rate = events.length > 0 ? (conversions / events.length) * 100 : 0;

      return {
        utm_source: group.utm_source,
        utm_medium: group.utm_medium,
        utm_campaign: group.utm_campaign,
        events: events.length,
        unique_users,
        conversion_rate
      };
    }).sort((a, b) => b.events - a.events);
  }

  /**
   * Export analytics data
   */
  async exportAnalyticsData(organizationId: string, startDate?: string, endDate?: string): Promise<string> {
    let query = this.supabase
      .from('analytics_events')
      .select('*')
      .eq('organization_id', organizationId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    const headers = [
      'Date',
      'Event Type',
      'User ID',
      'Page URL',
      'Referrer',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Device Type',
      'Browser',
      'OS',
      'Location'
    ];

    const rows = events?.map(event => [
      event.created_at,
      event.event_type,
      event.user_id || '',
      event.page_url || '',
      event.referrer || '',
      event.utm_source || '',
      event.utm_medium || '',
      event.utm_campaign || '',
      event.device_type || '',
      event.browser || '',
      event.os || '',
      event.location ? JSON.stringify(event.location) : ''
    ]) || [];

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  /**
   * Parse UTM parameters from URL
   */
  parseUTMParameters(url: string): UTMData | null {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;
      
      const utm_source = params.get('utm_source');
      const utm_medium = params.get('utm_medium');
      const utm_campaign = params.get('utm_campaign');
      
      if (!utm_source || !utm_medium || !utm_campaign) {
        return null;
      }

      return {
        source: utm_source,
        medium: utm_medium,
        campaign: utm_campaign,
        term: params.get('utm_term') || undefined,
        content: params.get('utm_content') || undefined
      };
    } catch {
      return null;
    }
  }

  /**
   * Get device information from user agent
   */
  parseUserAgent(userAgent: string): { device_type: string; browser: string; os: string } {
    const device_type = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';
    
    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    let os = 'unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { device_type, browser, os };
  }
}

export default AnalyticsService;
/**
 * NFC Device Management for Cosmic Portals
 */

import { supabase } from './supabase/client';

export interface NFCDevice {
  id: string;
  organization_id: string;
  device_id: string;
  device_type: 'business_card' | 'signage' | 'event_badge' | 'table_tent';
  status: 'active' | 'inactive' | 'maintenance';
  last_scan?: string;
  scan_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NFCScan {
  id: string;
  organization_id: string;
  device_id: string;
  event_id?: string;
  user_id?: string;
  scan_type: 'nfc_tap' | 'qr_scan' | 'link_click';
  ip_address?: string;
  user_agent?: string;
  location_data?: Record<string, any>;
  utm_params?: Record<string, any>;
  referrer?: string;
  created_at: string;
}

export class NFCService {
  private supabase = supabase;

  /**
   * Register a new NFC device
   */
  async registerDevice(data: {
    organization_id: string;
    device_id: string;
    device_type: string;
    metadata?: Record<string, any>;
  }): Promise<NFCDevice> {
    const { data: device, error } = await this.supabase
      .from('nfc_devices')
      .insert({
        organization_id: data.organization_id,
        device_id: data.device_id,
        device_type: data.device_type,
        status: 'active',
        scan_count: 0,
        metadata: data.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;
    return device;
  }

  /**
   * Get all devices for an organization
   */
  async getOrganizationDevices(organizationId: string): Promise<NFCDevice[]> {
    const { data, error } = await this.supabase
      .from('nfc_devices')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get device by ID
   */
  async getDevice(deviceId: string): Promise<NFCDevice | null> {
    const { data, error } = await this.supabase
      .from('nfc_devices')
      .select('*')
      .eq('id', deviceId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Update device
   */
  async updateDevice(deviceId: string, updates: Partial<NFCDevice>): Promise<NFCDevice> {
    const { data, error } = await this.supabase
      .from('nfc_devices')
      .update(updates)
      .eq('id', deviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Record NFC scan
   */
  async recordScan(data: {
    organization_id: string;
    device_id: string;
    event_id?: string;
    user_id?: string;
    scan_type: string;
    ip_address?: string;
    user_agent?: string;
    location_data?: Record<string, any>;
    utm_params?: Record<string, any>;
    referrer?: string;
  }): Promise<NFCScan> {
    // Record the scan
    const { data: scan, error: scanError } = await this.supabase
      .from('nfc_scans')
      .insert({
        organization_id: data.organization_id,
        device_id: data.device_id,
        event_id: data.event_id,
        user_id: data.user_id,
        scan_type: data.scan_type,
        ip_address: data.ip_address,
        user_agent: data.user_agent,
        location_data: data.location_data,
        utm_params: data.utm_params,
        referrer: data.referrer
      })
      .select()
      .single();

    if (scanError) throw scanError;

    // Update device scan count
    await this.supabase
      .from('nfc_devices')
      .update({ 
        scan_count: this.supabase.raw('scan_count + 1'),
        last_scan: new Date().toISOString()
      })
      .eq('id', data.device_id);

    return scan;
  }

  /**
   * Get scan analytics for a device
   */
  async getDeviceAnalytics(deviceId: string, startDate?: string, endDate?: string): Promise<{
    total_scans: number;
    daily_scans: Array<{ date: string; count: number }>;
    scan_types: Record<string, number>;
    top_referrers: Array<{ referrer: string; count: number }>;
  }> {
    let query = this.supabase
      .from('nfc_scans')
      .select('*')
      .eq('device_id', deviceId);

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

    // Scan types breakdown
    const scanTypes: Record<string, number> = {};
    scans?.forEach(scan => {
      scanTypes[scan.scan_type] = (scanTypes[scan.scan_type] || 0) + 1;
    });

    // Top referrers
    const referrerMap = new Map<string, number>();
    scans?.forEach(scan => {
      if (scan.referrer) {
        referrerMap.set(scan.referrer, (referrerMap.get(scan.referrer) || 0) + 1);
      }
    });
    const top_referrers = Array.from(referrerMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total_scans,
      daily_scans,
      scan_types: scanTypes,
      top_referrers
    };
  }

  /**
   * Generate QR code for device
   */
  generateQRCode(deviceId: string, baseUrl: string): string {
    return `${baseUrl}/scan/${deviceId}`;
  }

  /**
   * Generate NFC URL
   */
  generateNFCUrl(deviceId: string, baseUrl: string): string {
    return `${baseUrl}/nfc/${deviceId}`;
  }
}

export default NFCService;

// Export individual functions for easier importing
const nfcService = new NFCService();

export const registerNFCDevice = nfcService.registerDevice.bind(nfcService);
export const getNFCDevices = nfcService.getOrganizationDevices.bind(nfcService);
export const getNFCDevice = nfcService.getDevice.bind(nfcService);
export const updateNFCDevice = nfcService.updateDevice.bind(nfcService);
export const deleteNFCDevice = async (deviceId: string) => {
  const { error } = await nfcService.supabase
    .from('nfc_devices')
    .delete()
    .eq('id', deviceId);
  if (error) throw error;
  return { success: true };
};
export const recordNFCScan = nfcService.recordScan.bind(nfcService);
export const getNFCScanAnalytics = nfcService.getDeviceAnalytics.bind(nfcService);
export const generateQRCode = nfcService.generateQRCode.bind(nfcService);
export const generateNFCUrl = nfcService.generateNFCUrl.bind(nfcService);
/**
 * GDPR & Compliance System for Cosmic Portals
 * Handles consent management, cookie consent, and right-to-forget workflows
 */

import { createClient } from './supabase/client';

export interface ConsentRecord {
  id: string;
  user_id: string;
  organization_id: string;
  consent_type: 'marketing' | 'analytics' | 'functional' | 'necessary';
  granted: boolean;
  granted_at: string;
  ip_address: string;
  user_agent: string;
  consent_version: string;
  created_at: string;
}

export interface DataSubjectRequest {
  id: string;
  user_id: string;
  organization_id: string;
  request_type: 'access' | 'portability' | 'rectification' | 'erasure' | 'restriction';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  description: string;
  requested_at: string;
  completed_at?: string;
  response_data?: any;
}

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: Record<string, any>;
}

export class ComplianceService {
  private supabase = createClient();

  /**
   * Record user consent
   */
  async recordConsent(data: {
    user_id: string;
    organization_id: string;
    consent_type: string;
    granted: boolean;
    ip_address: string;
    user_agent: string;
  }): Promise<ConsentRecord> {
    const { data: consent, error } = await this.supabase
      .from('consent_records')
      .insert({
        user_id: data.user_id,
        organization_id: data.organization_id,
        consent_type: data.consent_type,
        granted: data.granted,
        granted_at: data.granted ? new Date().toISOString() : null,
        ip_address: data.ip_address,
        user_agent: data.user_agent,
        consent_version: '1.0'
      })
      .select()
      .single();

    if (error) throw error;
    return consent;
  }

  /**
   * Get user consent status
   */
  async getUserConsent(userId: string, organizationId: string): Promise<CookieConsent> {
    const { data: consents } = await this.supabase
      .from('consent_records')
      .select('consent_type, granted')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    const consentMap = new Map();
    consents?.forEach(consent => {
      if (!consentMap.has(consent.consent_type)) {
        consentMap.set(consent.consent_type, consent.granted);
      }
    });

    return {
      necessary: consentMap.get('necessary') ?? true, // Always true
      functional: consentMap.get('functional') ?? false,
      analytics: consentMap.get('analytics') ?? false,
      marketing: consentMap.get('marketing') ?? false,
      preferences: {}
    };
  }

  /**
   * Create data subject request
   */
  async createDataSubjectRequest(data: {
    user_id: string;
    organization_id: string;
    request_type: string;
    description: string;
  }): Promise<DataSubjectRequest> {
    const { data: request, error } = await this.supabase
      .from('data_subject_requests')
      .insert({
        user_id: data.user_id,
        organization_id: data.organization_id,
        request_type: data.request_type,
        status: 'pending',
        description: data.description,
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return request;
  }

  /**
   * Process data subject request
   */
  async processDataSubjectRequest(requestId: string): Promise<DataSubjectRequest> {
    const { data: request } = await this.supabase
      .from('data_subject_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) throw new Error('Request not found');

    let responseData: any = {};

    switch (request.request_type) {
      case 'access':
        responseData = await this.generateDataExport(request.user_id, request.organization_id);
        break;
      case 'portability':
        responseData = await this.generateDataPortability(request.user_id, request.organization_id);
        break;
      case 'erasure':
        await this.executeDataErasure(request.user_id, request.organization_id);
        responseData = { message: 'Data erased successfully' };
        break;
      case 'rectification':
        // This would be handled by the user updating their profile
        responseData = { message: 'Please update your profile information' };
        break;
      case 'restriction':
        await this.restrictDataProcessing(request.user_id, request.organization_id);
        responseData = { message: 'Data processing restricted' };
        break;
    }

    const { data: updatedRequest, error } = await this.supabase
      .from('data_subject_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        response_data: responseData
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return updatedRequest;
  }

  /**
   * Generate data export for access request
   */
  private async generateDataExport(userId: string, organizationId: string): Promise<any> {
    const [userData, events, scans, analytics] = await Promise.all([
      this.supabase.from('users').select('*').eq('id', userId).single(),
      this.supabase.from('events').select('*').eq('organization_id', organizationId),
      this.supabase.from('nfc_scans').select('*').eq('user_id', userId),
      this.supabase.from('analytics_events').select('*').eq('user_id', userId)
    ]);

    return {
      personal_data: userData.data,
      events: events.data,
      scans: scans.data,
      analytics: analytics.data,
      exported_at: new Date().toISOString()
    };
  }

  /**
   * Generate data portability export
   */
  private async generateDataPortability(userId: string, organizationId: string): Promise<any> {
    const exportData = await this.generateDataExport(userId, organizationId);
    
    return {
      ...exportData,
      format: 'json',
      version: '1.0',
      compatible_platforms: ['cosmic-portals', 'general-json']
    };
  }

  /**
   * Execute data erasure (right to be forgotten)
   */
  private async executeDataErasure(userId: string, organizationId: string): Promise<void> {
    // Delete user data across all tables
    await Promise.all([
      this.supabase.from('users').delete().eq('id', userId),
      this.supabase.from('nfc_scans').delete().eq('user_id', userId),
      this.supabase.from('analytics_events').delete().eq('user_id', userId),
      this.supabase.from('consent_records').delete().eq('user_id', userId),
      this.supabase.from('data_subject_requests').delete().eq('user_id', userId)
    ]);
  }

  /**
   * Restrict data processing
   */
  private async restrictDataProcessing(userId: string, organizationId: string): Promise<void> {
    // Mark user as restricted
    await this.supabase
      .from('users')
      .update({ 
        data_processing_restricted: true,
        restricted_at: new Date().toISOString()
      })
      .eq('id', userId);
  }

  /**
   * Generate privacy policy
   */
  generatePrivacyPolicy(organizationId: string): string {
    return `
# Privacy Policy for Cosmic Portals

## Data Collection
We collect the following types of data:
- Personal information (name, email, phone)
- Event attendance data
- NFC scan analytics
- Device information
- Location data (with consent)

## Data Processing
Your data is processed for:
- Event management
- Analytics and insights
- Service improvement
- Communication

## Your Rights
Under GDPR, you have the right to:
- Access your data
- Rectify inaccurate data
- Erase your data
- Restrict processing
- Data portability
- Object to processing

## Data Retention
We retain your data for:
- Active accounts: Duration of service
- Inactive accounts: 2 years
- Analytics data: 5 years (anonymized)

## Contact
For data requests, contact: privacy@cosmic-portals.com
    `;
  }

  /**
   * Generate cookie policy
   */
  generateCookiePolicy(): string {
    return `
# Cookie Policy for Cosmic Portals

## Necessary Cookies
Required for basic website functionality.

## Functional Cookies
Enhance user experience and remember preferences.

## Analytics Cookies
Help us understand how visitors use our website.

## Marketing Cookies
Used to deliver relevant advertisements.

## Cookie Management
You can manage your cookie preferences in your account settings.
    `;
  }

  /**
   * Check compliance status
   */
  async getComplianceStatus(organizationId: string): Promise<{
    gdpr_compliant: boolean;
    consent_management: boolean;
    data_retention_policy: boolean;
    privacy_policy: boolean;
    cookie_policy: boolean;
    data_subject_requests: number;
    last_audit: string;
  }> {
    const { data: org } = await this.supabase
      .from('organizations')
      .select('compliance_settings')
      .eq('id', organizationId)
      .single();

    const { count: pendingRequests } = await this.supabase
      .from('data_subject_requests')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('status', 'pending');

    return {
      gdpr_compliant: org?.compliance_settings?.gdpr_compliant || false,
      consent_management: org?.compliance_settings?.consent_management || false,
      data_retention_policy: org?.compliance_settings?.data_retention_policy || false,
      privacy_policy: org?.compliance_settings?.privacy_policy || false,
      cookie_policy: org?.compliance_settings?.cookie_policy || false,
      data_subject_requests: pendingRequests || 0,
      last_audit: org?.compliance_settings?.last_audit || 'Never'
    };
  }
}

export default ComplianceService;

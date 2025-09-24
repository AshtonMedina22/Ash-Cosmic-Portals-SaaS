/**
 * White-Label Customization System for Cosmic Portals
 * Handles branding, pricing, and customization features
 */

import { createClient } from './supabase/client';

export interface WhiteLabelConfig {
  id: string;
  organization_id: string;
  client_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  custom_domain?: string;
  custom_css?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhiteLabelPricing {
  plan_type: 'starter' | 'professional' | 'enterprise';
  base_price: number;
  white_label_fee: number;
  total_price: number;
  features: string[];
  limits: {
    max_portals: number;
    max_customizations: number;
    support_level: 'basic' | 'priority' | 'dedicated';
  };
}

export class WhiteLabelService {
  private supabase = createClient();

  /**
   * White-label pricing configuration
   */
  getWhiteLabelPricing(): Record<string, WhiteLabelPricing> {
    return {
      starter: {
        plan_type: 'starter',
        base_price: 29,
        white_label_fee: 15, // $15/month for white-label features
        total_price: 44,
        features: [
          'Custom branding',
          'Logo customization',
          'Color scheme',
          'Basic white-label support'
        ],
        limits: {
          max_portals: 3,
          max_customizations: 5,
          support_level: 'basic'
        }
      },
      professional: {
        plan_type: 'professional',
        base_price: 99,
        white_label_fee: 25, // $25/month for white-label features
        total_price: 124,
        features: [
          'Full custom branding',
          'Custom domain support',
          'Advanced CSS customization',
          'Priority white-label support',
          'Custom email templates'
        ],
        limits: {
          max_portals: 10,
          max_customizations: 25,
          support_level: 'priority'
        }
      },
      enterprise: {
        plan_type: 'enterprise',
        base_price: 299,
        white_label_fee: 50, // $50/month for white-label features
        total_price: 349,
        features: [
          'Complete white-label solution',
          'Custom domain with SSL',
          'Advanced branding options',
          'Dedicated white-label support',
          'Custom integrations',
          'API access for branding'
        ],
        limits: {
          max_portals: -1, // unlimited
          max_customizations: -1, // unlimited
          support_level: 'dedicated'
        }
      }
    };
  }

  /**
   * Create white-label configuration
   */
  async createWhiteLabelConfig(data: {
    organization_id: string;
    client_name: string;
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    custom_domain?: string;
    custom_css?: string;
  }): Promise<WhiteLabelConfig> {
    const { data: config, error } = await this.supabase
      .from('white_label_configs')
      .insert({
        organization_id: data.organization_id,
        client_name: data.client_name,
        logo_url: data.logo_url,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        custom_domain: data.custom_domain,
        custom_css: data.custom_css,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return config;
  }

  /**
   * Get white-label configuration
   */
  async getWhiteLabelConfig(organizationId: string): Promise<WhiteLabelConfig | null> {
    const { data, error } = await this.supabase
      .from('white_label_configs')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Update white-label configuration
   */
  async updateWhiteLabelConfig(
    organizationId: string,
    updates: Partial<WhiteLabelConfig>
  ): Promise<WhiteLabelConfig> {
    const { data, error } = await this.supabase
      .from('white_label_configs')
      .update(updates)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Generate custom CSS
   */
  generateCustomCSS(config: WhiteLabelConfig): string {
    const css = `
      :root {
        --primary-color: ${config.primary_color};
        --secondary-color: ${config.secondary_color};
      }

      .cosmic-portals-header {
        background-color: var(--primary-color);
        color: white;
      }

      .cosmic-portals-button {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
      }

      .cosmic-portals-button:hover {
        background-color: var(--secondary-color);
        border-color: var(--secondary-color);
      }

      .cosmic-portals-card {
        border-left: 4px solid var(--primary-color);
      }

      .cosmic-portals-logo {
        max-height: 40px;
        width: auto;
      }

      ${config.custom_css || ''}
    `;

    return css;
  }

  /**
   * Validate custom domain
   */
  async validateCustomDomain(domain: string): Promise<{
    valid: boolean;
    available: boolean;
    error?: string;
  }> {
    try {
      // Check if domain is valid
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        return {
          valid: false,
          available: false,
          error: 'Invalid domain format'
        };
      }

      // Check if domain is already in use
      const { data: existing } = await this.supabase
        .from('white_label_configs')
        .select('id')
        .eq('custom_domain', domain)
        .eq('is_active', true)
        .single();

      if (existing) {
        return {
          valid: true,
          available: false,
          error: 'Domain already in use'
        };
      }

      return {
        valid: true,
        available: true
      };
    } catch (error) {
      return {
        valid: false,
        available: false,
        error: 'Domain validation failed'
      };
    }
  }

  /**
   * Setup custom domain
   */
  async setupCustomDomain(organizationId: string, domain: string): Promise<{
    success: boolean;
    dns_records: Array<{ type: string; name: string; value: string }>;
    error?: string;
  }> {
    try {
      // Generate DNS records for domain setup
      const dns_records = [
        {
          type: 'CNAME',
          name: domain,
          value: 'cosmic-portals.com'
        },
        {
          type: 'TXT',
          name: `_cosmic-portals.${domain}`,
          value: `cosmic-portals-verification=${organizationId}`
        }
      ];

      // Update configuration
      await this.updateWhiteLabelConfig(organizationId, {
        custom_domain: domain
      });

      return {
        success: true,
        dns_records
      };
    } catch (error) {
      return {
        success: false,
        dns_records: [],
        error: error instanceof Error ? error.message : 'Domain setup failed'
      };
    }
  }

  /**
   * Get white-label usage metrics
   */
  async getWhiteLabelMetrics(organizationId: string): Promise<{
    total_portals: number;
    active_portals: number;
    customizations_used: number;
    domain_setup: boolean;
    last_updated: string;
  }> {
    const { data: config } = await this.getWhiteLabelConfig(organizationId);
    
    if (!config) {
      return {
        total_portals: 0,
        active_portals: 0,
        customizations_used: 0,
        domain_setup: false,
        last_updated: new Date().toISOString()
      };
    }

    // Count portals and customizations
    const { count: portals } = await this.supabase
      .from('landing_pages')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    const customizations_used = [
      config.logo_url,
      config.primary_color,
      config.secondary_color,
      config.custom_domain,
      config.custom_css
    ].filter(Boolean).length;

    return {
      total_portals: portals || 0,
      active_portals: portals || 0,
      customizations_used,
      domain_setup: !!config.custom_domain,
      last_updated: config.updated_at
    };
  }

  /**
   * Check white-label limits
   */
  async checkWhiteLabelLimits(organizationId: string): Promise<{
    within_limits: boolean;
    exceeded_limits: string[];
    warnings: string[];
  }> {
    const config = await this.getWhiteLabelConfig(organizationId);
    if (!config) {
      return {
        within_limits: true,
        exceeded_limits: [],
        warnings: []
      };
    }

    // Get organization's plan
    const { data: org } = await this.supabase
      .from('organizations')
      .select('plan_type')
      .eq('id', organizationId)
      .single();

    if (!org) {
      return {
        within_limits: true,
        exceeded_limits: [],
        warnings: []
      };
    }

    const pricing = this.getWhiteLabelPricing()[org.plan_type];
    const metrics = await this.getWhiteLabelMetrics(organizationId);

    const exceeded: string[] = [];
    const warnings: string[] = [];

    // Check portal limits
    if (pricing.limits.max_portals !== -1 && metrics.total_portals >= pricing.limits.max_portals) {
      exceeded.push('portals');
    } else if (pricing.limits.max_portals !== -1 && metrics.total_portals >= pricing.limits.max_portals * 0.8) {
      warnings.push('portals');
    }

    // Check customization limits
    if (pricing.limits.max_customizations !== -1 && metrics.customizations_used >= pricing.limits.max_customizations) {
      exceeded.push('customizations');
    } else if (pricing.limits.max_customizations !== -1 && metrics.customizations_used >= pricing.limits.max_customizations * 0.8) {
      warnings.push('customizations');
    }

    return {
      within_limits: exceeded.length === 0,
      exceeded_limits: exceeded,
      warnings
    };
  }

  /**
   * Generate white-label invoice
   */
  async generateWhiteLabelInvoice(organizationId: string): Promise<{
    invoice_number: string;
    organization_name: string;
    plan_type: string;
    base_price: number;
    white_label_fee: number;
    total_amount: number;
    billing_period: string;
  }> {
    const { data: org } = await this.supabase
      .from('organizations')
      .select('name, plan_type')
      .eq('id', organizationId)
      .single();

    if (!org) {
      throw new Error('Organization not found');
    }

    const pricing = this.getWhiteLabelPricing()[org.plan_type];
    const invoice_number = `WL-${Date.now()}`;
    const billing_period = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });

    return {
      invoice_number,
      organization_name: org.name,
      plan_type: org.plan_type,
      base_price: pricing.base_price,
      white_label_fee: pricing.white_label_fee,
      total_amount: pricing.total_price,
      billing_period
    };
  }
}

export default WhiteLabelService;

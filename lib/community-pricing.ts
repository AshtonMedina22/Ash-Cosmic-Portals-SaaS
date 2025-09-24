/**
 * Community Pricing System for Cosmic Portals
 * Special pricing for schools, nonprofits, HOAs, and community groups
 */

import { createClient } from './supabase/client';

export interface CommunityPricingTier {
  id: string;
  name: string;
  target_audience: 'school' | 'nonprofit' | 'hoa' | 'community' | 'church';
  base_plan: 'starter' | 'professional' | 'enterprise';
  discount_percentage: number;
  discounted_price: number;
  features: string[];
  limits: {
    max_users: number;
    max_events: number;
    max_nfc_devices: number;
    max_landing_pages: number;
    storage_gb: number;
  };
  requirements: {
    verification_required: boolean;
    documentation_required: string[];
    annual_commitment: boolean;
  };
  is_active: boolean;
  created_at: string;
}

export interface CommunityApplication {
  id: string;
  organization_id: string;
  organization_name: string;
  organization_type: string;
  contact_email: string;
  contact_phone: string;
  organization_size: 'small' | 'medium' | 'large';
  annual_budget: number;
  use_case_description: string;
  expected_events_per_year: number;
  expected_attendees_per_event: number;
  verification_documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityDiscount {
  id: string;
  organization_id: string;
  pricing_tier_id: string;
  discount_percentage: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

export class CommunityPricingService {
  private supabase = createClient();

  /**
   * Get community pricing tiers
   */
  getCommunityPricingTiers(): Record<string, CommunityPricingTier> {
    return {
      school_starter: {
        id: 'school_starter',
        name: 'School Starter',
        target_audience: 'school',
        base_plan: 'starter',
        discount_percentage: 50,
        discounted_price: 14.50, // 50% off $29
        features: [
          'Event management for school events',
          'Student check-in system',
          'Parent communication tools',
          'Basic analytics',
          'School branding options'
        ],
        limits: {
          max_users: 10,
          max_events: 10,
          max_nfc_devices: 25,
          max_landing_pages: 10,
          storage_gb: 2
        },
        requirements: {
          verification_required: true,
          documentation_required: ['school_id', 'tax_exempt_certificate'],
          annual_commitment: true
        },
        is_active: true,
        created_at: new Date().toISOString()
      },
      school_professional: {
        id: 'school_professional',
        name: 'School Professional',
        target_audience: 'school',
        base_plan: 'professional',
        discount_percentage: 40,
        discounted_price: 59.40, // 40% off $99
        features: [
          'Advanced event management',
          'Multi-school district support',
          'Advanced analytics',
          'Custom branding',
          'Priority support',
          'API access'
        ],
        limits: {
          max_users: 50,
          max_events: 50,
          max_nfc_devices: 200,
          max_landing_pages: 50,
          storage_gb: 20
        },
        requirements: {
          verification_required: true,
          documentation_required: ['school_id', 'district_verification'],
          annual_commitment: true
        },
        is_active: true,
        created_at: new Date().toISOString()
      },
      nonprofit_starter: {
        id: 'nonprofit_starter',
        name: 'Nonprofit Starter',
        target_audience: 'nonprofit',
        base_plan: 'starter',
        discount_percentage: 60,
        discounted_price: 11.60, // 60% off $29
        features: [
          'Event management for fundraisers',
          'Donor engagement tools',
          'Volunteer management',
          'Basic analytics',
          'Nonprofit branding'
        ],
        limits: {
          max_users: 5,
          max_events: 5,
          max_nfc_devices: 15,
          max_landing_pages: 5,
          storage_gb: 1
        },
        requirements: {
          verification_required: true,
          documentation_required: ['501c3_certificate', 'nonprofit_registration'],
          annual_commitment: false
        },
        is_active: true,
        created_at: new Date().toISOString()
      },
      nonprofit_professional: {
        id: 'nonprofit_professional',
        name: 'Nonprofit Professional',
        target_audience: 'nonprofit',
        base_plan: 'professional',
        discount_percentage: 50,
        discounted_price: 49.50, // 50% off $99
        features: [
          'Advanced fundraising tools',
          'Donor analytics',
          'Event series management',
          'Custom branding',
          'Priority support'
        ],
        limits: {
          max_users: 25,
          max_events: 25,
          max_nfc_devices: 100,
          max_landing_pages: 25,
          storage_gb: 10
        },
        requirements: {
          verification_required: true,
          documentation_required: ['501c3_certificate', 'annual_report'],
          annual_commitment: true
        },
        is_active: true,
        created_at: new Date().toISOString()
      },
      hoa_community: {
        id: 'hoa_community',
        name: 'HOA Community',
        target_audience: 'hoa',
        base_plan: 'starter',
        discount_percentage: 30,
        discounted_price: 20.30, // 30% off $29
        features: [
          'Community event management',
          'Resident check-in system',
          'Community announcements',
          'Basic analytics',
          'HOA branding'
        ],
        limits: {
          max_users: 15,
          max_events: 20,
          max_nfc_devices: 50,
          max_landing_pages: 15,
          storage_gb: 3
        },
        requirements: {
          verification_required: true,
          documentation_required: ['hoa_documents', 'board_resolution'],
          annual_commitment: true
        },
        is_active: true,
        created_at: new Date().toISOString()
      },
      church_community: {
        id: 'church_community',
        name: 'Church Community',
        target_audience: 'church',
        base_plan: 'starter',
        discount_percentage: 40,
        discounted_price: 17.40, // 40% off $29
        features: [
          'Church event management',
          'Member check-in system',
          'Volunteer coordination',
          'Basic analytics',
          'Church branding'
        ],
        limits: {
          max_users: 20,
          max_events: 30,
          max_nfc_devices: 75,
          max_landing_pages: 20,
          storage_gb: 5
        },
        requirements: {
          verification_required: true,
          documentation_required: ['church_registration', 'tax_exempt_status'],
          annual_commitment: true
        },
        is_active: true,
        created_at: new Date().toISOString()
      }
    };
  }

  /**
   * Apply for community pricing
   */
  async applyForCommunityPricing(data: {
    organization_id: string;
    organization_name: string;
    organization_type: string;
    contact_email: string;
    contact_phone: string;
    organization_size: string;
    annual_budget: number;
    use_case_description: string;
    expected_events_per_year: number;
    expected_attendees_per_event: number;
    verification_documents: string[];
  }): Promise<CommunityApplication> {
    const { data: application, error } = await this.supabase
      .from('community_applications')
      .insert({
        organization_id: data.organization_id,
        organization_name: data.organization_name,
        organization_type: data.organization_type,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        organization_size: data.organization_size,
        annual_budget: data.annual_budget,
        use_case_description: data.use_case_description,
        expected_events_per_year: data.expected_events_per_year,
        expected_attendees_per_event: data.expected_attendees_per_event,
        verification_documents: data.verification_documents,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return application;
  }

  /**
   * Review community application
   */
  async reviewApplication(
    applicationId: string,
    decision: 'approved' | 'rejected',
    reviewedBy: string,
    notes?: string
  ): Promise<CommunityApplication> {
    const { data: application, error } = await this.supabase
      .from('community_applications')
      .update({
        status: decision,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        notes
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    // If approved, create discount
    if (decision === 'approved') {
      await this.createCommunityDiscount(application.organization_id, application.organization_type);
    }

    return application;
  }

  /**
   * Create community discount
   */
  async createCommunityDiscount(organizationId: string, organizationType: string): Promise<CommunityDiscount> {
    const pricingTiers = this.getCommunityPricingTiers();
    const tier = Object.values(pricingTiers).find(t => t.target_audience === organizationType);
    
    if (!tier) throw new Error('No pricing tier found for organization type');

    const { data: discount, error } = await this.supabase
      .from('community_discounts')
      .insert({
        organization_id: organizationId,
        pricing_tier_id: tier.id,
        discount_percentage: tier.discount_percentage,
        start_date: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return discount;
  }

  /**
   * Get organization's community pricing
   */
  async getOrganizationCommunityPricing(organizationId: string): Promise<{
    has_community_pricing: boolean;
    pricing_tier?: CommunityPricingTier;
    discount?: CommunityDiscount;
    application_status?: string;
  }> {
    const [discount, application] = await Promise.all([
      this.supabase
        .from('community_discounts')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .single(),
      this.supabase
        .from('community_applications')
        .select('status')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
    ]);

    if (discount.data) {
      const pricingTiers = this.getCommunityPricingTiers();
      const tier = pricingTiers[discount.data.pricing_tier_id];
      
      return {
        has_community_pricing: true,
        pricing_tier: tier,
        discount: discount.data
      };
    }

    return {
      has_community_pricing: false,
      application_status: application.data?.status
    };
  }

  /**
   * Get community pricing eligibility
   */
  getCommunityPricingEligibility(organizationType: string): {
    eligible: boolean;
    available_tiers: string[];
    requirements: string[];
  } {
    const pricingTiers = this.getCommunityPricingTiers();
    const availableTiers = Object.values(pricingTiers)
      .filter(tier => tier.target_audience === organizationType && tier.is_active);

    return {
      eligible: availableTiers.length > 0,
      available_tiers: availableTiers.map(tier => tier.id),
      requirements: availableTiers[0]?.requirements.documentation_required || []
    };
  }

  /**
   * Calculate community pricing
   */
  calculateCommunityPricing(
    basePrice: number,
    organizationType: string,
    organizationSize: string
  ): {
    original_price: number;
    discount_percentage: number;
    discounted_price: number;
    annual_savings: number;
  } {
    const pricingTiers = this.getCommunityPricingTiers();
    const tier = Object.values(pricingTiers).find(t => t.target_audience === organizationType);
    
    if (!tier) {
      return {
        original_price: basePrice,
        discount_percentage: 0,
        discounted_price: basePrice,
        annual_savings: 0
      };
    }

    const discountedPrice = basePrice * (1 - tier.discount_percentage / 100);
    const annualSavings = (basePrice - discountedPrice) * 12;

    return {
      original_price: basePrice,
      discount_percentage: tier.discount_percentage,
      discounted_price: discountedPrice,
      annual_savings: annualSavings
    };
  }

  /**
   * Get community pricing analytics
   */
  async getCommunityPricingAnalytics(): Promise<{
    total_applications: number;
    approved_applications: number;
    rejected_applications: number;
    pending_applications: number;
    total_discounts_given: number;
    total_annual_savings: number;
    applications_by_type: Record<string, number>;
  }> {
    const { data: applications } = await this.supabase
      .from('community_applications')
      .select('status, organization_type');

    const { data: discounts } = await this.supabase
      .from('community_discounts')
      .select('discount_percentage, pricing_tier_id')
      .eq('is_active', true);

    const totalApplications = applications?.length || 0;
    const approvedApplications = applications?.filter(app => app.status === 'approved').length || 0;
    const rejectedApplications = applications?.filter(app => app.status === 'rejected').length || 0;
    const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;

    const applicationsByType: Record<string, number> = {};
    applications?.forEach(app => {
      applicationsByType[app.organization_type] = (applicationsByType[app.organization_type] || 0) + 1;
    });

    const totalDiscountsGiven = discounts?.length || 0;
    const totalAnnualSavings = discounts?.reduce((sum, discount) => {
      const pricingTiers = this.getCommunityPricingTiers();
      const tier = pricingTiers[discount.pricing_tier_id];
      if (tier) {
        const basePrice = tier.base_plan === 'starter' ? 29 : tier.base_plan === 'professional' ? 99 : 299;
        const savings = basePrice * (discount.discount_percentage / 100) * 12;
        return sum + savings;
      }
      return sum;
    }, 0) || 0;

    return {
      total_applications: totalApplications,
      approved_applications: approvedApplications,
      rejected_applications: rejectedApplications,
      pending_applications: pendingApplications,
      total_discounts_given: totalDiscountsGiven,
      total_annual_savings: totalAnnualSavings,
      applications_by_type: applicationsByType
    };
  }
}

export default CommunityPricingService;

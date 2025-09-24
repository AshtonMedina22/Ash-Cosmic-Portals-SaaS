/**
 * Payment and Subscription Management for Cosmic Portals
 */

import { createClient } from './supabase/client';

export interface Subscription {
  id: string;
  organization_id: string;
  stripe_subscription_id?: string;
  plan_type: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanLimits {
  max_users: number;
  max_events: number;
  max_nfc_devices: number;
  max_landing_pages: number;
  storage_gb: number;
  white_label: boolean;
  api_access: boolean;
  priority_support: boolean;
}

export interface BillingInfo {
  subscription: Subscription;
  usage: {
    users: number;
    events: number;
    nfc_devices: number;
    landing_pages: number;
    storage_gb: number;
  };
  limits: PlanLimits;
  overages: Record<string, number>;
  next_billing_date?: string;
  amount_due: number;
}

export class PaymentService {
  private supabase = createClient();

  /**
   * Get subscription plans and pricing
   */
  getSubscriptionPlans(): Record<string, { price: number; limits: PlanLimits; features: string[] }> {
    return {
      starter: {
        price: 29,
        limits: {
          max_users: 5,
          max_events: 3,
          max_nfc_devices: 10,
          max_landing_pages: 5,
          storage_gb: 1,
          white_label: false,
          api_access: false,
          priority_support: false
        },
        features: [
          'Basic NFC tracking',
          'Event management',
          'Analytics dashboard',
          'Email support'
        ]
      },
      professional: {
        price: 99,
        limits: {
          max_users: 25,
          max_events: 25,
          max_nfc_devices: 100,
          max_landing_pages: 25,
          storage_gb: 10,
          white_label: true,
          api_access: true,
          priority_support: true
        },
        features: [
          'Advanced NFC tracking',
          'Unlimited events',
          'Advanced analytics',
          'White-label options',
          'API access',
          'Priority support'
        ]
      },
      enterprise: {
        price: 299,
        limits: {
          max_users: -1, // unlimited
          max_events: -1,
          max_nfc_devices: -1,
          max_landing_pages: -1,
          storage_gb: 100,
          white_label: true,
          api_access: true,
          priority_support: true
        },
        features: [
          'Unlimited everything',
          'Custom integrations',
          'Dedicated support',
          'Custom branding',
          'Advanced security',
          'SLA guarantees'
        ]
      }
    };
  }

  /**
   * Create subscription
   */
  async createSubscription(data: {
    organization_id: string;
    plan_type: string;
    stripe_subscription_id?: string;
  }): Promise<Subscription> {
    const { data: subscription, error } = await this.supabase
      .from('subscriptions')
      .insert({
        organization_id: data.organization_id,
        plan_type: data.plan_type,
        stripe_subscription_id: data.stripe_subscription_id,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return subscription;
  }

  /**
   * Get organization subscription
   */
  async getSubscription(organizationId: string): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get billing information
   */
  async getBillingInfo(organizationId: string): Promise<BillingInfo> {
    const subscription = await this.getSubscription(organizationId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    const plans = this.getSubscriptionPlans();
    const plan = plans[subscription.plan_type];
    if (!plan) {
      throw new Error('Invalid plan type');
    }

    // Get current usage
    const usage = await this.getCurrentUsage(organizationId);

    // Calculate overages
    const overages: Record<string, number> = {};
    if (plan.limits.max_users !== -1 && usage.users > plan.limits.max_users) {
      overages.users = usage.users - plan.limits.max_users;
    }
    if (plan.limits.max_events !== -1 && usage.events > plan.limits.max_events) {
      overages.events = usage.events - plan.limits.max_events;
    }
    if (plan.limits.max_nfc_devices !== -1 && usage.nfc_devices > plan.limits.max_nfc_devices) {
      overages.nfc_devices = usage.nfc_devices - plan.limits.max_nfc_devices;
    }

    // Calculate amount due
    const baseAmount = plan.price;
    const overageAmount = Object.values(overages).reduce((sum, count) => sum + (count * 5), 0); // $5 per overage
    const amount_due = baseAmount + overageAmount;

    return {
      subscription,
      usage,
      limits: plan.limits,
      overages,
      next_billing_date: subscription.current_period_end,
      amount_due
    };
  }

  /**
   * Get current usage for organization
   */
  async getCurrentUsage(organizationId: string): Promise<{
    users: number;
    events: number;
    nfc_devices: number;
    landing_pages: number;
    storage_gb: number;
  }> {
    const [
      { count: users },
      { count: events },
      { count: nfc_devices },
      { count: landing_pages }
    ] = await Promise.all([
      this.supabase.from('users').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
      this.supabase.from('events').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
      this.supabase.from('nfc_devices').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
      this.supabase.from('landing_pages').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId)
    ]);

    // TODO: Calculate actual storage usage
    const storage_gb = 0;

    return {
      users: users || 0,
      events: events || 0,
      nfc_devices: nfc_devices || 0,
      landing_pages: landing_pages || 0,
      storage_gb
    };
  }

  /**
   * Check if organization is within plan limits
   */
  async checkPlanLimits(organizationId: string): Promise<{
    within_limits: boolean;
    exceeded_limits: string[];
    warnings: string[];
  }> {
    const subscription = await this.getSubscription(organizationId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    const plans = this.getSubscriptionPlans();
    const plan = plans[subscription.plan_type];
    if (!plan) {
      throw new Error('Invalid plan type');
    }

    const usage = await this.getCurrentUsage(organizationId);
    const exceeded: string[] = [];
    const warnings: string[] = [];

    // Check each limit
    if (plan.limits.max_users !== -1) {
      if (usage.users >= plan.limits.max_users) {
        exceeded.push('users');
      } else if (usage.users >= plan.limits.max_users * 0.8) {
        warnings.push('users');
      }
    }

    if (plan.limits.max_events !== -1) {
      if (usage.events >= plan.limits.max_events) {
        exceeded.push('events');
      } else if (usage.events >= plan.limits.max_events * 0.8) {
        warnings.push('events');
      }
    }

    if (plan.limits.max_nfc_devices !== -1) {
      if (usage.nfc_devices >= plan.limits.max_nfc_devices) {
        exceeded.push('nfc_devices');
      } else if (usage.nfc_devices >= plan.limits.max_nfc_devices * 0.8) {
        warnings.push('nfc_devices');
      }
    }

    return {
      within_limits: exceeded.length === 0,
      exceeded_limits: exceeded,
      warnings
    };
  }

  /**
   * Calculate upgrade cost
   */
  calculateUpgradeCost(currentPlan: string, targetPlan: string): {
    monthly_difference: number;
    prorated_cost: number;
    effective_date: string;
  } {
    const plans = this.getSubscriptionPlans();
    const current = plans[currentPlan];
    const target = plans[targetPlan];

    if (!current || !target) {
      throw new Error('Invalid plan type');
    }

    const monthly_difference = target.price - current.price;
    const prorated_cost = monthly_difference; // Simplified calculation
    const effective_date = new Date().toISOString();

    return {
      monthly_difference,
      prorated_cost,
      effective_date
    };
  }

  /**
   * Generate invoice data
   */
  async generateInvoiceData(organizationId: string, startDate: string, endDate: string): Promise<{
    invoice_number: string;
    period: { start: string; end: string };
    subscription: Subscription;
    usage: any;
    overages: Record<string, number>;
    total_amount: number;
    line_items: Array<{ description: string; amount: number; quantity: number }>;
  }> {
    const subscription = await this.getSubscription(organizationId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    const plans = this.getSubscriptionPlans();
    const plan = plans[subscription.plan_type];
    if (!plan) {
      throw new Error('Invalid plan type');
    }

    const usage = await this.getCurrentUsage(organizationId);
    const billingInfo = await this.getBillingInfo(organizationId);

    const line_items = [
      {
        description: `${subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan`,
        amount: plan.price,
        quantity: 1
      }
    ];

    // Add overage charges
    Object.entries(billingInfo.overages).forEach(([type, count]) => {
      if (count > 0) {
        line_items.push({
          description: `${type} overage (${count} units)`,
          amount: count * 5,
          quantity: count
        });
      }
    });

    return {
      invoice_number: `INV-${Date.now()}`,
      period: { start: startDate, end: endDate },
      subscription,
      usage,
      overages: billingInfo.overages,
      total_amount: billingInfo.amount_due,
      line_items
    };
  }
}

export default PaymentService;
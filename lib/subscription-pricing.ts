/**
 * Final Subscription Pricing for Cosmic Portals
 * Locked-in pricing tiers as per business plan
 */

export interface SubscriptionPricing {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  annual_discount: number;
  features: string[];
  limits: {
    max_users: number;
    max_events: number;
    max_nfc_devices: number;
    max_landing_pages: number;
    storage_gb: number;
    api_calls_per_month: number;
  };
  white_label: {
    available: boolean;
    additional_cost: number;
  };
  support: {
    level: 'basic' | 'priority' | 'dedicated';
    response_time: string;
    channels: string[];
  };
  is_popular: boolean;
  is_enterprise: boolean;
}

export interface PricingComparison {
  feature: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

export class SubscriptionPricingService {
  /**
   * Get final subscription pricing tiers
   */
  getSubscriptionPricing(): Record<string, SubscriptionPricing> {
    return {
      starter: {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small businesses and individual event planners',
        monthly_price: 29,
        annual_price: 290, // 2 months free
        annual_discount: 17,
        features: [
          'Basic NFC tracking',
          'Event management',
          'Attendee check-in',
          'Basic analytics dashboard',
          'Email support',
          '5 users included',
          '3 events per month',
          '10 NFC devices',
          '5 landing pages',
          '1GB storage'
        ],
        limits: {
          max_users: 5,
          max_events: 3,
          max_nfc_devices: 10,
          max_landing_pages: 5,
          storage_gb: 1,
          api_calls_per_month: 1000
        },
        white_label: {
          available: false,
          additional_cost: 0
        },
        support: {
          level: 'basic',
          response_time: '48 hours',
          channels: ['email']
        },
        is_popular: false,
        is_enterprise: false
      },
      professional: {
        id: 'professional',
        name: 'Professional',
        description: 'Advanced features for growing businesses and event companies',
        monthly_price: 99,
        annual_price: 990, // 2 months free
        annual_discount: 17,
        features: [
          'Advanced NFC tracking',
          'Unlimited events',
          'Advanced analytics',
          'UTM campaign tracking',
          'White-label branding',
          'API access',
          'Priority support',
          '25 users included',
          '25 events per month',
          '100 NFC devices',
          '25 landing pages',
          '10GB storage',
          'Custom integrations'
        ],
        limits: {
          max_users: 25,
          max_events: 25,
          max_nfc_devices: 100,
          max_landing_pages: 25,
          storage_gb: 10,
          api_calls_per_month: 10000
        },
        white_label: {
          available: true,
          additional_cost: 25
        },
        support: {
          level: 'priority',
          response_time: '24 hours',
          channels: ['email', 'chat', 'phone']
        },
        is_popular: true,
        is_enterprise: false
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Complete solution for large organizations and enterprises',
        monthly_price: 299,
        annual_price: 2990, // 2 months free
        annual_discount: 17,
        features: [
          'Unlimited everything',
          'Advanced AI insights',
          'Custom integrations',
          'Dedicated support',
          'SLA guarantees',
          'Custom branding',
          'Advanced security',
          'Unlimited users',
          'Unlimited events',
          'Unlimited NFC devices',
          'Unlimited landing pages',
          '100GB storage',
          'Unlimited API calls',
          'Custom domain support',
          'Advanced analytics',
          'White-label solution'
        ],
        limits: {
          max_users: -1, // unlimited
          max_events: -1, // unlimited
          max_nfc_devices: -1, // unlimited
          max_landing_pages: -1, // unlimited
          storage_gb: 100,
          api_calls_per_month: -1 // unlimited
        },
        white_label: {
          available: true,
          additional_cost: 50
        },
        support: {
          level: 'dedicated',
          response_time: '4 hours',
          channels: ['email', 'chat', 'phone', 'dedicated_slack']
        },
        is_popular: false,
        is_enterprise: true
      }
    };
  }

  /**
   * Get pricing comparison table
   */
  getPricingComparison(): PricingComparison[] {
    return [
      {
        feature: 'Monthly Price',
        starter: '$29',
        professional: '$99',
        enterprise: '$299'
      },
      {
        feature: 'Annual Price (2 months free)',
        starter: '$290',
        professional: '$990',
        enterprise: '$2,990'
      },
      {
        feature: 'Users',
        starter: '5',
        professional: '25',
        enterprise: 'Unlimited'
      },
      {
        feature: 'Events per Month',
        starter: '3',
        professional: '25',
        enterprise: 'Unlimited'
      },
      {
        feature: 'NFC Devices',
        starter: '10',
        professional: '100',
        enterprise: 'Unlimited'
      },
      {
        feature: 'Storage',
        starter: '1GB',
        professional: '10GB',
        enterprise: '100GB'
      },
      {
        feature: 'API Access',
        starter: false,
        professional: true,
        enterprise: true
      },
      {
        feature: 'White-label Branding',
        starter: false,
        professional: '+$25/month',
        enterprise: '+$50/month'
      },
      {
        feature: 'Priority Support',
        starter: false,
        professional: true,
        enterprise: true
      },
      {
        feature: 'Custom Integrations',
        starter: false,
        professional: true,
        enterprise: true
      },
      {
        feature: 'Advanced Analytics',
        starter: 'Basic',
        professional: 'Advanced',
        enterprise: 'AI-Powered'
      },
      {
        feature: 'SLA Guarantee',
        starter: false,
        professional: false,
        enterprise: true
      }
    ];
  }

  /**
   * Calculate pricing with add-ons
   */
  calculateTotalPricing(
    planId: string,
    addOns: {
      white_label?: boolean;
      additional_users?: number;
      additional_storage?: number;
      custom_integrations?: boolean;
    }
  ): {
    base_price: number;
    add_on_costs: Record<string, number>;
    total_monthly: number;
    total_annual: number;
    savings: number;
  } {
    const pricing = this.getSubscriptionPricing();
    const plan = pricing[planId];
    
    if (!plan) throw new Error('Invalid plan ID');

    const addOnCosts: Record<string, number> = {};
    let totalAddOns = 0;

    // White-label add-on
    if (addOns.white_label && plan.white_label.available) {
      addOnCosts.white_label = plan.white_label.additional_cost;
      totalAddOns += plan.white_label.additional_cost;
    }

    // Additional users (Enterprise only)
    if (addOns.additional_users && planId === 'enterprise') {
      const userCost = Math.max(0, addOns.additional_users - plan.limits.max_users) * 5; // $5 per additional user
      if (userCost > 0) {
        addOnCosts.additional_users = userCost;
        totalAddOns += userCost;
      }
    }

    // Additional storage
    if (addOns.additional_storage) {
      const storageCost = Math.max(0, addOns.additional_storage - plan.limits.storage_gb) * 2; // $2 per GB
      if (storageCost > 0) {
        addOnCosts.additional_storage = storageCost;
        totalAddOns += storageCost;
      }
    }

    // Custom integrations
    if (addOns.custom_integrations && planId === 'enterprise') {
      addOnCosts.custom_integrations = 100; // $100/month for custom integrations
      totalAddOns += 100;
    }

    const totalMonthly = plan.monthly_price + totalAddOns;
    const totalAnnual = plan.annual_price + (totalAddOns * 12);
    const savings = (totalMonthly * 12) - totalAnnual;

    return {
      base_price: plan.monthly_price,
      add_on_costs: addOnCosts,
      total_monthly: totalMonthly,
      total_annual: totalAnnual,
      savings
    };
  }

  /**
   * Get plan recommendations based on usage
   */
  getPlanRecommendation(usage: {
    expected_users: number;
    expected_events_per_month: number;
    expected_nfc_devices: number;
    needs_white_label: boolean;
    needs_api_access: boolean;
    needs_custom_integrations: boolean;
  }): {
    recommended_plan: string;
    reasoning: string[];
    alternative_plans: string[];
  } {
    const reasoning: string[] = [];
    const alternatives: string[] = [];

    // Check if Enterprise is needed
    if (usage.needs_custom_integrations || 
        usage.expected_users > 25 || 
        usage.expected_events_per_month > 25 ||
        usage.expected_nfc_devices > 100) {
      reasoning.push('Requires unlimited resources and custom integrations');
      return {
        recommended_plan: 'enterprise',
        reasoning,
        alternative_plans: ['professional']
      };
    }

    // Check if Professional is needed
    if (usage.needs_white_label || 
        usage.needs_api_access || 
        usage.expected_users > 5 || 
        usage.expected_events_per_month > 3 ||
        usage.expected_nfc_devices > 10) {
      reasoning.push('Requires advanced features and higher limits');
      alternatives.push('starter');
      return {
        recommended_plan: 'professional',
        reasoning,
        alternative_plans: alternatives
      };
    }

    // Default to Starter
    reasoning.push('Basic features and limits are sufficient');
    alternatives.push('professional');
    return {
      recommended_plan: 'starter',
      reasoning,
      alternative_plans: alternatives
    };
  }

  /**
   * Get upgrade path
   */
  getUpgradePath(currentPlan: string, targetPlan: string): {
    current_plan: SubscriptionPricing;
    target_plan: SubscriptionPricing;
    price_difference: number;
    new_features: string[];
    migration_benefits: string[];
  } {
    const pricing = this.getSubscriptionPricing();
    const current = pricing[currentPlan];
    const target = pricing[targetPlan];

    if (!current || !target) throw new Error('Invalid plan');

    const priceDifference = target.monthly_price - current.monthly_price;
    const newFeatures = target.features.filter(feature => !current.features.includes(feature));
    
    const migrationBenefits = [
      `Access to ${target.name} features`,
      `Higher limits: ${target.limits.max_users} users vs ${current.limits.max_users}`,
      `More events: ${target.limits.max_events} vs ${current.limits.max_events}`,
      `Better support: ${target.support.level} vs ${current.support.level}`
    ];

    return {
      current_plan: current,
      target_plan: target,
      price_difference: priceDifference,
      new_features: newFeatures,
      migration_benefits: migrationBenefits
    };
  }

  /**
   * Get pricing FAQ
   */
  getPricingFAQ(): Array<{ question: string; answer: string }> {
    return [
      {
        question: 'Can I change plans anytime?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
      },
      {
        question: 'What happens to my data if I downgrade?',
        answer: 'Your data is preserved, but you may hit the limits of your new plan. We\'ll notify you if you\'re approaching limits and suggest upgrading.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a 30-day money-back guarantee for all new subscriptions. Contact support for assistance with refunds.'
      },
      {
        question: 'Are there setup fees?',
        answer: 'No setup fees for Starter and Professional plans. Enterprise plans may include custom setup costs for complex integrations.'
      },
      {
        question: 'Can I get a custom quote?',
        answer: 'Yes, for Enterprise plans with specific requirements. Contact our sales team for a custom quote.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice.'
      }
    ];
  }
}

export default SubscriptionPricingService;

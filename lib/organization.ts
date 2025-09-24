/**
 * Organization Management for Cosmic Portals
 */

import { createClient } from './supabase/client';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan_type: 'starter' | 'professional' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clerk_id: string;
  organization_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export class OrganizationService {
  private supabase = createClient();

  async createOrganization(data: {
    name: string;
    slug: string;
    plan_type?: string;
    owner_id: string;
  }): Promise<Organization> {
    const { data: org, error } = await this.supabase
      .from('organizations')
      .insert({
        name: data.name,
        slug: data.slug,
        plan_type: data.plan_type || 'starter',
        settings: {},
        white_label_config: {}
      })
      .select()
      .single();

    if (error) throw error;
    return org;
  }

  async getOrganization(id: string): Promise<Organization | null> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async getUserOrganization(clerkId: string): Promise<Organization | null> {
    const { data: user } = await this.supabase
      .from('users')
      .select('organization_id')
      .eq('clerk_id', clerkId)
      .single();

    if (!user) return null;
    return this.getOrganization(user.organization_id);
  }
}

export default OrganizationService;
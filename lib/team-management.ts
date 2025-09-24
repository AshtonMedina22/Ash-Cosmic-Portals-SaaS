import { supabase } from './supabase/client';
import { supabaseAdmin } from './supabase/client';

export interface TeamMember {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  status: string;
  invited_by: string | null;
  invited_at: string | null;
  last_login: string | null;
  created_at: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  invited_by: string;
  expires_at: string;
  created_at: string;
}

export class TeamManagementService {
  // Get all team members for an organization
  static async getTeamMembers(organizationId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        role,
        status,
        invited_by,
        invited_at,
        last_login,
        created_at
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }

    return data || [];
  }

  // Get pending invitations for an organization
  static async getPendingInvitations(organizationId: string): Promise<TeamInvitation[]> {
    const { data, error } = await supabase
      .from('team_invitations')
      .select(`
        id,
        email,
        role,
        status,
        invited_by,
        expires_at,
        created_at
      `)
      .eq('organization_id', organizationId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending invitations:', error);
      throw error;
    }

    return data || [];
  }

  // Invite a new team member
  static async inviteTeamMember(
    organizationId: string,
    email: string,
    role: string,
    invitedBy: string
  ): Promise<{ success: boolean; invitationId?: string; error?: string }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .eq('organization_id', organizationId)
        .single();

      if (existingUser) {
        return { success: false, error: 'User already exists in this organization' };
      }

      // Check for existing pending invitation
      const { data: existingInvitation } = await supabase
        .from('team_invitations')
        .select('id')
        .eq('email', email)
        .eq('organization_id', organizationId)
        .eq('status', 'pending')
        .single();

      if (existingInvitation) {
        return { success: false, error: 'Invitation already sent to this email' };
      }

      // Generate invitation token
      const invitationToken = crypto.randomUUID();

      // Create invitation
      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          organization_id: organizationId,
          email,
          role,
          invited_by: invitedBy,
          invitation_token: invitationToken,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        return { success: false, error: error.message };
      }

      return { success: true, invitationId: data.id };
    } catch (error) {
      console.error('Error inviting team member:', error);
      return { success: false, error: 'Failed to send invitation' };
    }
  }

  // Update team member role
  static async updateTeamMemberRole(
    userId: string,
    newRole: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating team member role:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating team member role:', error);
      return { success: false, error: 'Failed to update role' };
    }
  }

  // Remove team member
  static async removeTeamMember(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error removing team member:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing team member:', error);
      return { success: false, error: 'Failed to remove team member' };
    }
  }

  // Cancel pending invitation
  static async cancelInvitation(
    invitationId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) {
        console.error('Error cancelling invitation:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      return { success: false, error: 'Failed to cancel invitation' };
    }
  }

  // Accept invitation (for invited users)
  static async acceptInvitation(
    invitationToken: string,
    clerkId: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ success: boolean; organizationId?: string; error?: string }> {
    try {
      // Get invitation details
      const { data: invitation, error: invitationError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invitation_token', invitationToken)
        .eq('status', 'pending')
        .single();

      if (invitationError || !invitation) {
        return { success: false, error: 'Invalid or expired invitation' };
      }

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        return { success: false, error: 'Invitation has expired' };
      }

      // Create user record
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          clerk_id: clerkId,
          email: invitation.email,
          first_name: firstName,
          last_name: lastName,
          organization_id: invitation.organization_id,
          role: invitation.role,
          status: 'active',
          invited_by: invitation.invited_by,
          invited_at: invitation.created_at
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        return { success: false, error: 'Failed to create user account' };
      }

      // Update invitation status
      await supabase
        .from('team_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      return { success: true, organizationId: invitation.organization_id };
    } catch (error) {
      console.error('Error accepting invitation:', error);
      return { success: false, error: 'Failed to accept invitation' };
    }
  }

  // Get user's organization and role
  static async getUserOrganization(clerkId: string): Promise<{
    organizationId: string | null;
    role: string | null;
    organizationName: string | null;
  }> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        organization_id,
        role,
        organizations!inner (
          name
        )
      `)
      .eq('clerk_id', clerkId)
      .single();

    if (error || !data) {
      return { organizationId: null, role: null, organizationName: null };
    }

    return {
      organizationId: data.organization_id,
      role: data.role,
      organizationName: data.organizations?.name || null
    };
  }
}

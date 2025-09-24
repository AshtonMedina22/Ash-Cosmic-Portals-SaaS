'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { TeamManagementService, TeamMember, TeamInvitation } from '@/lib/team-management';
import { supabase } from '@/lib/supabase/client';

interface TeamManagementProps {}

const TeamManagement = () => {
  const { user, isLoaded } = useUser();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    if (user && isLoaded) {
      fetchTeamData();
    }
  }, [user, isLoaded]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      // Get user's organization
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('organization_id, role')
        .eq('clerk_id', user?.id)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        return;
      }

      setOrganizationId(userData.organization_id);

      // Check if user has admin permissions
      if (!['admin', 'owner'].includes(userData.role)) {
        console.log('User does not have admin permissions');
        return;
      }

      // Fetch team members and invitations
      const [members, invitations] = await Promise.all([
        TeamManagementService.getTeamMembers(userData.organization_id),
        TeamManagementService.getPendingInvitations(userData.organization_id)
      ]);

      setTeamMembers(members);
      setPendingInvitations(invitations);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !organizationId || !user?.id) return;

    try {
      const result = await TeamManagementService.inviteTeamMember(
        organizationId,
        inviteEmail,
        inviteRole,
        user.id
      );

      if (result.success) {
        alert('Invitation sent successfully!');
        setInviteEmail('');
        setInviteRole('member');
        setShowInviteForm(false);
        fetchTeamData(); // Refresh data
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error inviting member:', error);
      alert('Failed to send invitation');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const result = await TeamManagementService.updateTeamMemberRole(userId, newRole);
      if (result.success) {
        alert('Role updated successfully!');
        fetchTeamData(); // Refresh data
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    try {
      const result = await TeamManagementService.removeTeamMember(userId);
      if (result.success) {
        alert('Team member removed successfully!');
        fetchTeamData(); // Refresh data
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove team member');
    }
  };

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    if (!confirm(`Are you sure you want to cancel the invitation for ${email}?`)) {
      return;
    }

    try {
      const result = await TeamManagementService.cancelInvitation(invitationId);
      if (result.success) {
        alert('Invitation cancelled successfully!');
        fetchTeamData(); // Refresh data
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      alert('Failed to cancel invitation');
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading team management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
            Team Management
          </h1>
          <p className="text-xl text-white/70">
            Manage your team members, invite new users, and control access permissions
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowInviteForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Invite Team Member
          </button>
          <button
            onClick={fetchTeamData}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Refresh Data
          </button>
        </div>

        {/* Team Members Section */}
        <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-600/30">
            <h2 className="text-xl font-semibold text-white">Team Members ({teamMembers.length})</h2>
          </div>
          
          {teamMembers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/70">No team members found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Last Login</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {member.first_name && member.last_name 
                            ? `${member.first_name} ${member.last_name}`
                            : 'No name set'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">{member.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === 'owner' ? 'bg-red-600/20 text-red-300' :
                          member.role === 'admin' ? 'bg-purple-600/20 text-purple-300' :
                          member.role === 'editor' ? 'bg-blue-600/20 text-blue-300' :
                          'bg-gray-600/20 text-gray-300'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active' ? 'bg-green-600/20 text-green-300' :
                          member.status === 'invited' ? 'bg-yellow-600/20 text-yellow-300' :
                          'bg-red-600/20 text-red-300'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {member.last_login ? new Date(member.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                            disabled={member.role === 'owner'}
                          >
                            <option value="member">Member</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRemoveMember(member.id, member.email)}
                            disabled={member.role === 'owner'}
                            className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Invitations Section */}
        {pendingInvitations.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-600/30">
              <h2 className="text-xl font-semibold text-white">Pending Invitations ({pendingInvitations.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Invited</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Expires</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {pendingInvitations.map((invitation) => (
                    <tr key={invitation.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 text-white/70">{invitation.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300">
                          {invitation.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                          className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invite Member Modal */}
        {showInviteForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-600/30 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Invite Team Member</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                    placeholder="colleague@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="member">Member - View only</option>
                    <option value="editor">Editor - Can edit content</option>
                    <option value="admin">Admin - Full access</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleInviteMember}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Send Invitation
                </button>
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;

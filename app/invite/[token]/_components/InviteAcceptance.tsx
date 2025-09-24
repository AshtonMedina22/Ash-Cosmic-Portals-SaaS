'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { TeamManagementService } from '@/lib/team-management';
import { useRouter } from 'next/navigation';

interface InviteAcceptanceProps {
  invitation: {
    id: string;
    email: string;
    role: string;
    organization_id: string;
    invitation_token: string;
  };
}

const InviteAcceptance = ({ invitation }: InviteAcceptanceProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptInvitation = async () => {
    if (!user || !isLoaded) {
      setError('Please sign in to accept the invitation');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await TeamManagementService.acceptInvitation(
        invitation.invitation_token,
        user.id,
        user.firstName || undefined,
        user.lastName || undefined
      );

      if (result.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(result.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">You're Invited!</h1>
            <p className="text-white/70">Join your team on Cosmic Portals</p>
          </div>

          {/* Invitation Details */}
          <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Invitation Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-white/70">Email:</span>
                <span className="text-white ml-2">{invitation.email}</span>
              </div>
              <div>
                <span className="text-white/70">Role:</span>
                <span className="text-white ml-2 capitalize">{invitation.role}</span>
              </div>
              <div>
                <span className="text-white/70">Platform:</span>
                <span className="text-white ml-2">Cosmic Portals</span>
              </div>
            </div>
          </div>

          {/* User Status */}
          {user ? (
            <div className="mb-8">
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-300">Signed in as {user.emailAddresses[0]?.emailAddress}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-yellow-300">Please sign in to accept this invitation</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-400/30 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {user ? (
              <button
                onClick={handleAcceptInvitation}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Accepting...' : 'Accept Invitation'}
              </button>
            ) : (
              <a
                href="/sign-in"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                Sign In to Accept
              </a>
            )}
            
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              Powered by <span className="text-purple-300">Cosmic Portals</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteAcceptance;

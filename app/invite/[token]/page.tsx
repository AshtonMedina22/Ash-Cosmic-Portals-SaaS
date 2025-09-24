import { notFound } from 'next/navigation';
import { TeamManagementService } from '@/lib/team-management';
import { supabase } from '@/lib/supabase/client';
import InviteAcceptance from './_components/InviteAcceptance';

interface InvitePageProps {
  params: {
    token: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = params;

  try {
    // Verify invitation exists and is valid
    const { data: invitation, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('invitation_token', token)
      .eq('status', 'pending')
      .single();

    if (error || !invitation) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-4">Invalid Invitation</h1>
            <p className="text-xl text-white/70">This invitation is invalid or has expired.</p>
          </div>
        </div>
      );
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">Invitation Expired</h1>
            <p className="text-xl text-white/70">This invitation has expired. Please request a new one.</p>
          </div>
        </div>
      );
    }

    return <InviteAcceptance invitation={invitation} />;
  } catch (error) {
    console.error('Error loading invitation:', error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-xl text-white/70">Something went wrong loading the invitation.</p>
        </div>
      </div>
    );
  }
}

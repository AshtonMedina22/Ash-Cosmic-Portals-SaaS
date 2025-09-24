import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import TeamManagement from './_components/TeamManagement';

export default async function TeamPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  return <TeamManagement />;
}

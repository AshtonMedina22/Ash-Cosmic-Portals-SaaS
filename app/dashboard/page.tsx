import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import DashboardContent from './_components/DashboardContent';

export default async function DashboardPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  // If user is authenticated, show dashboard
  return <DashboardContent />;
}

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import LandingPageManager from './_components/LandingPageManager';

export default async function LandingPagesPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  return <LandingPageManager />;
}

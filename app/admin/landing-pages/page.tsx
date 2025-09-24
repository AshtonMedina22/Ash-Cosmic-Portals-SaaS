import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import LandingPageAdmin from './_components/LandingPageAdmin';

export default async function AdminLandingPagesPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  return <LandingPageAdmin />;
}

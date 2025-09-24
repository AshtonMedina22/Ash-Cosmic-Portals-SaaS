import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import LandingPageBuilder from './_components/LandingPageBuilder';

export default async function LandingPageBuilderPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  return <LandingPageBuilder />;
}

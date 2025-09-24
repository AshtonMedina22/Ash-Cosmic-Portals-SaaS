import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Hero from '@/components/Hero';
import FeatureIcons from '@/components/FeatureIcons';

export default async function Home() {
  const { userId } = await auth();

  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // If user is not authenticated, show landing page
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <FeatureIcons />
    </div>
  );
}

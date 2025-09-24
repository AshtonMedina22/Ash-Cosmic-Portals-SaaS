import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import NFCDiscovery from './_components/NFCDiscovery';

export default async function NFCDiscoveryPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  return <NFCDiscovery />;
}

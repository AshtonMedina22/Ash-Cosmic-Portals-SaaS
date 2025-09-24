import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import NFCDeviceManager from './_components/NFCDeviceManager';

export default async function DevicesPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  return <NFCDeviceManager />;
}

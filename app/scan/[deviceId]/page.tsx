import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import NFCLandingPage from './_components/NFCLandingPage';

interface ScanPageProps {
  params: {
    deviceId: string;
  };
}

export default async function ScanPage({ params }: ScanPageProps) {
  // Record the scan (we'll do this in the component)
  return <NFCLandingPage deviceId={params.deviceId} />;
}

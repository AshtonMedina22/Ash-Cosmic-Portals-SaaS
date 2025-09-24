import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import OrganizationsAdmin from './_components/OrganizationsAdmin';

export default async function AdminOrganizationsPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  return <OrganizationsAdmin />;
}

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import AdminDashboard from './_components/AdminDashboard';

export default async function AdminPage() {
  const { userId } = await auth();

  // If user is not authenticated, redirect to pricing page
  if (!userId) {
    redirect('/pricing');
  }

  // TODO: Add admin role check here
  // For now, allow access to any authenticated user
  // In production, you'd check if user has admin role

  return <AdminDashboard />;
}

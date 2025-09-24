'use client';

import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PaymentSuccess from '@/components/PaymentSuccess';
import { getUserOrganizationData, getOrganizationStats } from '@/lib/supabase/user-org';

const DashboardContent = () => {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [orgData, setOrgData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Handle payment success redirect
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const planType = searchParams.get('plan');
    
    if (paymentStatus === 'success') {
      setShowSuccessMessage(true);
      // Clear the URL parameters after showing the message
      router.replace('/dashboard');
      
      // Hide success message after 8 seconds (handled by PaymentSuccess component)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  // Fetch organization data when user is loaded
  useEffect(() => {
    if (user && isLoaded) {
      const fetchOrgData = async () => {
        try {
          setLoading(true);
          const data = await getUserOrganizationData(user.id);
          if (data) {
            setOrgData(data);
            const orgStats = await getOrganizationStats(data.organization.id);
            setStats(orgStats);
          }
        } catch (error) {
          console.error('Error fetching organization data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrgData();
    }
  }, [user, isLoaded]);

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading your organization data...</p>
        </div>
      </div>
    );
  }

  // Not signed in state
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70 mb-8">
            You need to be signed in to access the dashboard.
          </p>
          <a
            href="/sign-in"
            className="group relative inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white font-semibold transition-all hover:bg-white/5"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100" />
            <span className="absolute inset-0.5 rounded-full bg-black/50" />
            <span className="relative font-medium">Sign In</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Payment Success Message */}
      {showSuccessMessage && (
        <PaymentSuccess onClose={() => setShowSuccessMessage(false)} />
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Welcome Section */}
            <div className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
                  Welcome to {orgData?.organization?.name || 'Cosmic Portals'}, {user.firstName}!
                </h1>
                <p className="text-xl text-white/70 max-w-2xl">
                  {orgData?.organization?.name === 'Party Time Texas' 
                    ? 'Your corporate engagement platform is ready. Manage multiple landing pages, NFC tracking, analytics, and business events.'
                    : 'Your NFC-powered engagement platform is ready. Manage events, track analytics, and create memorable experiences.'
                  }
                </p>
                {orgData?.organization && (
                  <div className="mt-4 flex items-center gap-4">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                      {orgData.organization.plan_type} Plan
                    </span>
                    <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                      {orgData.organization.subscription_status}
                    </span>
                  </div>
                )}
            </div>

        {/* Dashboard Stats/Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* NFC Devices Card */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-400/20 rounded-xl p-6 hover:border-purple-400/40 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">NFC Devices</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              {stats?.nfcDevices || 0} active devices • Manage your NFC business cards, signage, and event badges
            </p>
            <a 
              href="/dashboard/devices"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 block text-center"
            >
              Manage Devices ({stats?.nfcDevices || 0})
            </a>
          </div>

          {/* Events Management Card */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-400/20 rounded-xl p-6 hover:border-blue-400/40 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Events</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              {stats?.events || 0} events • {stats?.attendees || 0} total attendees
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Manage Events ({stats?.events || 0})
            </button>
          </div>

          {/* Analytics Dashboard Card */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-400/20 rounded-xl p-6 hover:border-green-400/40 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Analytics</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              {stats?.totalScans || 0} total scans • Track engagement, conversions, and ROI
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              View Analytics ({stats?.totalScans || 0})
            </button>
          </div>
        </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-purple-400/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 text-purple-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  Create Event
                </button>
                <a 
                  href="/dashboard/devices"
                  className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
                >
                  Add NFC Device
                </a>
                <a 
                  href="/dashboard/team"
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-400/30 text-indigo-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
                >
                  Manage Team
                </a>
                <button className="bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 text-green-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  View Reports
                </button>
                <button className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-400/30 text-orange-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  Customize Branding
                </button>
              </div>
            </div>

            {/* Admin Section - Only for Cosmic Portals Super Admin */}
            {user?.emailAddresses?.[0]?.emailAddress === 'ashtonmedina22@gmail.com' && (
              <div className="bg-gradient-to-r from-red-900/10 to-orange-900/10 border border-red-400/20 rounded-xl p-8 mt-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Cosmic Portals Super Admin
                </h2>
                <p className="text-white/70 mb-6">Manage all organizations, landing pages, and platform analytics</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a 
                    href="/admin"
                    className="bg-red-600/20 hover:bg-red-600/30 border border-red-400/30 text-red-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
                  >
                    🏠 Admin Dashboard
                  </a>
                  <a 
                    href="/admin/landing-pages"
                    className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 text-purple-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
                  >
                    📄 Manage Landing Pages
                  </a>
                  <a 
                    href="/admin/organizations"
                    className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 block text-center"
                  >
                    🏢 Manage Organizations
                  </a>
                </div>
              </div>
            )}
      </div>
    </div>
  );
};

export default DashboardContent;

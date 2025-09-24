'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface AdminStats {
  totalOrganizations: number;
  totalLandingPages: number;
  totalNFCDevices: number;
  totalScans: number;
  activeUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'page_created' | 'device_registered' | 'scan_recorded' | 'user_signed_up';
  description: string;
  timestamp: string;
  organization_name: string;
}

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isLoaded) {
      fetchAdminData();
    }
  }, [user, isLoaded]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from Supabase
      const { data: organizations, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, created_at')
        .order('created_at', { ascending: false });

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, created_at')
        .order('created_at', { ascending: false });

      const { data: nfcDevices, error: devicesError } = await supabase
        .from('nfc_devices')
        .select('id, created_at');

      const { data: scans, error: scansError } = await supabase
        .from('nfc_scans')
        .select('id, created_at');

      // Calculate real stats
      const realStats: AdminStats = {
        totalOrganizations: organizations?.length || 0,
        totalLandingPages: 0, // No landing pages table yet
        totalNFCDevices: nfcDevices?.length || 0,
        totalScans: scans?.length || 0,
        activeUsers: users?.length || 0
      };

      // Get recent activity from real data
      const realActivity: RecentActivity[] = [];
      
      // Add organization creation activity
      if (organizations && organizations.length > 0) {
        organizations.slice(0, 3).forEach(org => {
          realActivity.push({
            id: `org_${org.id}`,
            type: 'user_signed_up',
            description: `${org.name} organization created`,
            timestamp: org.created_at,
            organization_name: org.name
          });
        });
      }

      // Add NFC device activity
      if (nfcDevices && nfcDevices.length > 0) {
        nfcDevices.slice(0, 2).forEach(device => {
          realActivity.push({
            id: `device_${device.id}`,
            type: 'device_registered',
            description: 'New NFC device registered',
            timestamp: device.created_at,
            organization_name: 'Unknown'
          });
        });
      }

      // Add scan activity
      if (scans && scans.length > 0) {
        scans.slice(0, 2).forEach(scan => {
          realActivity.push({
            id: `scan_${scan.id}`,
            type: 'scan_recorded',
            description: 'NFC scan recorded',
            timestamp: scan.created_at,
            organization_name: 'Unknown'
          });
        });
      }

      // Sort by timestamp and take most recent
      realActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const recentActivity = realActivity.slice(0, 4);

      setStats(realStats);
      setRecentActivity(recentActivity);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Fallback to empty data
      setStats({
        totalOrganizations: 0,
        totalLandingPages: 0,
        totalNFCDevices: 0,
        totalScans: 0,
        activeUsers: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
            Cosmic Portals Admin Dashboard
          </h1>
          <p className="text-xl text-white/70">
            Manage all organizations, landing pages, and user permissions
          </p>
        </div>

        {/* Admin Navigation */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/landing-pages"
            className="bg-gradient-to-r from-purple-900/20 to-purple-800/10 border border-purple-400/20 rounded-xl p-6 hover:border-purple-400/40 transition-colors duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Landing Pages</h3>
            </div>
            <p className="text-white/70 text-sm mb-2">Manage all landing pages</p>
            <p className="text-purple-300 font-semibold">{stats?.totalLandingPages || 0} pages</p>
          </Link>

          <Link
            href="/admin/organizations"
            className="bg-gradient-to-r from-blue-900/20 to-blue-800/10 border border-blue-400/20 rounded-xl p-6 hover:border-blue-400/40 transition-colors duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Organizations</h3>
            </div>
            <p className="text-white/70 text-sm mb-2">Manage organizations</p>
            <p className="text-blue-300 font-semibold">{stats?.totalOrganizations || 0} organizations</p>
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-400/20 rounded-xl p-6 hover:border-green-400/40 transition-colors duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Analytics</h3>
            </div>
            <p className="text-white/70 text-sm mb-2">View platform analytics</p>
            <p className="text-green-300 font-semibold">{stats?.totalScans || 0} total scans</p>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Organizations</p>
                <p className="text-2xl font-bold text-white">{stats?.totalOrganizations || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-600/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Landing Pages</p>
                <p className="text-2xl font-bold text-white">{stats?.totalLandingPages || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">NFC Devices</p>
                <p className="text-2xl font-bold text-white">{stats?.totalNFCDevices || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-600/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Scans</p>
                <p className="text-2xl font-bold text-white">{stats?.totalScans || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-600/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'page_created' ? 'bg-green-400' :
                    activity.type === 'device_registered' ? 'bg-blue-400' :
                    activity.type === 'scan_recorded' ? 'bg-orange-400' :
                    'bg-purple-400'
                  }`} />
                  <div>
                    <p className="text-white/70 text-sm">{activity.description}</p>
                    <p className="text-white/50 text-xs">{activity.organization_name}</p>
                  </div>
                </div>
                <div className="text-white/50 text-xs">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

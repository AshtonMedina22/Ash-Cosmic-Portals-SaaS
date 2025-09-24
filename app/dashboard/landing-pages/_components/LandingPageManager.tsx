'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getUserOrganizationData } from '@/lib/supabase/user-org';

const LandingPageManager = () => {
  const { user, isLoaded } = useUser();
  const [orgData, setOrgData] = useState<any>(null);
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isLoaded) {
      fetchData();
    }
  }, [user, isLoaded]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUserOrganizationData(user!.id);
      setOrgData(data);
      
      // Mock landing pages for now - in real app, fetch from database
      setLandingPages([
        {
          id: '1',
          name: 'Party Time Texas Main',
          url: `http://192.168.0.178:3000/landing/party-time-texas`,
          status: 'active',
          scans: 0,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLandingPage = async () => {
    // In real app, this would create a new landing page
    const newPage = {
      id: Date.now().toString(),
      name: 'New Landing Page',
      url: `http://192.168.0.178:3000/landing/new-page-${Date.now()}`,
      status: 'active',
      scans: 0,
      created_at: new Date().toISOString()
    };
    setLandingPages([...landingPages, newPage]);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading landing pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
            Landing Page Manager
          </h1>
          <p className="text-xl text-white/70">
            Create and manage custom landing pages for your NFC devices
          </p>
        </div>

        {/* Create New Landing Page */}
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-400/20 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Create New Landing Page</h3>
          <p className="text-white/70 mb-4">
            Build custom landing pages for your NFC devices. Each page can be customized with your branding, content, and call-to-actions.
          </p>
          <button
            onClick={createLandingPage}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            + Create Landing Page
          </button>
        </div>

        {/* Landing Pages List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Your Landing Pages</h2>
          
          {landingPages.map((page) => (
            <div key={page.id} className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{page.name}</h3>
                  <p className="text-white/70">Status: <span className="text-green-400 capitalize">{page.status}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-white/70">Scans: <span className="text-purple-400 font-semibold">{page.scans}</span></p>
                  <p className="text-white/70 text-sm">Created: {new Date(page.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-mono text-sm break-all">{page.url}</p>
              </div>
              
              <div className="flex gap-3">
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Preview
                </a>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
                  Edit
                </button>
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200">
                  Analytics
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How to Use */}
        <div className="mt-12 bg-blue-900/20 border border-blue-400/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">How to Use Landing Pages</h3>
          <div className="space-y-4 text-white/70">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">1.</span>
              <p>Create a landing page with your custom content and branding</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">2.</span>
              <p>Copy the landing page URL and program your NFC device to redirect to it</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">3.</span>
              <p>Track analytics and engagement from every scan</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">4.</span>
              <p>Customize content, add forms, social links, and more</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageManager;

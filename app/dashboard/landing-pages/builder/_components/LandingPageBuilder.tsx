'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getUserOrganizationData } from '@/lib/supabase/user-org';

const LandingPageBuilder = () => {
  const { user, isLoaded } = useUser();
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({
    name: 'Party Time Texas Landing Page',
    title: 'Welcome to Party Time Texas!',
    subtitle: 'Your premier event planning and corporate entertainment company',
    description: 'We specialize in creating unforgettable experiences for corporate events, private parties, and special occasions throughout Texas.',
    contact: {
      email: 'ashton@partytimetexas.com',
      phone: '(555) 123-4567',
      website: 'https://partytimetexas.com'
    },
    social: {
      facebook: 'https://facebook.com/partytimetexas',
      instagram: 'https://instagram.com/partytimetexas',
      linkedin: 'https://linkedin.com/company/partytimetexas'
    },
    branding: {
      primaryColor: '#FF1E56',
      secondaryColor: '#FF00FF',
      accentColor: '#00FFFF'
    }
  });

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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // In real app, this would save to database
    console.log('Saving landing page:', pageData);
    alert('Landing page saved! (This would save to database in production)');
  };

  const handlePublish = async () => {
    // In real app, this would publish the page
    console.log('Publishing landing page:', pageData);
    alert('Landing page published! (This would make it live in production)');
  };

  const handlePreview = () => {
    // Generate preview URL
    const previewUrl = `http://192.168.0.178:3000/landing/party-time-texas`;
    window.open(previewUrl, '_blank');
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading builder...</p>
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
            Landing Page Builder
          </h1>
          <p className="text-xl text-white/70">
            Create custom landing pages for your NFC devices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Builder Panel */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Page Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Page Name</label>
                  <input
                    type="text"
                    value={pageData.name}
                    onChange={(e) => setPageData({...pageData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                  <input
                    type="text"
                    value={pageData.title}
                    onChange={(e) => setPageData({...pageData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={pageData.subtitle}
                    onChange={(e) => setPageData({...pageData, subtitle: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                  <textarea
                    value={pageData.description}
                    onChange={(e) => setPageData({...pageData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                  <input
                    type="email"
                    value={pageData.contact.email}
                    onChange={(e) => setPageData({...pageData, contact: {...pageData.contact, email: e.target.value}})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={pageData.contact.phone}
                    onChange={(e) => setPageData({...pageData, contact: {...pageData.contact, phone: e.target.value}})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Website</label>
                  <input
                    type="url"
                    value={pageData.contact.website}
                    onChange={(e) => setPageData({...pageData, contact: {...pageData.contact, website: e.target.value}})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Social Media Links</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={pageData.social.facebook}
                    onChange={(e) => setPageData({...pageData, social: {...pageData.social, facebook: e.target.value}})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={pageData.social.instagram}
                    onChange={(e) => setPageData({...pageData, social: {...pageData.social, instagram: e.target.value}})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={pageData.social.linkedin}
                    onChange={(e) => setPageData({...pageData, social: {...pageData.social, linkedin: e.target.value}})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Branding Colors */}
            <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Branding Colors</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={pageData.branding.primaryColor}
                      onChange={(e) => setPageData({...pageData, branding: {...pageData.branding, primaryColor: e.target.value}})}
                      className="w-12 h-10 rounded border border-gray-600"
                    />
                    <input
                      type="text"
                      value={pageData.branding.primaryColor}
                      onChange={(e) => setPageData({...pageData, branding: {...pageData.branding, primaryColor: e.target.value}})}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={pageData.branding.secondaryColor}
                      onChange={(e) => setPageData({...pageData, branding: {...pageData.branding, secondaryColor: e.target.value}})}
                      className="w-12 h-10 rounded border border-gray-600"
                    />
                    <input
                      type="text"
                      value={pageData.branding.secondaryColor}
                      onChange={(e) => setPageData({...pageData, branding: {...pageData.branding, secondaryColor: e.target.value}})}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Publish Page
              </button>
              <button
                onClick={handlePreview}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-900/30 border border-gray-600/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
            <div className="bg-black rounded-lg p-4 min-h-[400px]">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">{pageData.title}</h1>
                <p className="text-purple-300 mb-4">{pageData.subtitle}</p>
                <p className="text-white/70 text-sm mb-6">{pageData.description}</p>
                
                <div className="space-y-2 text-sm text-white/60">
                  <p>📧 {pageData.contact.email}</p>
                  <p>📞 {pageData.contact.phone}</p>
                  <p>🌐 {pageData.contact.website}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageBuilder;

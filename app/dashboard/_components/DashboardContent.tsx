'use client';

import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PaymentSuccess from '@/components/PaymentSuccess';
import PDFSummarizer from './PDFSummarizer';

const DashboardContent = () => {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
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
            Welcome, {user.firstName}!
          </h1>
          <p className="text-xl text-white/70 max-w-2xl">
            Your AI-powered PDF analysis dashboard is ready. Upload documents and extract insights instantly.
          </p>
        </div>

        {/* Dashboard Stats/Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Upload Document Card */}
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-400/20 rounded-xl p-6 hover:border-purple-400/40 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Upload Document</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Drag and drop your PDF files or click to browse
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Choose File
            </button>
          </div>

          {/* Recent Analysis Card */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-400/20 rounded-xl p-6 hover:border-blue-400/40 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Recent Analysis</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              View your latest document insights and summaries
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              View All
            </button>
          </div>

          {/* Account Settings Card */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-400/20 rounded-xl p-6 hover:border-green-400/40 transition-colors duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-600/30 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Account Settings</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Manage your subscription and account preferences
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Settings
            </button>
          </div>
        </div>

        {/* PDF Summarizer Tool */}
        <div className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-purple-400/20 rounded-xl p-8">
          <PDFSummarizer />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-purple-400/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 text-purple-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Upload PDF
            </button>
            <button className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              View Reports
            </button>
            <button className="bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 text-green-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Export Data
            </button>
            <button className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-400/30 text-orange-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Get Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

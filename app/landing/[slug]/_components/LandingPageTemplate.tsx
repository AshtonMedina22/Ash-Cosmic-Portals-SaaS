'use client';

import { useEffect } from 'react';

interface LandingPageData {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

interface LandingPageTemplateProps {
  data: LandingPageData;
}

const LandingPageTemplate = ({ data }: LandingPageTemplateProps) => {
  useEffect(() => {
    // Track the landing page visit
    const trackVisit = async () => {
      try {
        await fetch('/api/track-scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceId: '04:70:94:EA:9F:20:90', // Your NFC tag ID
            scanType: 'landing_page_visit',
            metadata: {
              landing_page: data.id,
              referrer: document.referrer,
              timestamp: new Date().toISOString()
            }
          })
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [data.id]);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6">
              {data.title}
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              {data.subtitle}
            </p>

            <p className="text-lg text-white/60 mb-8 max-w-3xl mx-auto">
              {data.description}
            </p>

            {/* Contact Information */}
            <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
              <div className="space-y-2 text-white/70">
                <p><strong>Email:</strong> {data.contact.email}</p>
                <p><strong>Phone:</strong> {data.contact.phone}</p>
                <p><strong>Website:</strong> <a href={data.contact.website} className="text-purple-400 hover:text-purple-300">{data.contact.website}</a></p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${data.contact.email}`}
                className="group relative inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white font-semibold text-lg transition-all hover:bg-white/5"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100" />
                <span className="absolute inset-0.5 rounded-full bg-black/50" />
                <span className="relative font-bold">Contact Us</span>
              </a>
              
              <a
                href={data.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition-colors duration-300"
              >
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900/30 border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Connect With Us</h3>
          <div className="flex justify-center space-x-6">
            <a
              href={data.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={data.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
              </svg>
            </a>
            <a
              href={data.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Analytics Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900/30 border border-gray-600/30 rounded-xl p-4">
          <p className="text-xs text-white/50 text-center">
            Landing page visit tracked • {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPageTemplate;

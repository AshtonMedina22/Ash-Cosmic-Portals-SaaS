'use client';

import { useEffect, useState } from 'react';
import { getNFCDevice, recordNFCScan } from '@/lib/nfc';

interface NFCLandingPageProps {
  deviceId: string;
}

const NFCLandingPage = ({ deviceId }: NFCLandingPageProps) => {
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanRecorded, setScanRecorded] = useState(false);

  useEffect(() => {
    fetchDeviceAndRecordScan();
  }, [deviceId]);

  const fetchDeviceAndRecordScan = async () => {
    try {
      setLoading(true);
      
      // Get device details
      const deviceData = await getNFCDevice(deviceId);
      setDevice(deviceData);

      if (deviceData) {
        // Record the scan
        await recordNFCScan({
          organization_id: deviceData.organization_id,
          device_id: deviceData.id,
          scan_type: 'nfc_tap',
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
          location_data: await getLocationData(),
          utm_params: getUTMParams(),
          referrer: document.referrer
        });
        
        setScanRecorded(true);
      }

    } catch (error) {
      console.error('Error fetching device or recording scan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const getLocationData = async () => {
    try {
      if (navigator.geolocation) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            () => resolve(null),
            { timeout: 5000 }
          );
        });
      }
    } catch {
      return null;
    }
  };

  const getUTMParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Device Not Found</h1>
          <p className="text-white/70 mb-8">
            This NFC device doesn't exist or has been deactivated.
          </p>
        </div>
      </div>
    );
  }

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
            {/* Success Message */}
            {scanRecorded && (
              <div className="mb-8 p-4 bg-green-900/20 border border-green-400/30 rounded-xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400 font-semibold">Scan Recorded Successfully!</span>
                </div>
                <p className="text-white/70 text-sm">
                  Your engagement has been tracked. Thank you for connecting with us!
                </p>
              </div>
            )}

            {/* Welcome Message */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6">
              Welcome to {device.metadata?.name || 'Our Platform'}!
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              {device.metadata?.description || 'Thank you for scanning our NFC device. You\'re now connected to our digital ecosystem.'}
            </p>

            {/* Contact Information */}
            {device.metadata?.contact_email && (
              <div className="bg-gray-900/50 border border-gray-600/30 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-white mb-2">Get in Touch</h3>
                <p className="text-white/70 mb-4">
                  Contact: {device.metadata.assigned_to || 'Our Team'}
                </p>
                <a
                  href={`mailto:${device.metadata.contact_email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="group relative inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white font-semibold text-lg transition-all hover:bg-white/5"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100" />
                <span className="absolute inset-0.5 rounded-full bg-black/50" />
                <span className="relative font-bold">Visit Our Platform</span>
              </a>
              
              <button
                onClick={() => window.history.back()}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition-colors duration-300"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900/30 border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">About This Connection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">Device ID:</span>
              <span className="text-white font-mono ml-2">{device.device_id}</span>
            </div>
            <div>
              <span className="text-white/70">Scan Time:</span>
              <span className="text-white ml-2">{new Date().toLocaleString()}</span>
            </div>
            <div>
              <span className="text-white/70">Device Type:</span>
              <span className="text-white ml-2 capitalize">{device.device_type}</span>
            </div>
            <div>
              <span className="text-white/70">Status:</span>
              <span className="text-green-400 ml-2 capitalize">{device.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFCLandingPage;

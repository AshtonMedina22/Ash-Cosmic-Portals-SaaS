'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getUserOrganizationData } from '@/lib/supabase/user-org';
import { registerNFCDevice } from '@/lib/nfc';

const NFCDiscovery = () => {
  const { user, isLoaded } = useUser();
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcId, setNfcId] = useState<string>('');
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && isLoaded) {
      fetchOrgData();
      checkNFCSupport();
    }
  }, [user, isLoaded]);

  const fetchOrgData = async () => {
    try {
      const data = await getUserOrganizationData(user!.id);
      setOrgData(data);
    } catch (error) {
      console.error('Error fetching organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNFCSupport = () => {
    // Check if NFC is supported in the browser
    // Note: NDEFReader has very limited support, even on mobile
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    } else {
      // Even if NDEFReader is not available, we can still allow manual entry
      setNfcSupported(false);
    }
  };

  const handleNFCDiscovery = async () => {
    if (!nfcSupported) {
      alert('NFC is not supported in this browser. Please use Chrome on Android or Safari on iOS.');
      return;
    }

    try {
      // @ts-ignore - NDEFReader is not in TypeScript types yet
      const reader = new NDEFReader();
      await reader.scan();
      
      reader.addEventListener('reading', (event: any) => {
        const { serialNumber } = event;
        setNfcId(serialNumber);
        alert(`NFC Tag Discovered! ID: ${serialNumber}`);
      });

      reader.addEventListener('error', (error: any) => {
        console.error('NFC reading error:', error);
        alert('Error reading NFC tag. Make sure your device supports NFC and the tag is close to your phone.');
      });

    } catch (error) {
      console.error('NFC discovery error:', error);
      alert('Error accessing NFC. Please make sure NFC is enabled and try again.');
    }
  };

  const handleRegisterDevice = async () => {
    if (!nfcId || !orgData) return;

    try {
      setRegistering(true);
      
      await registerNFCDevice({
        organization_id: orgData.organization.id,
        device_id: nfcId,
        device_type: 'business_card',
        metadata: {
          name: 'Party Time Texas Keychain',
          description: 'Official Party Time Texas keychain with NFC',
          assigned_to: user?.firstName + ' ' + user?.lastName,
          contact_email: user?.emailAddresses[0]?.emailAddress,
          programmed_by: 'Cosmic Portals',
          programmed_date: new Date().toISOString(),
          device_type: 'keychain',
        },
      });

      setSuccess(true);
    } catch (error) {
      console.error('Error registering device:', error);
      alert('Error registering device. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
            Discover Your NFC Device
          </h1>
          <p className="text-xl text-white/70">
            Use your phone to discover and register your existing Party Time Texas keychain
          </p>
        </div>

        {/* NFC Support Check */}
        <div className="bg-gray-900/50 border border-purple-400/20 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">NFC Support Status</h3>
          {nfcSupported ? (
            <div className="flex items-center gap-3 text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>NFC is supported in your browser</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>NFC is not supported in this browser. Please use Chrome on Android or Safari on iOS.</span>
            </div>
          )}
        </div>

        {/* Discovery Instructions */}
        {nfcSupported ? (
          <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">How to Discover Your NFC Tag</h3>
            <ol className="list-decimal list-inside space-y-3 text-white/70">
              <li>Make sure NFC is enabled on your phone</li>
              <li>Hold your Party Time Texas keychain close to your phone</li>
              <li>Click "Discover NFC Tag" below</li>
              <li>Your phone will read the NFC tag and show the ID</li>
              <li>Register the device to start tracking analytics</li>
            </ol>
          </div>
        ) : (
          <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Register Your Party Time Texas Keychain</h3>
            <p className="text-white/70 mb-4">
              Since NFC discovery isn't available in this browser, you can manually register your keychain device. 
              This will allow you to start tracking analytics and engagement data.
            </p>
            <div className="bg-blue-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">What happens after registration:</h4>
              <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                <li>Your keychain will be added to your Party Time Texas account</li>
                <li>You'll be able to track scans and engagement analytics</li>
                <li>Generate QR codes and NFC URLs for your device</li>
                <li>View real-time analytics in your dashboard</li>
              </ul>
            </div>
          </div>
        )}

        {/* Discovery Options */}
        <div className="text-center mb-8">
          {nfcSupported ? (
            <button
              onClick={handleNFCDiscovery}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Discover NFC Tag
            </button>
          ) : (
            <div className="bg-gray-800/50 border border-gray-600/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Device Registration</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    NFC Device ID (optional)
                  </label>
                  <input
                    type="text"
                    value={nfcId}
                    onChange={(e) => setNfcId(e.target.value)}
                    placeholder="Enter your NFC device ID or leave blank for auto-generated"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    If you don't know your NFC device ID, we'll generate one for you
                  </p>
                </div>
                <button
                  onClick={() => setNfcId('ptt_keychain_' + Date.now())}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Generate Device ID
                </button>
              </div>
            </div>
          )}
        </div>

        {/* NFC ID Display */}
        {nfcId && (
          <div className="bg-green-900/20 border border-green-400/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              {nfcSupported ? 'NFC Tag Discovered!' : 'Device ID Ready!'}
            </h3>
            <div className="bg-black/50 rounded-lg p-4 mb-4">
              <p className="text-green-400 font-mono text-sm break-all">{nfcId}</p>
            </div>
            <p className="text-white/70 mb-4">
              {nfcSupported 
                ? 'This is your NFC tag ID. Click "Register Device" to add it to your Party Time Texas account.'
                : 'This device ID is ready for registration. Click "Register Device" to add it to your Party Time Texas account.'
              }
            </p>
            <button
              onClick={handleRegisterDevice}
              disabled={registering}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {registering ? 'Registering...' : 'Register Device'}
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-semibold text-white">Device Registered Successfully!</h3>
            </div>
            <p className="text-white/70 mb-4">
              Your Party Time Texas keychain is now registered and ready to track analytics.
            </p>
            <a
              href="/dashboard/devices"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              View All Devices
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFCDiscovery;

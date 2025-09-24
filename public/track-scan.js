// Cosmic Portals NFC Scan Tracking Script
// Add this to your link.bio page to track scans

(function() {
  'use strict';
  
  // Configuration
  const DEVICE_ID = '04:70:94:EA:9F:20:90'; // Your NFC Tag ID
  const TRACKING_URL = 'https://192.168.0.178:3000/api/track-scan'; // Your Cosmic Portals URL
  
  // Track the scan
  function trackScan() {
    const metadata = {
      location: getLocationData(),
      utm: getUTMParams(),
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      page: window.location.href
    };

    fetch(TRACKING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: DEVICE_ID,
        scanType: 'nfc_tap',
        metadata: metadata
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Scan tracked successfully:', data);
    })
    .catch(error => {
      console.error('Error tracking scan:', error);
    });
  }

  // Get location data if available
  function getLocationData() {
    if (navigator.geolocation) {
      // Note: This requires user permission
      return null; // We'll get this when user allows
    }
    return null;
  }

  // Get UTM parameters
  function getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      urlm_content: urlParams.get('utm_content')
    };
  }

  // Track immediately when script loads
  trackScan();

  // Also track on page visibility change (in case user switches tabs)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      trackScan();
    }
  });

})();

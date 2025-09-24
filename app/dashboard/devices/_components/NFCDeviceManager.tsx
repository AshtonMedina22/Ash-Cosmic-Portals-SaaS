'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getUserOrganizationData } from '@/lib/supabase/user-org';
import { registerNFCDevice, getNFCDevices, deleteNFCDevice } from '@/lib/nfc';

interface NFCDevice {
  id: string;
  device_id: string;
  device_type: string;
  status: string;
  last_scan?: string;
  scan_count: number;
  metadata: any;
  created_at: string;
}

const NFCDeviceManager = () => {
  const { user, isLoaded } = useUser();
  const [devices, setDevices] = useState<NFCDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_type: 'business_card',
    name: '',
    description: '',
    assigned_to: '',
    contact_email: '',
  });

  useEffect(() => {
    if (user && isLoaded) {
      fetchDevices();
    }
  }, [user, isLoaded]);

  const fetchDevices = async () => {
    try {
      const orgData = await getUserOrganizationData(user!.id);
      if (orgData) {
        const deviceList = await getNFCDevices(orgData.organization.id);
        setDevices(deviceList);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orgData = await getUserOrganizationData(user!.id);
      if (orgData) {
        // Generate a unique device ID for the client
        const deviceId = `ptt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        await registerNFCDevice({
          organization_id: orgData.organization.id,
          device_id: deviceId,
          device_type: newDevice.device_type as any,
          status: 'active',
          metadata: {
            name: newDevice.name,
            description: newDevice.description,
            assigned_to: newDevice.assigned_to,
            contact_email: newDevice.contact_email,
            programmed_by: 'Cosmic Portals',
            programmed_date: new Date().toISOString(),
          },
        });
        
        setNewDevice({ device_type: 'business_card', name: '', description: '', assigned_to: '', contact_email: '' });
        setShowAddForm(false);
        fetchDevices();
      }
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this NFC device?')) {
      try {
        await deleteNFCDevice(deviceId);
        fetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading NFC devices...</p>
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
            NFC Device Management
          </h1>
          <p className="text-xl text-white/70">
            Register and manage your NFC devices for engagement tracking
          </p>
        </div>

        {/* Add Device Buttons */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {showAddForm ? 'Cancel' : '+ Add New Device'}
          </button>
          <a
            href="/dashboard/devices/discover"
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            🔍 Discover Existing NFC
          </a>
        </div>

        {/* Add Device Form */}
        {showAddForm && (
          <div className="bg-gray-900/50 border border-purple-400/20 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Register New NFC Device</h3>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-4">
                <p className="text-blue-200 text-sm">
                  <strong>Note:</strong> NFC Tag ID will be automatically generated and programmed by Cosmic Portals before shipping to your client.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Device Type
                  </label>
                  <select
                    value={newDevice.device_type}
                    onChange={(e) => setNewDevice({ ...newDevice, device_type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="business_card">Business Card</option>
                    <option value="signage">Signage</option>
                    <option value="event_badge">Event Badge</option>
                    <option value="table_tent">Table Tent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Assigned To (Client Name)
                  </label>
                  <input
                    type="text"
                    value={newDevice.assigned_to}
                    onChange={(e) => setNewDevice({ ...newDevice, assigned_to: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                    placeholder="e.g., John Smith, Sarah Johnson"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  placeholder="e.g., John's Business Card, Sarah's Event Badge"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Client Contact Email
                </label>
                <input
                  type="email"
                  value={newDevice.contact_email}
                  onChange={(e) => setNewDevice({ ...newDevice, contact_email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  placeholder="client@company.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description
                </label>
                <textarea
                  value={newDevice.description}
                  onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                  placeholder="Brief description of this NFC device and its purpose..."
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Register Device
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Devices List */}
        <div className="space-y-4">
          {devices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No NFC Devices Yet</h3>
              <p className="text-white/70 mb-6">Register your first NFC device to start tracking engagement</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Add Your First Device
              </button>
            </div>
          ) : (
            devices.map((device) => (
              <div key={device.id} className="bg-gray-900/50 border border-purple-400/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{device.metadata?.name || device.device_id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        device.status === 'active' 
                          ? 'bg-green-600/20 text-green-300' 
                          : 'bg-gray-600/20 text-gray-300'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">{device.metadata?.description || 'No description'}</p>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span>ID: {device.device_id}</span>
                      <span>Type: {device.device_type.replace('_', ' ')}</span>
                      <span>Assigned to: {device.metadata?.assigned_to || 'Unassigned'}</span>
                      <span>Scans: {device.scan_count}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/50 mt-2">
                      <span>Contact: {device.metadata?.contact_email || 'No email'}</span>
                      {device.last_scan && (
                        <span>Last scan: {new Date(device.last_scan).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteDevice(device.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NFCDeviceManager;

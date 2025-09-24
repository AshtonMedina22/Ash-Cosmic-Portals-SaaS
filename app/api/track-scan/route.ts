import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { deviceId, scanType = 'nfc_tap', metadata = {} } = await request.json();

    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // First, find the device by device_id (NFC tag ID)
    const { data: device, error: deviceError } = await supabase
      .from('nfc_devices')
      .select('id')
      .eq('device_id', deviceId)
      .single();

    if (deviceError || !device) {
      console.error('Device not found:', deviceError);
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Record the scan using the device's UUID
    const { data: scan, error } = await supabase
      .from('nfc_scans')
      .insert({
        device_id: device.id, // Use the UUID from the device record
        scan_type: scanType,
        ip_address: ip,
        user_agent: userAgent,
        location_data: metadata.location || null,
        utm_params: metadata.utm || null,
        referrer: metadata.referrer || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording scan:', error);
      return NextResponse.json({ error: 'Failed to record scan' }, { status: 500 });
    }

    // Update device scan count (get current count first, then increment)
    const { data: currentDevice } = await supabase
      .from('nfc_devices')
      .select('scan_count')
      .eq('id', device.id)
      .single();

    const newScanCount = (currentDevice?.scan_count || 0) + 1;

    await supabase
      .from('nfc_devices')
      .update({ 
        scan_count: newScanCount,
        last_scan: new Date().toISOString()
      })
      .eq('id', device.id);

    return NextResponse.json({ 
      success: true, 
      scanId: scan.id,
      message: 'Scan recorded successfully' 
    });

  } catch (error) {
    console.error('Error in track-scan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId');

  if (!deviceId) {
    return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
  }

  try {
    // First, find the device by device_id (NFC tag ID)
    const { data: device, error: deviceError } = await supabase
      .from('nfc_devices')
      .select('id')
      .eq('device_id', deviceId)
      .single();

    if (deviceError || !device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Get scan analytics for the device
    const { data: scans, error } = await supabase
      .from('nfc_scans')
      .select('*')
      .eq('device_id', device.id) // Use the UUID from the device record
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scans:', error);
      return NextResponse.json({ error: 'Failed to fetch scans' }, { status: 500 });
    }

    return NextResponse.json({ 
      scans: scans || [],
      totalScans: scans?.length || 0
    });

  } catch (error) {
    console.error('Error in track-scan GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verify all the real data was created successfully
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
  try {
    console.log('🔍 Verifying Cosmic Portals data...\n');
    
    // Check organizations
    const { data: orgs, error: orgError } = await supabase.from('organizations').select('*');
    if (orgError) throw orgError;
    console.log('📊 Organizations:');
    orgs.forEach(org => {
      console.log(`  - ${org.name} (${org.slug}) - Plan: ${org.plan_type}`);
    });
    
    // Check users
    const { data: users, error: userError } = await supabase.from('users').select('*');
    if (userError) throw userError;
    console.log('\n👥 Users:');
    users.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Check NFC devices
    const { data: devices, error: deviceError } = await supabase.from('nfc_devices').select('*');
    if (deviceError) throw deviceError;
    console.log('\n📱 NFC Devices:');
    devices.forEach(device => {
      console.log(`  - ${device.device_id} (${device.device_type}) - Status: ${device.status}`);
    });
    
    // Check events
    const { data: events, error: eventError } = await supabase.from('events').select('*');
    if (eventError) throw eventError;
    console.log('\n🎉 Events:');
    events.forEach(event => {
      console.log(`  - ${event.name} (${event.event_type}) - Status: ${event.status}`);
    });
    
    // Check attendees
    const { data: attendees, error: attendeeError } = await supabase.from('attendees').select('*');
    if (attendeeError) throw attendeeError;
    console.log('\n👤 Attendees:');
    attendees.forEach(attendee => {
      console.log(`  - ${attendee.name} (${attendee.email}) - Plus ones: ${attendee.plus_ones}`);
    });
    
    console.log('\n✅ All data verified successfully!');
    console.log('\n🎯 Ready to build Cosmic Portals features!');
    
  } catch (err) {
    console.error('❌ Error verifying data:', err.message);
  }
}

verifyData();

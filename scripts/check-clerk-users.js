// Check what users are actually in Clerk
// This will help us connect the real Clerk accounts to Supabase

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  try {
    console.log('🔍 Checking current Supabase users...\n');
    
    // Check what users we have in Supabase
    const { data: users, error: userError } = await supabase.from('users').select('*');
    if (userError) throw userError;
    
    console.log('📊 Current Supabase users:');
    users.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.email})`);
      console.log(`    Clerk ID: ${user.clerk_id}`);
      console.log(`    Organization: ${user.organization_id}`);
      console.log('');
    });
    
    console.log('🎯 Next steps:');
    console.log('1. We need to get your real Clerk user IDs');
    console.log('2. Update the Supabase records with the real Clerk IDs');
    console.log('3. Connect your accounts to the right organizations');
    
  } catch (err) {
    console.error('❌ Error checking users:', err.message);
  }
}

checkUsers();

// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey.substring(0, 20) + '...');
    
    // Test connection by querying the organizations table
    const { data, error } = await supabase.from('organizations').select('*').limit(1);
    
    if (error) {
      console.log('❌ Error querying organizations table:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('✅ Organizations table found and accessible');
    console.log('Current organizations count:', data.length);
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Ready to set up database schema!');
    console.log('Next steps:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste the schema from lib/database/cosmic-portals-schema.sql');
    console.log('3. Run the SQL to create all tables');
  }
});

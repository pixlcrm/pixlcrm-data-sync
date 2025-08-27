#!/usr/bin/env node

/**
 * Database setup script for PixlCRM CORE
 * Creates a default subaccount for testing
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please make sure your .env.local file has:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🔧 Setting up database...');

  try {
    // Check if default subaccount exists
    const { data: existingSubaccount, error: checkError } = await supabase
      .from('subaccounts')
      .select('*')
      .eq('ghl_location_id', 'default-test-location')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Error checking subaccount: ${checkError.message}`);
    }

    if (existingSubaccount) {
      console.log('✅ Default subaccount already exists');
      console.log(`   ID: ${existingSubaccount.id}`);
      console.log(`   GHL Location ID: ${existingSubaccount.ghl_location_id}`);
      return existingSubaccount.id;
    }

    // Create default subaccount
    const { data: newSubaccount, error: insertError } = await supabase
      .from('subaccounts')
      .insert({
        ghl_location_id: 'default-test-location',
        agency_name: 'Test Agency'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error creating subaccount: ${insertError.message}`);
    }

    console.log('✅ Default subaccount created successfully');
    console.log(`   ID: ${newSubaccount.id}`);
    console.log(`   GHL Location ID: ${newSubaccount.ghl_location_id}`);
    console.log(`   Agency Name: ${newSubaccount.agency_name}`);

    return newSubaccount.id;

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase().then(() => {
    console.log('\n🎉 Database setup complete!');
    console.log('You can now test the webhook with: node test-webhook.js');
  });
}

module.exports = { setupDatabase };

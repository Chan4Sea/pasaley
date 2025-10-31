// SQL script to create required tables if they don't exist
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('🔧 Creating database tables...');

    // Create stores table
    const { error: storesError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS stores (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          lat DECIMAL(10, 8) NOT NULL,
          lng DECIMAL(11, 8) NOT NULL,
          address TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);
        CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(lat, lng);
      `
    });

    if (storesError) {
      console.log('⚠️ Stores table may already exist');
    } else {
      console.log('✅ Stores table created');
    }

    // Create products table
    const { error: productsError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
          unit TEXT,
          image_url TEXT,
          in_stock BOOLEAN DEFAULT true,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
        CREATE INDEX IF NOT EXISTS idx_products_stock ON products(in_stock);
      `
    });

    if (productsError) {
      console.log('⚠️ Products table may already exist');
    } else {
      console.log('✅ Products table created');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('📋 Tables created: stores, products');
    console.log('🚀 Ready to populate sample data');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

// Run the setup
createTables();
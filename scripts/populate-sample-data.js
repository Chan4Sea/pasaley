// Script to populate sample store and product data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample stores around Kathmandu (within 10km of city center)
const sampleStores = [
  {
    name: "FreshMart Downtown",
    description: "Local grocery store with fresh produce and daily essentials",
    lat: 27.7172,
    lng: 85.3240,
    address: "New Road, Kathmandu 44600",
    is_active: true,
  },
  {
    name: "Buddha Restaurant & Grocery",
    description: "Traditional Nepali cuisine and fresh ingredients",
    lat: 27.7200,
    lng: 85.3280,
    address: "Thamel, Kathmandu 44621",
    is_active: true,
  },
  {
    name: "Kanti Children's Hospital Pharmacy",
    description: "Medical supplies and pharmaceutical products",
    lat: 27.7100,
    lng: 85.3200,
    address: "Kanti Children's Hospital, Kathmandu",
    is_active: true,
  },
  {
    name: "Nepal Food Market",
    description: "Fresh vegetables, fruits, and local produce",
    lat: 27.7300,
    lng: 85.3150,
    address: "Asan, Kathmandu 44620",
    is_active: true,
  },
  {
    name: "Mountain View Grocery",
    description: "Organic and locally sourced food products",
    lat: 27.7050,
    lng: 85.3350,
    address: "Patan Durbar Square, Patan",
    is_active: true,
  },
  {
    name: "Himalaya Electronics Store",
    description: "Home appliances and electronics",
    lat: 27.7280,
    lng: 85.3400,
    address: "Lagankhel, Patan",
    is_active: true,
  },
  {
    name: "Bhrikuti Fashion Store",
    description: "Traditional and modern clothing",
    lat: 27.6920,
    lng: 85.3100,
    address: "Tripureshwor, Kathmandu",
    is_active: true,
  },
  {
    name: "Sagarmatha Pharmacy",
    description: "24/7 pharmacy with medicines and health products",
    lat: 27.7420,
    lng: 85.3420,
    address: "Koteshwor, Kathmandu",
    is_active: true,
  }
];

// Sample products for each store
const sampleProducts = [
  // FreshMart Downtown products
  { store_name: "FreshMart Downtown", products: [
    { name: "Fresh Apples", price_cents: 25000, unit: "kg", image_url: null, in_stock: true },
    { name: "Bananas", price_cents: 12000, unit: "dozen", image_url: null, in_stock: true },
    { name: "Tomatoes", price_cents: 8000, unit: "kg", image_url: null, in_stock: true },
    { name: "Onions", price_cents: 6000, unit: "kg", image_url: null, in_stock: true },
    { name: "Rice (Basmati)", price_cents: 120000, unit: "kg", image_url: null, in_stock: true },
  ]},
  // Buddha Restaurant products
  { store_name: "Buddha Restaurant & Grocery", products: [
    { name: "Momo (Dumplings)", price_cents: 5000, unit: "plate", image_url: null, in_stock: true },
    { name: "Dal Bhat", price_cents: 8000, unit: "thali", image_url: null, in_stock: true },
    { name: "Newari Mutton", price_cents: 15000, unit: "plate", image_url: null, in_stock: true },
    { name: "Fresh Milk", price_cents: 8000, unit: "liter", image_url: null, in_stock: true },
    { name: "Yogurt", price_cents: 12000, unit: "kg", image_url: null, in_stock: true },
  ]},
  // Nepal Food Market products
  { store_name: "Nepal Food Market", products: [
    { name: "Fresh Spinach", price_cents: 4000, unit: "bunch", image_url: null, in_stock: true },
    { name: "Carrots", price_cents: 5000, unit: "kg", image_url: null, in_stock: true },
    { name: "Potatoes", price_cents: 3500, unit: "kg", image_url: null, in_stock: true },
    { name: "Green Chilies", price_cents: 3000, unit: "kg", image_url: null, in_stock: true },
    { name: "Fresh Fish", price_cents: 20000, unit: "kg", image_url: null, in_stock: true },
  ]},
  // Mountain View Grocery products
  { store_name: "Mountain View Grocery", products: [
    { name: "Organic Honey", price_cents: 18000, unit: "jar", image_url: null, in_stock: true },
    { name: "Buckwheat Flour", price_cents: 15000, unit: "kg", image_url: null, in_stock: true },
    { name: "Millet", price_cents: 12000, unit: "kg", image_url: null, in_stock: true },
    { name: "Herbal Tea", price_cents: 8000, unit: "pack", image_url: null, in_stock: true },
    { name: "Almonds", price_cents: 25000, unit: "kg", image_url: null, in_stock: true },
  ]},
  // Sagarmatha Pharmacy products
  { store_name: "Sagarmatha Pharmacy", products: [
    { name: "Paracetamol", price_cents: 5000, unit: "strip", image_url: null, in_stock: true },
    { name: "Vitamin C", price_cents: 12000, unit: "bottle", image_url: null, in_stock: true },
    { name: "Bandages", price_cents: 3000, unit: "pack", image_url: null, in_stock: true },
    { name: "Hand Sanitizer", price_cents: 8000, unit: "bottle", image_url: null, in_stock: true },
    { name: "Face Masks", price_cents: 2000, unit: "pack", image_url: null, in_stock: true },
  ]},
];

async function populateData() {
  try {
    console.log('🚀 Starting to populate sample data...');

    // Step 1: Insert sample stores
    console.log('📍 Inserting sample stores...');
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .insert(sampleStores)
      .select();

    if (storesError) {
      console.error('❌ Error inserting stores:', storesError);
      return;
    }

    console.log(`✅ Successfully inserted ${stores.length} stores`);

    // Step 2: Create store name to ID mapping
    const storeMap = {};
    stores.forEach(store => {
      storeMap[store.name] = store.id;
    });

    // Step 3: Insert sample products
    console.log('🛒 Inserting sample products...');
    const allProducts = [];

    for (const storeData of sampleProducts) {
      const storeId = storeMap[storeData.store_name];
      if (!storeId) {
        console.warn(`⚠️ Store not found: ${storeData.store_name}`);
        continue;
      }

      const products = storeData.products.map(product => ({
        ...product,
        store_id: storeId,
      }));

      allProducts.push(...products);
    }

    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(allProducts)
      .select();

    if (productsError) {
      console.error('❌ Error inserting products:', productsError);
      return;
    }

    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

    // Step 4: Summary
    console.log('\n📊 POPULATION COMPLETE!');
    console.log(`📍 Stores: ${stores.length}`);
    console.log(`🛒 Products: ${insertedProducts.length}`);
    console.log('🌍 Sample stores around Kathmandu (within 10km radius)');

    // Display stores
    stores.forEach(store => {
      console.log(`   • ${store.name} - ${store.address}`);
    });

    console.log('\n✅ Data ready for testing!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
populateData();
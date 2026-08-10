import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { INITIAL_LAPTOPS, ACCESSORIES } from '../src/data';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Starting migration to Supabase...');
  
  const allLaptops = [...INITIAL_LAPTOPS, ...ACCESSORIES];
  
  const dbLaptops = allLaptops.map(laptop => ({
    id: laptop.id,
    name: laptop.name,
    brand: laptop.brand,
    original_price: laptop.originalPrice,
    price: laptop.price,
    ram: laptop.ram,
    storage: laptop.storage,
    cpu: laptop.cpu,
    gpu: laptop.gpu || null,
    screen: laptop.screen || null,
    battery: laptop.battery || null,
    condition_outer: laptop.conditionOuter,
    condition_screen: laptop.conditionScreen,
    condition_score: laptop.conditionScore || null,
    status_badge: laptop.statusBadge || null,
    image: laptop.image,
    images: laptop.images || [laptop.image],
    seller_note_author: laptop.sellerNote?.author || null,
    seller_note_role: laptop.sellerNote?.role || null,
    seller_note_avatar: laptop.sellerNote?.avatar || null,
    seller_note_text: laptop.sellerNote?.text || null,
    featured: laptop.featured || false,
    category: laptop.category,
    currency: laptop.currency || 'SAR'
  }));

  console.log(`Prepared ${dbLaptops.length} laptops for upload.`);

  // Upload one by one to avoid conflicts and report progress
  for (const item of dbLaptops) {
    const { error } = await supabase
      .from('laptops')
      .upsert(item, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Failed to upsert laptop ${item.name}:`, error.message);
    } else {
      console.log(`✅ Upserted: ${item.name}`);
    }
  }

  console.log('Migration finished!');
}

seed().catch(err => {
  console.error('Fatal error during seed:', err);
});

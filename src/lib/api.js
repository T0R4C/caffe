
import { supabase, isSupabaseConfigured } from './supabase.js';
import { getDemoCafes } from './demo-data.js';

export async function getCafes(options = {}) {
  if (isSupabaseConfigured()) {
    let query = supabase.from('cafes').select('*, areas(name, slug)');
    if (options.area) query = query.eq('areas.slug', options.area);
    if (options.limit) query = query.limit(options.limit);
    
    const { data, error } = await query;
    if (error) {
      console.error(error);
      return getDemoCafes(); // fallback
    }
    return data;
  }
  return getDemoCafes();
}

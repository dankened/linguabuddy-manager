
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jdsjtwtgsmyaveigkfdc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkc2p0d3Rnc215YXZlaWdrZmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDM5MDksImV4cCI6MjA1OTAxOTkwOX0.AQggDsLEfvqsRAxqAzUjrbIcCFER2vguqzzUe-fO_Po";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
  }
});

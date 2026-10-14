import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey
  ? createClient(url, anonKey)
  : null;

// This demo intentionally does not connect to or write real patient data.
// Add real auth, schema, and Row Level Security policies before production use.

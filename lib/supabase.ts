import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/schema"; // Ensure correct import

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;

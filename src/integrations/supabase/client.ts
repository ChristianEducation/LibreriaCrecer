import { createClient } from "@supabase/supabase-js";

let storageClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseStorageClient() {
  if (storageClient) {
    return storageClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables",
    );
  }

  storageClient = createClient(supabaseUrl, supabaseAnonKey);
  return storageClient;
}

// This client is for Supabase Storage only.
// Database queries in this project must go through Drizzle ORM.

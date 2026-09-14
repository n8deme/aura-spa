import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Client service-role : réservé aux routes serveur, ne jamais exposer au navigateur.
// La RLS est activée sur toutes les tables ; ce client la contourne volontairement.
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      throw new Error(
        "Variables Supabase manquantes : SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY."
      );
    }
    client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

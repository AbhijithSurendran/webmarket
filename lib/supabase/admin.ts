import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

/**
 * Admin/service-role client for server actions (bypasses RLS).
 * NEVER use on the client side.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // If variables missing, return a mock or null (avoiding crash on dev server startup)
    // The previous conversations indicate the user has transitioned to a local file-based CMS
    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase environment variables missing. Falling back to local/mock mode.")
        // Return a proxy that just logs and returns empty data to prevent runtime crashes
        // in actions that might still mistakenly call it.
        return new Proxy({}, {
            get(target, prop) {
                return function () {
                    return { select: () => ({ data: [], error: null }), insert: () => ({ data: null, error: null }), update: () => ({ data: null, error: null }), delete: () => ({ data: null, error: null }) }
                }
            }
        }) as any;
    }

    return createSupabaseClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    )
}

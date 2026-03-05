import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/database"

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        // Return a proxy that just logs and returns empty data
        return new Proxy({}, {
            get(target, prop) {
                return function () {
                    return { select: () => ({ data: [], error: null }), insert: () => ({ data: null, error: null }), update: () => ({ data: null, error: null }), delete: () => ({ data: null, error: null }) }
                }
            }
        }) as any;
    }

    return createBrowserClient<Database>(
        supabaseUrl,
        supabaseKey
    )
}

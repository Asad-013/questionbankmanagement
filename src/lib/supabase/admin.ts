import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client — bypasses ALL RLS.
 * Use only in server actions / route handlers. Never expose to the client.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        // Log a more helpful warning instead of just throwing a generic error
        console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Using standard anon key for now (RLS will apply).')
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!url || !anonKey) {
            throw new Error('Missing Supabase URL or Anon Key. Check your .env file.')
        }

        return createClient(url, anonKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
    }

    return createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

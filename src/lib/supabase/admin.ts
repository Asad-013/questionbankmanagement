import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client — bypasses ALL RLS.
 * Use only in server actions / route handlers. Never expose to the client.
 *
 * SECURITY FIX (VULN-06): Removed silent fallback to anon key.
 * Previously, if SUPABASE_SERVICE_ROLE_KEY was missing, the function silently
 * returned an anon-key client, creating an unpredictable security posture and
 * leaking internal configuration details to users in error messages.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
        // Fail hard — no silent fallback. A missing service_role key is a
        // deployment misconfiguration that must be surfaced immediately.
        throw new Error(
            'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
            'This is required for privileged server-side operations. ' +
            'Add it to your environment configuration.'
        )
    }

    return createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

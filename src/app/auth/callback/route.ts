import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Default to / profile or homepage if no next redirect path is provided
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && user) {
            // Check if user profile exists in public.users table
            const { data: profile } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .maybeSingle()

            if (!profile) {
                // Use admin client to create the profile to ensure reliability and bypass potential RLS limits
                const adminSupabase = createAdminClient()
                const { error: profileError } = await adminSupabase.from('users').insert({
                    id: user.id,
                    email: user.email as string,
                    role: 'student',
                })
                if (profileError) {
                    console.error('Failed to auto-create user profile on OAuth callback:', profileError)
                }
            }
            
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Redirect to login with a generic error code if something fails
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}

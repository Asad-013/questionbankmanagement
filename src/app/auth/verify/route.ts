import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') ?? 'signup'
    const next = searchParams.get('next') ?? '/login?msg=email-confirmed'

    if (token_hash) {
        const supabase = await createClient()
        
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as EmailOtpType,
        })

        if (!error && data.user) {
            // Check if user profile exists in public.users table
            const { data: profile } = await supabase
                .from('users')
                .select('id')
                .eq('id', data.user.id)
                .maybeSingle()

            if (!profile) {
                // Use admin client to create the profile to ensure reliability
                const adminSupabase = createAdminClient()
                const { error: profileError } = await adminSupabase.from('users').insert({
                    id: data.user.id,
                    email: data.user.email as string,
                    role: 'student',
                })
                if (profileError) {
                    console.error('Failed to auto-create user profile on OTP verification:', profileError)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Redirect to login with a verification failure query param
    return NextResponse.redirect(`${origin}/login?error=verification-failed`)
}

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes accessible without authentication
const PUBLIC_PATHS = ['/', '/apply', '/apply/success']
const PUBLIC_PREFIXES = ['/reset-password', '/_next', '/api/public', '/auth']

// Auth pages — redirect away if already logged in
const AUTH_PATHS = ['/login', '/register', '/forgot-password']

// Protected route prefixes — require authentication
const PROTECTED_PREFIXES = ['/admin', '/moderator', '/upload', '/profile', '/notifications', '/feedback']

function isPublicPath(pathname: string): boolean {
    if (PUBLIC_PATHS.includes(pathname)) return true
    if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true
    return false
}

function isAuthPath(pathname: string): boolean {
    return AUTH_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))
}

function isProtectedPath(pathname: string): boolean {
    return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

/**
 * SECURITY FIX (VULN-04): Middleware now enforces route-level authentication
 * and redirects, not just session refresh.
 *
 * Previously, middleware only refreshed the Supabase session cookie but did not
 * protect any route. All protection was in layout files which can be bypassed
 * via direct HTTP requests to page routes.
 */
export async function updateSession(request: NextRequest) {
    const { pathname } = request.nextUrl

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Always call getUser() to refresh the session token.
    // Do NOT use getSession() here — it reads from cookies which can be
    // tampered with. getUser() validates with the Supabase Auth server.
    const { data: { user } } = await supabase.auth.getUser()

    // Redirect unauthenticated users away from protected routes
    if (!user && isProtectedPath(pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        // Preserve the intended destination for post-login redirect
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages (login, register, etc.)
    if (user && isAuthPath(pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

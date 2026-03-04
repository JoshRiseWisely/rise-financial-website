import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/admin']

// Routes accessible only when NOT authenticated (redirect to dashboard if already logged in)
const AUTH_ONLY_PATHS = ['/admin/login']

// Routes that are always public (no auth check needed)
const PUBLIC_PREFIXES = [
  '/api/auth/login',
  '/api/auth/logout',
  '/_next',
  '/favicon.ico',
  '/public',
  '/images',
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(path))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware entirely for static/public assets
  if (isPublicPath(pathname)) {
    return NextResponse.next({ request })
  }

  // Build a mutable response that carries cookie updates forward
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          // Write to both request (for downstream Server Components) and response (for browser)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Use getUser() not getSession() — getUser() validates the JWT with Supabase's server.
  // getSession() only reads from the cookie and can be spoofed.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = !!user

  // If the path requires auth and user is not authenticated → redirect to login
  if (isProtectedPath(pathname) && !isAuthenticated) {
    // Skip the auth-only path itself (don't redirect /admin/login to /admin/login)
    if (!isAuthOnlyPath(pathname)) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If user is already authenticated and hits an auth-only page (e.g. login) → redirect to dashboard
  if (isAuthOnlyPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Optionally: check profile is_active flag for extra security on admin routes
  if (isProtectedPath(pathname) && isAuthenticated && !isAuthOnlyPath(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active, role')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_active) {
      // Kill the session and redirect
      await supabase.auth.signOut()
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'account_disabled')
      return NextResponse.redirect(loginUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     *
     * We handle public/ and api/public routes in middleware logic above.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

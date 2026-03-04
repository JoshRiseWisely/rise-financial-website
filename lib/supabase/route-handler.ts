import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { UserRole } from '@/types/auth'

export type AuthResult = {
  supabase: ReturnType<typeof createServerClient>
  user: { id: string; email?: string }
  profile: {
    id: string
    email: string
    full_name: string
    role: UserRole
    avatar_url: string | null
    is_active: boolean
  }
}

/**
 * Creates an authenticated Supabase client for API route handlers.
 * Returns the client, user, and profile — or a NextResponse error.
 */
export async function getAuthenticatedClient(): Promise<AuthResult | NextResponse> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, avatar_url, is_active')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (!profile.is_active) {
    return NextResponse.json({ error: 'Account is disabled' }, { status: 403 })
  }

  return { supabase, user, profile: profile as AuthResult['profile'] }
}

/** Type guard: checks if the result is an error response */
export function isErrorResponse(result: AuthResult | NextResponse): result is NextResponse {
  return result instanceof NextResponse
}

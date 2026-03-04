/**
 * Client-side auth helpers for Rise Financial Partners admin panel.
 * All functions run in the browser and use the browser Supabase client.
 */

import { createClient } from '@/lib/supabase/client'
import type { AppUser, UserRole } from '@/types/auth'
import { getUserPermissions } from '@/lib/auth/permissions'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthState {
  user: AppUser | null
  permissions: ReturnType<typeof getUserPermissions> | null
  loading: boolean
  error: string | null
}

export interface LoginResult {
  success: boolean
  user?: AppUser
  error?: string
}

export interface LogoutResult {
  success: boolean
  error?: string
}

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * Log in with email and password.
 * Calls the /api/auth/login route which validates the session server-side.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? 'Login failed',
      }
    }

    return {
      success: true,
      user: data.user as AppUser,
    }
  } catch (err) {
    console.error('[auth/client] login error:', err)
    return {
      success: false,
      error: 'Network error. Please try again.',
    }
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

/**
 * Log out the current user.
 * Clears server-side session cookies via the API route, then clears local state.
 */
export async function logout(): Promise<LogoutResult> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? 'Logout failed',
      }
    }

    return { success: true }
  } catch (err) {
    console.error('[auth/client] logout error:', err)
    return {
      success: false,
      error: 'Network error during logout.',
    }
  }
}

// ─── Current User ─────────────────────────────────────────────────────────────

/**
 * Fetch the current authenticated user and their permissions.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<{
  user: AppUser
  permissions: ReturnType<typeof getUserPermissions>
} | null> {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) return null

    const data = await response.json()
    return {
      user: data.user as AppUser,
      permissions: data.permissions,
    }
  } catch (err) {
    console.error('[auth/client] getCurrentUser error:', err)
    return null
  }
}

// ─── Session Listener ─────────────────────────────────────────────────────────

/**
 * Subscribe to auth state changes using Supabase's client-side listener.
 * Useful for reacting to token expiry, tab-sync of sign-outs, etc.
 *
 * @returns Unsubscribe function — call it on component unmount.
 */
export function onAuthStateChange(
  callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | string, userId: string | null) => void
): () => void {
  const supabase = createClient()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user?.id ?? null)
  })

  return () => subscription.unsubscribe()
}

// ─── Role Guard Helpers ───────────────────────────────────────────────────────

/**
 * Check if a role meets the minimum required role level.
 * Order: compliance < advisor < admin
 */
const ROLE_RANK: Record<UserRole, number> = {
  compliance: 1,
  advisor: 2,
  admin: 3,
}

export function hasMinRole(userRole: UserRole, minRole: UserRole): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[minRole]
}

/**
 * Returns true if the user has the exact role.
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole === requiredRole
}

/**
 * Returns true if the user has admin role.
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin'
}

export type UserRole = 'admin' | 'advisor' | 'compliance'

export interface AppUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Session {
  user: AppUser
  accessToken: string
  expiresAt: number
}

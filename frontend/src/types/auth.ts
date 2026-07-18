export interface User {
  id: string
  email: string
  full_name: string | null
  auth_provider: string
  profile_picture: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  last_login: string | null
  has_onboarded: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// 认证相关类型定义
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: SignupCredentials) => Promise<void>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  user: User
  session: {
    access_token: string
    refresh_token: string
  }
}

export interface AuthError {
  message: string
  status?: number
}

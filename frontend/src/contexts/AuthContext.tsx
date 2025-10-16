'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { authService, type AuthUser } from '@/services/authService'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<{ error: any }>
  setUser: (user: AuthUser | null) => void    // ✅ 添加 setter 方法
  setSession: (session: Session | null) => void  // ✅ 添加 setter 方法
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      try {
        const currentSession = await authService.getCurrentSession()
        const currentUser = await authService.getCurrentUser()
        
        setSession(currentSession)
        setUser(currentUser)
      } catch (error) {
        console.error('获取初始会话失败:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 监听认证状态变化
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session)
        
        if (event === 'SIGNED_IN' && session) {
          const userData = await authService.getCurrentUser()
          setSession(session)
          setUser(userData)
          
          // 存储到本地存储
          localStorage.setItem('auth_token', session.access_token)
          localStorage.setItem('user_session', JSON.stringify({
            user: userData,
            session: session,
            loginTime: new Date().toISOString()
          }))
          
          // 如果在注册页面，跳转到仪表板
          if (typeof window !== 'undefined' && window.location.pathname.includes('/auth/signup')) {
            setTimeout(() => {
              window.location.href = '/dashboard'
            }, 500)
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          
          // 清除本地存储
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_session')
          localStorage.removeItem('sb-auth-token')
          
          // 如果当前不在登录页面，跳转到登录页面
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login'
          }
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true)
      const { user: newUser, session: newSession, error } = await authService.signUp({
        email,
        password,
        name
      })

      if (!error && newUser && newSession) {
        setUser(newUser)
        setSession(newSession)
        
        // 存储到本地存储
        localStorage.setItem('auth_token', newSession.access_token)
        localStorage.setItem('user_session', JSON.stringify({
          user: newUser,
          session: newSession,
          loginTime: new Date().toISOString()
        }))
      }

      return { error }
    } catch (error) {
      console.error('注册失败:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { user: newUser, session: newSession, error } = await authService.signIn({
        email,
        password
      })

      if (!error && newUser && newSession) {
        setUser(newUser)
        setSession(newSession)
        
        // 存储到本地存储
        localStorage.setItem('auth_token', newSession.access_token)
        localStorage.setItem('user_session', JSON.stringify({
          user: newUser,
          session: newSession,
          loginTime: new Date().toISOString()
        }))
      }

      return { error }
    } catch (error) {
      console.error('登录失败:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await authService.signOut()
      
      if (!error) {
        setUser(null)
        setSession(null)
      }

      return { error }
    } catch (error) {
      console.error('登出失败:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPassword(email)
      return { error }
    } catch (error) {
      console.error('重置密码失败:', error)
      return { error }
    }
  }

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    try {
      const { error } = await authService.updateProfile(updates)
      
      if (!error) {
        // 更新本地用户状态
        const updatedUser = await authService.getCurrentUser()
        setUser(updatedUser)
      }

      return { error }
    } catch (error) {
      console.error('更新资料失败:', error)
      return { error }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    setUser,    // ✅ 暴露 setter 方法
    setSession  // ✅ 暴露 setter 方法
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

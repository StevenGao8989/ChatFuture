import { supabase } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser | null
  session: Session | null
  error: AuthError | null
}

class AuthService {
  /**
   * 邮箱注册
   */
  async signUp({ email, password, name }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0], // 如果没有提供姓名，使用邮箱前缀
          }
        }
      })

      if (error) {
        console.error('注册失败:', error)
        return { user: null, session: null, error }
      }

      // 转换用户数据格式
      const authUser: AuthUser | null = data.user ? {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        avatar_url: data.user.user_metadata?.avatar_url,
        created_at: data.user.created_at
      } : null

      return { user: authUser, session: data.session, error: null }
    } catch (err) {
      console.error('注册异常:', err)
      return { 
        user: null, 
        session: null, 
        error: { message: '注册失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 邮箱登录
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      // 首先检查是否有认证错误（用户不存在、密码错误等）
      if (error) {
        console.error('登录失败:', error)
        
        // 根据错误类型提供更友好的错误信息
        if (error.message.includes('Invalid login credentials')) {
          return { 
            user: null, 
            session: null, 
            error: { message: '邮箱或密码错误，请检查后重试' } as any
          }
        }
        
        return { user: null, session: null, error }
      }

      // 只有在登录成功的情况下才检查删除状态
      if (data.user?.user_metadata?.deleted) {
        console.log('用户账户已被删除，但返回统一错误信息')
        // 登出用户
        await supabase.auth.signOut()
        return { 
          user: null, 
          session: null, 
          error: { message: '邮箱或密码错误，请检查后重试' } as any
        }
      }

      // 转换用户数据格式
      const authUser: AuthUser | null = data.user ? {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        avatar_url: data.user.user_metadata?.avatar_url,
        created_at: data.user.created_at
      } : null

      return { user: authUser, session: data.session, error: null }
    } catch (err) {
      console.error('登录异常:', err)
      return { 
        user: null, 
        session: null, 
        error: { message: '登录失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 登出
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      // 清除本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_session')
      localStorage.removeItem('sb-auth-token')
      
      return { error }
    } catch (err) {
      console.error('登出异常:', err)
      return { 
        error: { message: '登出失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 获取当前用户
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      // 检查用户是否已被标记为删除
      if (user.user_metadata?.deleted) {
        console.log('用户账户已被删除，自动登出')
        await supabase.auth.signOut()
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at
      }
    } catch (err) {
      console.error('获取用户信息异常:', err)
      return null
    }
  }

  /**
   * 获取当前会话
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        return null
      }

      return session
    } catch (err) {
      console.error('获取会话异常:', err)
      return null
    }
  }

  /**
   * 发送邮箱验证码
   */
  async sendEmailVerification(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      return { error }
    } catch (err) {
      console.error('发送验证码异常:', err)
      return { 
        error: { message: '发送验证码失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 验证邮箱验证码
   */
  async verifyEmailCode(email: string, token: string): Promise<AuthResponse> {
    try {
      console.log('开始验证邮箱验证码:', { email, token, type: 'email' })
      
      // ✅ 关键修复：直接使用 'email' 类型，不要尝试 'signup'
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'  // 邮箱验证码必须使用 'email' 类型
      })
      
      console.log('Supabase验证结果:', { data, error })

      if (error) {
        console.error('验证码验证失败:', error)
        return { user: null, session: null, error }
      }

      // 检查是否获得了session
      if (!data.session) {
        console.error('验证成功但未获得session，可能是Supabase Email OTP设置问题')
        return { 
          user: null, 
          session: null, 
          error: { message: '验证成功但未创建会话，请检查Supabase Email OTP设置', name: 'AuthError' } as AuthError 
        }
      }

      // 转换用户数据格式
      const authUser: AuthUser | null = data.user ? {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        avatar_url: data.user.user_metadata?.avatar_url,
        created_at: data.user.created_at
      } : null

      return { user: authUser, session: data.session, error: null }
    } catch (err) {
      console.error('验证码验证异常:', err)
      return { 
        user: null, 
        session: null, 
        error: { message: '验证码验证失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      return { error }
    } catch (err) {
      console.error('重置密码异常:', err)
      return { 
        error: { message: '重置密码失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 使用验证码重置密码
   */
  async resetPasswordWithCode(email: string, token: string, newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return { error }
    } catch (err) {
      console.error('重置密码异常:', err)
      return { 
        error: { message: '重置密码失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 直接修改密码（需要用户已登录）
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return { error }
    } catch (err) {
      console.error('修改密码异常:', err)
      return { 
        error: { message: '修改密码失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 删除账户（需要用户已登录）
   * 注意：Supabase客户端无法直接删除用户，需要服务器端处理
   * 这里我们标记用户为删除状态，并清除本地数据
   */
  async deleteAccount(): Promise<{ error: AuthError | null }> {
    try {
      // 获取当前用户
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      
      if (getUserError || !user) {
        return { error: getUserError || { message: '用户未找到' } as any }
      }

      // 在用户元数据中标记为已删除
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          ...user.user_metadata,
          deleted: true,
          deleted_at: new Date().toISOString()
        }
      })

      if (updateError) {
        console.error('标记用户删除状态失败:', updateError)
        // 即使标记失败，也继续执行登出和清理
      }

      // 登出用户
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error('登出失败:', signOutError)
        // 即使登出失败，也清除本地数据
      }

      // 清除所有本地存储
      localStorage.clear()
      sessionStorage.clear()

      return { error: null }
    } catch (err) {
      console.error('删除账户异常:', err)
      return { 
        error: { message: '删除账户失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }

  /**
   * 监听认证状态变化
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  /**
   * 检查用户是否已登录
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession()
      return !!session
    } catch (err) {
      console.error('检查认证状态异常:', err)
      return false
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      })

      return { error }
    } catch (err) {
      console.error('更新用户资料异常:', err)
      return { 
        error: { message: '更新失败，请重试', name: 'AuthError' } as AuthError 
      }
    }
  }
}

export const authService = new AuthService()

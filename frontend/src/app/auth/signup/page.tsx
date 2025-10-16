'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Chrome, Github, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, user, loading: authLoading, setUser, setSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // ✅ 简化：只保留基本的用户登录检查，避免与router.replace竞态
  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/dashboard')
    }
  }, [user, authLoading, router])

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    // 清除该字段的错误信息
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const setFieldError = (field: string, message: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: message
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    // 清除所有字段错误
    setFieldErrors({})
    
    let hasErrors = false

    // 验证用户名
    if (!credentials.name || credentials.name.trim().length < 2) {
      setFieldError('name', '请输入有效的用户名（至少2个字符）')
      hasErrors = true
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(credentials.email)) {
      setFieldError('email', '请输入有效的邮箱地址')
      hasErrors = true
    }

    // 验证密码长度
    if (credentials.password.length < 6) {
      setFieldError('password', '密码长度至少为6位')
      hasErrors = true
    }

    // 验证密码匹配
    if (credentials.password !== credentials.confirmPassword) {
      setFieldError('confirmPassword', '密码不匹配，请重新输入')
      hasErrors = true
    }

    if (hasErrors) {
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await signUp(credentials.email, credentials.password, credentials.name)
      
      if (error) {
        setError(error.message || '注册失败，请重试')
        return
      }

      // 注册成功，进入验证步骤
      setStep('verify')
      setSuccessMessage('注册成功！请检查您的邮箱获取验证码。')
      setError(null)
      setCountdown(60) // 60秒倒计时
      
    } catch (err) {
      console.error('注册异常:', err)
      setError('注册失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!credentials.verificationCode) {
      setError('请输入验证码')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { user, session, error } = await authService.verifyEmailCode(credentials.email, credentials.verificationCode)
      
      console.log('验证码验证结果:', { user, session, error })
      
      if (error) {
        console.error('验证码验证失败:', error)
        setError(error.message || '验证码无效，请重试')
        setIsSubmitting(false)
        return
      }

      // 检查是否获得了session
      if (!session) {
        setError('验证成功但未创建会话，请检查Supabase Email OTP设置')
        setIsSubmitting(false)
        return
      }

      // ✅ 关键修复：显式设置全局会话状态
      if (setUser && setSession) {
        setUser(user)
        setSession(session)
      }

      // 存储用户会话到localStorage（备份）
      localStorage.setItem('auth_token', session.access_token)
      localStorage.setItem('user_session', JSON.stringify({
        user: user,
        session: session,
        loginTime: new Date().toISOString()
      }))

      setSuccessMessage('验证成功！正在进入仪表板...')

      // ✅ 使用 router 替代 window.location，避免竞态
      router.replace('/dashboard')
      
    } catch (err) {
      console.error('验证码验证异常:', err)
      setError('验证失败，请重试')
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError(null)

    try {
      const { error } = await authService.sendEmailVerification(credentials.email)
      
      if (error) {
        setError(error.message || '发送验证码失败，请重试')
        return
      }

      setCountdown(60)
      setSuccessMessage('验证码已重新发送，请检查您的邮箱')
    } catch (err) {
      console.error('发送验证码异常:', err)
      setError('发送验证码失败，请重试')
    } finally {
      setIsResending(false)
    }
  }

  const handleSocialSignup = async (provider: 'google' | 'github') => {
    try {
      // 这里应该调用社交注册API
      console.log('社交注册:', provider)
    } catch (err) {
      setError('社交注册失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex">
      {/* 左侧内容区域 - 与主页面风格一致 */}
      <div className="flex w-1/2 relative overflow-hidden animate-fadeInLeft">
        {/* 自然背景 - 心理学友好的绿色调 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 天空渐变 - 淡绿色到浅蓝绿色 */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-emerald-200"></div>
          
          {/* 多层山脉背景 - 营造探索感 */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3">
            {/* 最远山脉 */}
            <div className="absolute bottom-0 left-0 w-full h-full">
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-300 to-green-200 rounded-t-full transform scale-110 opacity-60"></div>
            </div>
            
            {/* 中间山脉 */}
            <div className="absolute bottom-0 left-1/4 w-3/4 h-full">
              <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-emerald-400 to-green-300 rounded-t-full opacity-70"></div>
            </div>
            
            {/* 最近山脉 */}
            <div className="absolute bottom-0 right-0 w-2/3 h-full">
              <div className="absolute bottom-0 right-0 w-full h-3/5 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-full opacity-80"></div>
            </div>
          </div>

          {/* 探索路径 - 象征成长旅程 */}
          <div className="absolute bottom-20 right-0 w-48 h-2 bg-amber-400 rounded-full opacity-70 transform rotate-12"></div>
          
          {/* 自然装饰 - 植物叶子 */}
          <div className="absolute bottom-0 right-8 w-16 h-16 opacity-30 animate-float">
            <div className="w-full h-full bg-green-600 rounded-full transform rotate-45"></div>
          </div>
          <div className="absolute bottom-0 right-16 w-12 h-12 opacity-25 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-full h-full bg-emerald-700 rounded-full transform rotate-12"></div>
          </div>

          {/* 探索者角色 - 代表用户的成长旅程 */}
          <div className="absolute bottom-24 right-20 animate-walk">
            <div className="relative">
              {/* 身体 */}
              <div className="w-16 h-20 bg-gradient-to-b from-teal-400 to-emerald-500 rounded-full relative">
                {/* 头部 */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full"></div>
                {/* 头发 */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-amber-800 rounded-full"></div>
                {/* 眼睛 */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-3 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute -top-5 left-1/2 transform translate-x-2 w-1 h-1 bg-black rounded-full"></div>
                {/* 微笑 */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1 w-2 h-1 border-b-2 border-black rounded-full"></div>
              </div>
              
              {/* 背包 */}
              <div className="absolute -right-2 top-4 w-6 h-8 bg-amber-600 rounded transform rotate-12"></div>
              
              {/* 腿部 */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
            </div>
          </div>

          {/* 浮动云朵 - 营造轻松氛围 */}
          <div className="absolute top-20 left-10 w-32 h-16 bg-white bg-opacity-40 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-24 h-12 bg-white bg-opacity-35 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* 中央标题文字 */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          {/* 装饰性图标背景 */}
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <h1 className="text-4xl font-bold text-green-800 mb-4 relative z-10">
              ChatFuture
            </h1>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* 副标题装饰 */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-16 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-full opacity-60"></div>
            <p className="text-xl text-green-700 mb-2 font-semibold">
              AI职业规划与形象生成平台
            </p>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-12 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 rounded-full opacity-40"></div>
          </div>
          
          <p className="text-lg text-green-600 mt-4">
            探索兴趣，遇见更好的自己
          </p>
        </div>
      </div>

      {/* 右侧注册表单区域 */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white animate-fadeInRight">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              {/* 用户头像占位符 */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                加入我们
              </h2>
              <p className="text-gray-600">
                开始你的职业探索之旅
              </p>
            </div>
            
            <div className="space-y-6">
              {/* 社交注册 */}
              <div className="space-y-3">
                <button
                  onClick={() => handleSocialSignup('google')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <Chrome className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">使用 Google 注册</span>
                </button>
                <button
                  onClick={() => handleSocialSignup('github')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <Github className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">使用 GitHub 注册</span>
                </button>
              </div>

              {/* 分隔线 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">或</span>
                </div>
              </div>

              {/* 注册表单 */}
              <form onSubmit={step === 'verify' ? handleVerifyCode : handleSubmit} className="space-y-4">
                {/* 基本信息输入 - 只在注册步骤显示 */}
                {step === 'register' && (
                  <>
                    {/* 姓名输入 */}
                    <div className="space-y-2">
                      <input
                        id="name"
                        type="text"
                        value={credentials.name}
                        onChange={handleInputChange('name')}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                        placeholder="用户名 "
                        required
                        onInvalid={(e) => {
                          e.preventDefault()
                          setFieldError('name', '请输入用户名')
                        }}
                      />
                      {fieldErrors.name && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-red-600 text-xs font-medium">!</span>
                            </div>
                            <p className="text-sm text-red-700 font-medium">{fieldErrors.name}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 邮箱输入 */}
                    <div className="space-y-2">
                      <input
                        id="email"
                        type="email"
                        value={credentials.email}
                        onChange={handleInputChange('email')}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                        placeholder="邮箱地址"
                        required
                        onInvalid={(e) => {
                          e.preventDefault()
                          setFieldError('email', '请输入有效的邮箱地址')
                        }}
                      />
                      {fieldErrors.email && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-red-600 text-xs font-medium">!</span>
                            </div>
                            <p className="text-sm text-red-700 font-medium">{fieldErrors.email}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 密码输入 */}
                    <div className="space-y-2">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={handleInputChange('password')}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                        placeholder="密码"
                        required
                        minLength={6}
                        onInvalid={(e) => {
                          e.preventDefault()
                          setFieldError('password', '密码长度至少为6位')
                        }}
                      />
                      {fieldErrors.password && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-red-600 text-xs font-medium">!</span>
                            </div>
                            <p className="text-sm text-red-700 font-medium">{fieldErrors.password}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 确认密码输入 */}
                    <div className="space-y-2">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={credentials.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                        placeholder="确认密码"
                        required
                        onInvalid={(e) => {
                          e.preventDefault()
                          setFieldError('confirmPassword', '请确认密码')
                        }}
                      />
                      {fieldErrors.confirmPassword && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-red-600 text-xs font-medium">!</span>
                            </div>
                            <p className="text-sm text-red-700 font-medium">{fieldErrors.confirmPassword}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* 验证步骤信息 */}
                {step === 'verify' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">验证邮箱</p>
                        <p className="text-xs text-blue-600">已发送验证码到 {credentials.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 验证码输入 - 只在验证步骤显示 */}
                {step === 'verify' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      邮箱验证码
                    </label>
                    <div className="flex space-x-3">
                      <input
                        id="verificationCode"
                        type="text"
                        value={credentials.verificationCode}
                        onChange={handleInputChange('verificationCode')}
                        className="flex-1 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                        placeholder="请输入6位验证码"
                        maxLength={6}
                        required
                        onInvalid={(e) => {
                          e.preventDefault()
                          setFieldError('verificationCode', '请输入验证码')
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isResending || countdown > 0}
                        className="px-4 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl transition-colors whitespace-nowrap flex items-center space-x-2"
                      >
                        {isResending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : countdown > 0 ? (
                          <span>{countdown}s</span>
                        ) : (
                          <span>重新发送</span>
                        )}
                      </button>
                    </div>
                    {fieldErrors.verificationCode && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-xs font-medium">!</span>
                          </div>
                          <p className="text-sm text-red-700 font-medium">{fieldErrors.verificationCode}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 错误信息 */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-sm font-medium">!</span>
                      </div>
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* 成功信息 */}
                {successMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-sm font-medium">✓</span>
                      </div>
                      <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* 隐私政策 */}
                <div className="text-sm text-gray-500">
                  <p>
                    注册即表示你同意我们的{' '}
                    <a href="#" className="text-green-600 hover:underline">服务条款</a>
                    {' '}和{' '}
                    <a href="#" className="text-green-600 hover:underline">隐私政策</a>
                  </p>
                </div>

                {/* 注册按钮 */}
                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl transition-all duration-200 font-medium text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{step === 'verify' ? '验证中...' : '注册中...'}</span>
                    </div>
                  ) : (
                    step === 'verify' ? '验证邮箱' : '注册'
                  )}
                </button>
              </form>

              {/* 登录链接和返回按钮 */}
              <div className="text-center space-y-2">
                {step === 'verify' && (
                  <button
                    onClick={() => setStep('register')}
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
                  >
                    返回上一步
                  </button>
                )}
                <p className="text-sm text-gray-600">
                  已有账户？{' '}
                  <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                    立即登录
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

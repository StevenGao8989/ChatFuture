'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Lock, Phone, MessageSquare, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn, user, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'account' | 'email' | 'phone'>('account')
  const [credentials, setCredentials] = useState({
    account: '',
    email: '',
    password: '',
    phone: '',
    verificationCode: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSendingCode, setIsSendingCode] = useState(false)

  // 如果用户已登录，重定向到仪表板
  useEffect(() => {
    if (user && !authLoading) {
      window.location.href = '/dashboard'
    }
  }, [user, authLoading])

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Supabase邮箱登录
      if (loginMethod === 'email') {
        if (!credentials.email || !credentials.password) {
          setError('请填写完整的邮箱和密码')
          return
        }

        const { error } = await signIn(credentials.email, credentials.password)
        
        if (error) {
          setError(error.message || '登录失败，请检查邮箱和密码')
          return
        }

        // 登录成功，AuthContext会自动更新状态，不需要手动跳转
        // 页面会在useEffect中自动跳转到dashboard
        return
      } else if (loginMethod === 'phone') {
        if (!credentials.phone || !credentials.verificationCode) {
          setError('请填写完整的手机号和验证码')
          return
        }
        // 手机号登录暂未实现
        setError('手机号登录功能暂未开放，请使用邮箱登录')
        return
      } else {
        // 账号登录 - 尝试作为邮箱登录
        if (!credentials.account || !credentials.password) {
          setError('请填写完整的账号和密码')
          return
        }

        // 尝试将账号作为邮箱进行登录
        const { error } = await signIn(credentials.account, credentials.password)
        
        if (error) {
          setError(error.message || '登录失败，请检查账号和密码')
          return
        }

        // 登录成功，AuthContext会自动更新状态，不需要手动跳转
        // 页面会在useEffect中自动跳转到dashboard
        return
      }
    } catch (err) {
      console.error('登录异常:', err)
      setError('登录失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendVerificationCode = async () => {
    if (!credentials.phone) {
      setError('请输入手机号码')
      return
    }

    setIsSendingCode(true)
    try {
      // 这里应该调用发送验证码API
      console.log('发送验证码到:', credentials.phone)
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      setError(null)
    } catch (err) {
      setError('发送验证码失败，请重试')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleWeChatLogin = async () => {
    try {
      // 这里应该调用微信登录API
      console.log('微信登录')
      // 模拟跳转到微信授权页面
      window.location.href = '/auth/wechat'
    } catch (err) {
      setError('微信登录失败，请重试')
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

        {/* 中央标题文字 - 增大字体 */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          {/* 装饰性图标背景 */}
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <h1 className="text-6xl font-bold text-green-800 mb-6 relative z-10">
              ChatFuture
            </h1>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* 副标题装饰 */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-16 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-full opacity-60"></div>
            <p className="text-2xl text-green-700 mb-3 font-semibold">
              AI职业规划与形象生成平台
            </p>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-12 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 rounded-full opacity-40"></div>
          </div>
          
          <p className="text-xl text-green-600 mt-6">
            探索兴趣，遇见更好的自己
          </p>
        </div>
      </div>

      {/* 右侧登录表单区域 */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white animate-fadeInRight">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="text-center mb-8">
              {/* 用户头像占位符 - 完全按照图片设计 */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                  <User className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                欢迎回来
              </h2>
              <p className="text-gray-600">
                登录你的账户继续探索
              </p>
            </div>
            
            <div className="space-y-6">
              {/* 三个登录选项 */}
              <div className="grid grid-cols-1 gap-3">
                {/* 微信登录 */}
                <button
                  onClick={handleWeChatLogin}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>微信登录</span>
                </button>

                {/* 账号登录 */}
                <button
                  onClick={() => setLoginMethod('account')}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium ${
                    loginMethod === 'account'
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5 mr-2" />
                  <span>账号登录</span>
                </button>

                {/* 邮箱登录 */}
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium ${
                    loginMethod === 'email'
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  <span>邮箱登录</span>
                </button>

                {/* 手机号码登录 */}
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium ${
                    loginMethod === 'phone'
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  <span>手机号码登录</span>
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

              {/* 登录表单 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 账号登录表单 */}
                {loginMethod === 'account' && (
                  <div className="space-y-4">
                    {/* 账号输入 */}
                    <div className="space-y-2">
                      <input
                        id="account"
                        type="text"
                        value={credentials.account}
                        onChange={handleInputChange('account')}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                        placeholder="账号"
                        required
                      />
                    </div>

                    {/* 密码输入 */}
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={credentials.password}
                          onChange={handleInputChange('password')}
                          className="w-full px-4 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                          placeholder="密码"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 邮箱登录表单 */}
                {loginMethod === 'email' && (
                  <>
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
                      />
                    </div>

                    {/* 密码输入 */}
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          id="emailPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={credentials.password}
                          onChange={handleInputChange('password')}
                          className="w-full px-4 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                          placeholder="密码"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* 手机号码登录表单 */}
                {loginMethod === 'phone' && (
                  <>
                    {/* 手机号输入 */}
                    <div className="space-y-2">
                      <input
                        id="phone"
                        type="tel"
                        value={credentials.phone}
                        onChange={handleInputChange('phone')}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                        placeholder="手机号码"
                        required
                      />
                    </div>

                    {/* 验证码输入 */}
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          id="verificationCode"
                          type="text"
                          value={credentials.verificationCode}
                          onChange={handleInputChange('verificationCode')}
                          className="flex-1 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-700"
                          placeholder="验证码"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleSendVerificationCode}
                          disabled={isSendingCode || !credentials.phone}
                          className="px-4 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl transition-colors whitespace-nowrap"
                        >
                          {isSendingCode ? '发送中...' : '获取验证码'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* 错误信息 */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* 忘记密码 */}
                <div className="text-right">
                  <Link
                    href="/auth/reset-password"
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    忘记密码？
                  </Link>
                </div>

                {/* 登录按钮 */}
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>登录中...</span>
                    </div>
                  ) : (
                    '立即登录'
                  )}
                </button>
              </form>

              {/* 注册链接 */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  还没有账户？{' '}
                  <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                    立即注册
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

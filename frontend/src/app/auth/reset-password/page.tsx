'use client'

import { useState, useEffect } from 'react'
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { authService } from '@/services/authService'

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await authService.resetPassword(email)
      
      if (error) {
        setError(error.message || '发送重置邮件失败，请重试')
        return
      }

      setSuccess(true)
      setCountdown(60)
    } catch (err) {
      console.error('发送重置邮件异常:', err)
      setError('发送重置邮件失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError('请先输入邮箱地址')
      return
    }

    setIsResending(true)
    setError(null)

    try {
      const { error } = await authService.resetPassword(email)
      
      if (error) {
        setError(error.message || '发送验证码失败，请重试')
        return
      }

      setCountdown(60)
      setError(null)
    } catch (err) {
      console.error('发送验证码异常:', err)
      setError('发送验证码失败，请重试')
    } finally {
      setIsResending(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) {
      setError('请输入验证码')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 这里应该验证验证码，然后进入密码设置步骤
      // 由于Supabase的密码重置流程，我们直接进入密码设置步骤
      setStep('password')
    } catch (err) {
      console.error('验证码验证异常:', err)
      setError('验证码无效，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (newPassword.length < 6) {
      setError('密码长度至少为6位')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await authService.resetPasswordWithCode(email, verificationCode, newPassword)
      
      if (error) {
        setError(error.message || '密码重置失败，请重试')
        return
      }

      setStep('success')
    } catch (err) {
      console.error('密码重置异常:', err)
      setError('密码重置失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">重置密码</h2>
        <p className="text-gray-600">请输入您的邮箱地址，我们将发送密码重置链接</p>
      </div>

      <form onSubmit={handleSendResetEmail} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-700"
              placeholder="请输入邮箱地址"
              required
            />
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-600">重置邮件已发送，请检查您的邮箱</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>发送中...</span>
            </>
          ) : (
            <>
              <span>发送重置邮件</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
          返回登录
        </Link>
      </div>
    </div>
  )

  const renderCodeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">输入验证码</h2>
        <p className="text-gray-600">请输入发送到 {email} 的验证码</p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            验证码
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-700"
              placeholder="请输入验证码"
              required
            />
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl transition-colors whitespace-nowrap flex items-center space-x-2"
            >
              {isResending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : countdown > 0 ? (
                <span>{countdown}s</span>
              ) : (
                <span>重新发送</span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>验证中...</span>
            </>
          ) : (
            <>
              <span>验证</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setStep('email')}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          返回上一步
        </button>
      </div>
    </div>
  )

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">设置新密码</h2>
        <p className="text-gray-600">请输入您的新密码</p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新密码
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-700"
              placeholder="请输入新密码"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            确认新密码
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-700"
              placeholder="请再次输入新密码"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>重置中...</span>
            </>
          ) : (
            <>
              <span>重置密码</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setStep('code')}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          返回上一步
        </button>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">密码重置成功！</h2>
        <p className="text-gray-600">您的密码已成功重置，请使用新密码登录</p>
      </div>

      <Link
        href="/auth/login"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-semibold"
      >
        <span>前往登录</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'email' && renderEmailStep()}
          {step === 'code' && renderCodeStep()}
          {step === 'password' && renderPasswordStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  )
}

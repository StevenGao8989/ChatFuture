'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'

export default function ChangePasswordPage() {
  const { user: authUser, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // 检查用户是否已登录
    if (authUser) {
      setIsLoading(false)
    } else {
      // 如果没有Supabase用户，跳转到登录页面
      window.location.href = '/auth/login'
    }
  }, [authUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 清除错误信息
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('请输入当前密码')
      return false
    }
    
    if (!formData.newPassword) {
      setError('请输入新密码')
      return false
    }
    
    if (formData.newPassword.length < 6) {
      setError('新密码长度至少为6位')
      return false
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的新密码不一致')
      return false
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setError('新密码不能与当前密码相同')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setError('')
    setSuccess('')
    
    try {
      if (authUser) {
        // Supabase用户直接修改密码
        const { error } = await authService.updatePassword(formData.newPassword)
        
        if (error) {
          setError(error.message || '密码修改失败，请重试')
          return
        }
        
        setSuccess('密码修改成功！正在跳转到主页...')
        
        // 清空表单
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        
        // 延迟跳转到dashboard
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
        
      } else {
        // 如果没有Supabase用户，显示错误
        setError('请先登录')
      }
    } catch (error) {
      console.error('修改密码失败:', error)
      setError('修改密码失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">检查登录状态中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 天空渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-emerald-200 opacity-40"></div>
        
        {/* 山脉层 */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-300 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-400 to-transparent opacity-20"></div>
        
        {/* 装饰元素 */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 顶部导航栏 */}
      <nav className="relative z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">修改密码</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* 主卡片 */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 p-8">
            <div className="text-center mb-8">
              {/* 图标 */}
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Key className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
              </div>
              
              {/* 标题 */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                修改密码
              </h2>
              <p className="text-gray-600">
                为了您的账户安全，请输入当前密码和新密码
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 当前密码 */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  当前密码
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="请输入当前密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 新密码 */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="请输入新密码（至少6位）"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 确认新密码 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  确认新密码
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="请再次输入新密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 错误信息 */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              )}

              {/* 成功信息 */}
              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-600 text-sm">{success}</span>
                </div>
              )}

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>修改中...</span>
                  </div>
                ) : (
                  '确认修改'
                )}
              </button>
            </form>

            {/* 底部提示 */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                忘记当前密码？请先退出登录，然后使用"忘记密码"功能
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { User, LogOut, Settings, BarChart3, Brain, Target, Users, Zap, CheckCircle, Star, ArrowRight, Sparkles, Key, Trash2, ChevronDown, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { userDataService } from '@/services/userDataService'
import { questionnaireService } from '@/services/questionnaireService'

export default function DashboardPage() {
  const { user: authUser, signOut, loading: authLoading } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 检查用户登录状态
    const checkAuthStatus = () => {
      try {
        // 优先使用Supabase认证用户
        if (authUser) {
          setUser(authUser)
          setIsLoading(false)
          return
        }

        // 检查本地存储的用户会话
        const token = localStorage.getItem('auth_token')
        const userSession = localStorage.getItem('user_session')
        
        if (token && userSession) {
          const userData = JSON.parse(userSession)
          // 使用标准的数据结构
          if (userData.user) {
            setUser(userData.user)
          } else {
            // 直接使用userData作为用户信息
            setUser(userData)
          }
          setIsLoading(false)
        } else if (!authLoading) {
          // 如果认证加载完成且没有用户，跳转到登录页面
          window.location.href = '/auth/login'
        }
      } catch (error) {
        console.log('检查登录状态时出错:', error)
        if (!authLoading) {
          window.location.href = '/auth/login'
        }
      } finally {
        if (!authLoading) {
          setIsLoading(false)
        }
      }
    }

    checkAuthStatus()
  }, [authUser, authLoading])

  // 处理点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    setShowLogoutConfirm(true)
    setShowUserMenu(false)
  }

  const confirmLogout = async () => {
    try {
      setShowLogoutConfirm(false)
      
      // 使用Supabase登出
      if (authUser) {
        const { error } = await signOut()
        if (error) {
          console.error('登出失败:', error)
        }
      }
      
      // 清除本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_session')
      localStorage.removeItem('sb-auth-token')
      
      // 跳转到登录页面
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('登出异常:', error)
      // 即使失败也清除本地存储并跳转
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_session')
      localStorage.removeItem('sb-auth-token')
      window.location.href = '/auth/login'
    }
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true)
    setShowUserMenu(false)
  }

  const confirmDeleteAccount = async () => {
    // 验证密码输入
    if (!deletePassword.trim()) {
      alert('请输入当前密码以确认删除账户')
      return
    }

    try {
      if (authUser) {
        // Supabase用户：先验证密码，然后删除账户
        const { authService } = await import('@/services/authService')
        
        // 首先尝试用当前密码重新认证
        const { error: authError } = await authService.signIn({ email: authUser.email, password: deletePassword })
        if (authError) {
          alert('密码错误，无法删除账户')
          return
        }
        
        // 密码验证通过后，删除账户
        const { error } = await authService.deleteAccount()
        
        if (error) {
          console.error('删除账户失败:', error)
          alert('删除账户失败，请重试')
          return
        }
      } else {
        // 如果没有Supabase用户，跳转到登录页面
        alert('请先登录')
        window.location.href = '/auth/login'
        return
      }
      
      setShowDeleteConfirm(false)
      setDeletePassword('')
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('删除账户失败:', error)
      alert('删除账户失败，请重试')
    }
  }

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false)
    setDeletePassword('')
  }

  // 检查用户是否已完成测试
  const checkAssessmentCompletion = () => {
    try {
      const currentUserId = userDataService.getCurrentUserId()
      console.log('Dashboard - 当前用户ID:', currentUserId)
      
      // 严格检查用户是否真正完成了测评
      const sessionData = userDataService.getUserData('questionnaire_session')
      const assessmentData = userDataService.getUserData('assessment_results')
      
      console.log('Dashboard - 问卷会话数据:', sessionData)
      console.log('Dashboard - 测评结果数据:', assessmentData)
      
      // 检查会话是否标记为完成
      const isSessionCompleted = sessionData && sessionData.completed === true
      console.log('Dashboard - 会话是否完成:', isSessionCompleted)
      
      // 检查是否有真实的测评数据
      let hasRealAssessmentData = false
      try {
        const questionnaireSession = questionnaireService.getCurrentSession()
        if (questionnaireSession && questionnaireSession.answers && questionnaireSession.answers.length > 0) {
          const allTypes = ['riasec', 'big_five', 'career_values', 'aptitude']
          const hasMinimumAnswers = allTypes.some(type => 
            questionnaireSession.answers.filter((answer: any) => answer.questionnaireType === type).length > 0
          )
          if (hasMinimumAnswers) {
            hasRealAssessmentData = true
            console.log('Dashboard - 找到真实的测评数据，答案数量:', questionnaireSession.answers.length)
          }
        }
      } catch (error) {
        console.log('Dashboard - 问卷服务验证失败:', error)
      }
      
      console.log('Dashboard - 是否有真实测评数据:', hasRealAssessmentData)
      
      // 最终验证：必须同时满足会话完成和真实数据存在
      const hasValidAssessmentData = isSessionCompleted && hasRealAssessmentData
      
      if (hasValidAssessmentData) {
        // 已完成测试，跳转到结果页面
        console.log('Dashboard - 用户已完成测评，跳转到结果页面')
        window.location.href = '/results'
      } else {
        // 未完成测试，显示提示
        console.log('Dashboard - 用户未完成测评，显示提示')
        setShowAssessmentPrompt(true)
      }
    } catch (error) {
      console.log('检查测评状态时出错:', error)
      // 出错时也显示提示
      setShowAssessmentPrompt(true)
    }
  }

  // 关闭提示对话框
  const closeAssessmentPrompt = () => {
    setShowAssessmentPrompt(false)
  }

  // 跳转到测评页面
  const goToAssessment = () => {
    setShowAssessmentPrompt(false)
    window.location.href = '/assessment'
  }

  const handleStartAssessment = () => {
    // 跳转到测评界面
    window.location.href = '/assessment'
  }

  const handleViewCareerMatches = () => {
    // 跳转到职业匹配结果页面（暂时跳转到测评页面）
    window.location.href = '/assessment'
  }

  const handleGeneratePortrait = () => {
    // 跳转到AI画像生成页面（暂时跳转到测评页面）
    window.location.href = '/assessment'
  }

  const handleStartExploration = () => {
    // 跳转到探索页面（暂时跳转到测评页面）
    window.location.href = '/assessment'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // 会跳转到登录页面
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 relative overflow-hidden">
      {/* 自然背景 - 与主界面保持一致 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 天空渐变 - 绿色到蓝紫渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-emerald-200 to-blue-200"></div>
        
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

        {/* 蜿蜒的探索路径 - 象征成长旅程的曲折 */}
        <div className="absolute bottom-32 right-0 w-64 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-70 transform rotate-12"></div>
        <div className="absolute bottom-20 right-16 w-48 h-2 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full opacity-60 transform rotate-6"></div>
        
        {/* 上升阶梯 - 象征职业成长路径 */}
        <div className="absolute bottom-40 left-1/4 w-32 h-8 opacity-30">
          <div className="flex space-x-2">
            <div className="w-6 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded transform rotate-12"></div>
            <div className="w-6 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded transform rotate-12"></div>
            <div className="w-6 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded transform rotate-12"></div>
            <div className="w-6 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded transform rotate-12"></div>
          </div>
        </div>
        
        {/* 指向未来的箭头线条 */}
        <div className="absolute top-1/3 right-1/4 w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-transparent opacity-50 transform rotate-45 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-blue-400 opacity-40 transform -rotate-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* 自然装饰 - 植物叶子 */}
        <div className="absolute bottom-0 right-8 w-16 h-16 opacity-25 animate-float">
          <div className="w-full h-full bg-green-500 rounded-full transform rotate-45"></div>
        </div>
        <div className="absolute bottom-0 right-16 w-12 h-12 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-full h-full bg-emerald-600 rounded-full transform rotate-12"></div>
        </div>

        {/* 探索者角色 - 手持罗盘的未来发现者 */}
        <div className="absolute bottom-28 right-16 animate-walk">
          <div className="relative">
            {/* 身体 - 现代探索者 */}
            <div className="w-18 h-22 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full relative">
              {/* 头部 */}
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full"></div>
              {/* 头发 - 深色短发 */}
              <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 w-7 h-5 bg-slate-700 rounded-full"></div>
              {/* 眼睛 - 专注探索的眼神 */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-4 w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="absolute -top-6 left-1/2 transform translate-x-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
              {/* 微笑 - 自信的笑容 */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1.5 w-3 h-1.5 border-b-2 border-black rounded-full"></div>
            </div>
            
            {/* 手持罗盘 - 职业探索的象征 */}
            <div className="absolute -right-2 top-2 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
              {/* 罗盘指针 */}
              <div className="w-1 h-6 bg-white rounded-full relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full border border-gray-300"></div>
              </div>
              {/* 罗盘刻度 */}
              <div className="absolute inset-0 border-2 border-white rounded-full opacity-60"></div>
              <div className="absolute inset-1 border border-white rounded-full opacity-40"></div>
            </div>
            
            {/* 探索背包 - 装满未来装备 */}
            <div className="absolute -left-2 top-6 w-8 h-10 bg-slate-600 rounded-lg transform -rotate-12 shadow-lg">
              <div className="absolute top-1 left-1 w-1 h-1 bg-slate-700 rounded-full"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-slate-700 rounded-full"></div>
              {/* 背包带子 */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-slate-500"></div>
            </div>
            
            {/* 腿部 - 坚定的探索步伐 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-10 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full"></div>
            
            {/* 手臂 - 专注持罗盘的手臂 */}
            <div className="absolute top-3 -left-2 w-3 h-8 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full transform rotate-12"></div>
            <div className="absolute top-2 -right-1 w-2 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full transform rotate-45"></div>
          </div>
        </div>

        {/* 浮动云朵 - 营造轻松氛围 */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-white bg-opacity-40 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-24 h-12 bg-white bg-opacity-35 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 顶部导航栏 - 固定定位 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 左侧 Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">ChatFuture</h1>
              </div>
            </div>
            
            {/* 右侧用户头像下拉菜单 */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">
                  {user?.name || user?.email || user?.user || '用户'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* 用户下拉菜单 */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    个人资料
                  </Link>
                  <Link
                    href="/change-password"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Key className="w-4 h-4 mr-3" />
                    修改密码
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    注销账户
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="min-h-screen flex flex-col justify-center items-center relative z-10 px-4 py-24">
        <div className="w-full max-w-4xl text-center">
        {/* 主标题 - 心理学友好的温暖色调 */}
        <div className="mb-8 animate-fadeInUp">
          {/* 装饰性图标背景 */}
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8 relative z-10 leading-tight">
              欢迎来到你的AI职业世界
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium">
              每一步，都是更了解自己的开始
            </p>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* 装饰线条 */}
          <div className="relative mt-8">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 rounded-full opacity-70"></div>
            <p className="text-lg md:text-xl text-gray-600 mb-2 font-medium">
              在这里，我将陪你一起探索兴趣、性格与潜能，发现最适合你的未来。
            </p>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-12 h-1 bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 rounded-full opacity-50"></div>
          </div>
        </div>


        {/* 功能特色 - 四个功能卡片 2x2 布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* AI智能测评 */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-teal-200/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp border border-white border-opacity-20 relative overflow-hidden group cursor-pointer" style={{ animationDelay: '0.4s' }}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full opacity-10 transform translate-x-8 -translate-y-8 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">AI智能测评</h3>
              </div>
              
              <div className="text-gray-600 text-sm leading-relaxed relative group-hover:text-gray-700 transition-colors duration-300 mb-4">
                <p>开启一场与未来对话的旅程，15分钟深度探索你的内心世界</p>
              </div>

              {/* CTA按钮 */}
              <button 
                onClick={handleStartAssessment}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
              >
                立即测评
              </button>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-60 animate-float transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-0 group-hover:opacity-50 animate-float transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* 职业匹配 */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp border border-white border-opacity-20 relative overflow-hidden group cursor-pointer" style={{ animationDelay: '0.5s' }}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 transform translate-x-8 -translate-y-8 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">职业匹配</h3>
              </div>
              
              <div className="text-gray-600 text-sm leading-relaxed relative group-hover:text-gray-700 transition-colors duration-300 mb-4">
                <p>科学匹配职业方向，让你更接近理想人生</p>
              </div>

              {/* CTA按钮 */}
              <button 
                onClick={handleViewCareerMatches}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
              >
                查看匹配职业
              </button>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-60 animate-float transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-0 group-hover:opacity-50 animate-float transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* AI画像生成 */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp border border-white border-opacity-20 relative overflow-hidden group cursor-pointer" style={{ animationDelay: '0.6s' }}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full opacity-10 transform translate-x-8 -translate-y-8 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">AI画像生成</h3>
              </div>
              
              <div className="text-gray-600 text-sm leading-relaxed relative group-hover:text-gray-700 transition-colors duration-300 mb-4">
                <p>遇见未来的自己，让AI为你绘制未来的模样</p>
              </div>

              {/* CTA按钮 */}
              <button 
                onClick={handleGeneratePortrait}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
              >
                生成画像
              </button>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-60 animate-float transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-50 animate-float transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* 全龄适用 */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-lime-200/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp border border-white border-opacity-20 relative overflow-hidden group cursor-pointer" style={{ animationDelay: '0.7s' }}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-lime-400 to-green-500 rounded-full opacity-10 transform translate-x-8 -translate-y-8 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-lime-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-lime-400 to-green-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">查看报告</h3>
              </div>
              
              <div className="text-gray-600 text-sm leading-relaxed relative group-hover:text-gray-700 transition-colors duration-300 mb-4">
                <p>无论你处于人生的哪个阶段，都能在这里找到成长的力量</p>
              </div>

              {/* CTA按钮 */}
              <button 
                onClick={checkAssessmentCompletion}
                className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
              >
                查看我的报告
              </button>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-lime-400 to-green-400 rounded-full opacity-0 group-hover:opacity-60 animate-float transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-lime-400 rounded-full opacity-0 group-hover:opacity-50 animate-float transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
        </div>

        {/* 底部信息 - 固定在页面底部 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-green-100 py-4 z-20">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <span>🔒 隐私保护</span>
            <span>⚡ 快速测评</span>
            <span>🎨 AI画像</span>
            <span>📊 科学分析</span>
          </div>
        </div>

        {/* 测评提示对话框 */}
        {showAssessmentPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-green-100">
              <div className="text-center">
                {/* 图标 */}
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-bounce"></div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  还没有完成测评
                </h3>
                
                {/* 描述 */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  要查看您的个性化报告，需要先完成我们的职业测评。
                  这将帮助我们更好地了解您的兴趣、性格和能力，为您生成专属的职业发展建议。
                </p>
                
                {/* 按钮组 */}
                <div className="flex space-x-3">
                  <button
                    onClick={closeAssessmentPrompt}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    稍后再说
                  </button>
                  <button
                    onClick={goToAssessment}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    立即测评
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 删除账户确认对话框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100">
              <div className="text-center">
                {/* 图标 */}
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  确认注销账户
                </h3>
                
                {/* 描述 */}
                <div className="text-gray-600 mb-6 leading-relaxed space-y-2">
                  <p>⚠️ <strong>此操作不可撤销！</strong></p>
                  <p>注销账户后，您的所有数据将被永久删除，包括：</p>
                  <ul className="text-left text-sm mt-2 space-y-1">
                    <li>• 个人资料信息</li>
                    <li>• 测评结果和历史记录</li>
                    <li>• AI生成的画像和报告</li>
                    <li>• 所有相关数据</li>
                  </ul>
                </div>

                {/* 密码输入 */}
                <div className="mb-6">
                  <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-2">
                    请输入当前密码以确认删除
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? 'text' : 'password'}
                      id="deletePassword"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                      placeholder="请输入当前密码"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* 按钮组 */}
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDeleteAccount}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeleteAccount}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    确认注销
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 退出确认对话框 */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-green-100">
              <div className="text-center">
                {/* 图标 */}
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <LogOut className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  确认退出登录
                </h3>
                
                {/* 描述 */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  您确定要退出当前账号吗？退出后需要重新登录才能继续使用平台功能。
                </p>
                
                {/* 按钮组 */}
                <div className="flex space-x-3">
                  <button
                    onClick={cancelLogout}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    确认退出
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
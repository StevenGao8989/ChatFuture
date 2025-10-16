'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Brain, Target, Users, Zap, LogIn, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isStarting, setIsStarting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 检查用户登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // 检查本地存储的认证信息
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
        const userSession = localStorage.getItem('user_session')
        const supabaseSession = localStorage.getItem('sb-auth-token')
        
        // 如果有任何认证信息，认为用户已登录
        const loggedIn = !!(token || userSession || supabaseSession)
        setIsLoggedIn(loggedIn)
      } catch (error) {
        console.log('检查登录状态时出错:', error)
        setIsLoggedIn(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleStart = () => {
    setIsStarting(true)
    setTimeout(() => {
      if (isLoggedIn) {
        // 已登录，跳转到测评页面
        window.location.href = '/assessment'
      } else {
        // 未登录，跳转到登录页面
        window.location.href = '/auth/login'
      }
    }, 1000)
  }

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI智能测评',
      description: '开启一场与未来对话的旅程，15分钟深度探索你的内心世界',
      color: 'from-blue-400 to-purple-500',
      accent: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: '职业匹配',
      description: '找到属于你的职业罗盘，指引通往理想未来的方向',
      color: 'from-emerald-400 to-teal-500',
      accent: 'from-emerald-500 to-green-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'AI画像生成',
      description: '遇见未来的自己，将梦想具象化为专属的职业画像',
      color: 'from-purple-400 to-pink-500',
      accent: 'from-purple-500 to-rose-600'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: '全龄适用',
      description: '无论你处于人生的哪个阶段，都能在这里找到成长的力量',
      color: 'from-orange-400 to-amber-500',
      accent: 'from-orange-500 to-yellow-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 自然背景 - 深绿色调，营造探索感 */}
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

        {/* 探索者角色 - 翻山越岭寻找自我 */}
        <div className="absolute bottom-28 right-16 animate-walk">
          <div className="relative">
            {/* 身体 - 浅绿色探险者 */}
            <div className="w-18 h-22 bg-gradient-to-b from-teal-400 to-emerald-500 rounded-full relative">
              {/* 头部 */}
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full"></div>
              {/* 头发 - 棕色短发 */}
              <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 w-7 h-5 bg-amber-800 rounded-full"></div>
              {/* 眼睛 - 充满好奇的眼神 */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-4 w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="absolute -top-6 left-1/2 transform translate-x-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
              {/* 微笑 - 自信的笑容 */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1.5 w-3 h-1.5 border-b-2 border-black rounded-full"></div>
            </div>
            
            {/* 探险背包 - 装满探索的装备 */}
            <div className="absolute -right-3 top-5 w-8 h-10 bg-amber-600 rounded-lg transform rotate-12 shadow-lg">
              <div className="absolute top-1 left-1 w-1 h-1 bg-amber-700 rounded-full"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-amber-700 rounded-full"></div>
            </div>
            
            {/* 腿部 - 坚定的步伐 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-10 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
            
            {/* 手臂 - 摆动的手臂显示前进的动力 */}
            <div className="absolute top-3 -left-2 w-3 h-8 bg-gradient-to-b from-teal-300 to-emerald-400 rounded-full transform rotate-12 animate-pulse"></div>
            <div className="absolute top-3 -right-2 w-3 h-8 bg-gradient-to-b from-teal-300 to-emerald-400 rounded-full transform -rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* 浮动云朵 - 营造轻松氛围 */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-white bg-opacity-40 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-24 h-12 bg-white bg-opacity-35 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 登录按钮 */}
      <div className="absolute top-6 right-6 z-10">
        <Link
          href="/auth/login"
          className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-green-100"
        >
          <LogIn className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">登录</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 主标题 - 心理学友好的温暖色调 */}
        <div className="mb-8 animate-fadeInUp">
          {/* 装饰性图标背景 */}
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4 relative z-10">
              ChatFuture
            </h1>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* 副标题装饰 */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 rounded-full opacity-70"></div>
            <p className="text-xl md:text-2xl text-gray-700 mb-2 font-semibold">
              AI职业评估与规划平台
            </p>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-12 h-1 bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 rounded-full opacity-50"></div>
          </div>
          
          <p className="text-lg text-gray-600 mt-4 font-medium">
            在这里，将帮助你认识真实的自己，发现未来的无限可能
          </p>
        </div>

        {/* AI导师介绍 - 心理学友好的温暖设计 */}
        <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {/* AI导师卡片 */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 border-opacity-30 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              {/* AI头像装饰 - 温暖友好的绿色调 */}
              <div className="relative mr-6">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-bounce"></div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                你好！我是你的AI职业规划导师——小智
              </h2>
            </div>
            
            {/* 介绍文字装饰 - 具心理引导力的表达 */}
            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-400 to-orange-400 rounded-full opacity-70"></div>
              <p className="text-lg text-gray-700 leading-relaxed pl-8 font-medium">
                准备好开启一场发现自我的奇妙旅程了吗？我会成为你最贴心的向导，
                陪伴你探索内心深处的潜能，找到属于你的那片职业天空。让我们一起踏上这段充满可能性的成长之路！
              </p>
            </div>
            
            {/* 装饰性元素 - 多彩渐变 */}
            <div className="flex justify-center mt-6 space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* 开始按钮 - 具心理引导力的设计 */}
        <div className="animate-fadeInUp relative mb-12" style={{ animationDelay: '0.4s' }}>
          {/* 按钮装饰背景 - 橙色点缀 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-16 bg-gradient-to-r from-emerald-400 via-teal-400 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          {isCheckingAuth ? (
            /* 检查登录状态时的加载按钮 */
            <button
              disabled
              className="relative bg-gradient-to-r from-gray-300 to-gray-400 px-8 py-4 rounded-full text-lg font-semibold shadow-lg cursor-not-allowed flex items-center mx-auto border-2 border-gray-200"
            >
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
              <span className="text-gray-600">检查登录状态中...</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:bg-white hover:text-gray-800 px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto border-2 border-white border-opacity-20 backdrop-blur-sm group"
            >
            {/* 按钮内部装饰 - 呼吸效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-500"></div>
            
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                <span className="relative z-10">
                  {isLoggedIn ? '正在为你准备...' : '正在跳转到登录页面...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-pulse group-hover:animate-bounce" />
                <span className="relative z-10">
                  {isLoggedIn ? '开启发现自我的旅程' : '开启发现自我的旅程'}
                </span>
                <ArrowRight className="w-5 h-5 ml-2 animate-bounce group-hover:animate-pulse" />
              </>
            )}
            
            {/* 按钮发光效果 - 动态渐变 */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
            </button>
          )}
          
          {/* 按钮周围装饰 - 上升感 */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-bounce group-hover:animate-pulse"></div>
          <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          
          {/* 上升箭头装饰 */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 opacity-60 animate-float">
            <ArrowRight className="w-full h-full text-orange-400 transform rotate-90" />
          </div>
        </div>

        {/* 功能特色 - 具象征意义的模块设计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 animate-fadeInUp border border-white border-opacity-20 relative overflow-hidden group"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              {/* 背景装饰 - 动态渐变 */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-10 transform translate-x-8 -translate-y-8 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.accent} rounded-xl flex items-center justify-center text-white mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:animate-pulse`}>
                      {feature.icon}
                    </div>
                    {/* 图标装饰 - 橙色点缀 */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">{feature.title}</h3>
                </div>
                
                <div className="text-gray-600 text-sm leading-relaxed relative group-hover:text-gray-700 transition-colors duration-300">
                  <p>{feature.description}</p>
                </div>
              </div>
              
              {/* 悬停效果装饰 - 呼吸效果 */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl animate-pulse`}></div>
              
              {/* 生命感动画 - 浮动粒子 */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-60 animate-float transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-50 animate-float transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
            </div>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="mt-16 text-center animate-fadeInUp" style={{ animationDelay: '1s' }}>
          <p className="text-gray-600 text-sm mb-4">
            还没有账户？{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
              立即注册
            </Link>
            {' '}开始你的职业探索之旅
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <span>🔒 隐私保护</span>
            <span>⚡ 快速测评</span>
            <span>🎨 AI画像</span>
            <span>📊 科学分析</span>
          </div>
        </div>
      </div>
    </div>
  )
}

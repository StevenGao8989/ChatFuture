'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import BasicInfoForm from '@/components/BasicInfoForm'
import { questionnaireService } from '@/services/questionnaireService'
import type { BasicInfoData } from '@/data/questionnaires/basic_info/questions'

export default function BasicInfoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查是否已经填写过基本信息
    const hasBasicInfo = questionnaireService.hasBasicInfo()
    if (hasBasicInfo) {
      // 如果已经填写过，直接跳转到测评页面
      router.push('/assessment')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleComplete = (basicInfo: BasicInfoData) => {
    console.log('基本信息已保存:', basicInfo)
    // 跳转到测评页面
    router.push('/assessment')
  }

  const handleSkip = () => {
    console.log('用户跳过基本信息收集')
    // 跳转到测评页面
    router.push('/assessment')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">检查基本信息中...</p>
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
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">ChatFuture</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-lg">
          {/* 主卡片 */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 p-8">
            <BasicInfoForm 
              onComplete={handleComplete}
              onSkip={handleSkip}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

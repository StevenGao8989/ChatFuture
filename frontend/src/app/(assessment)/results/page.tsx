'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Share2, Brain, Heart, Target, Zap, CheckCircle, TrendingUp, Users, Award, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { questionnaireService } from '@/services/questionnaireService'
import { userDataService } from '@/services/userDataService'
import { aiService, type AIReportResponse } from '@/services/aiService'

interface AssessmentResult {
  riasec: {
    scores: { [key: string]: number }
    dominant: string
    description: string
    careers: string[]
  }
  bigFive: {
    scores: { [key: string]: number }
    traits: { [key: string]: { level: string; description: string } }
  }
  careerValues: {
    scores: { [key: string]: number }
    topValues: string[]
  }
  aptitude: {
    scores: { [key: string]: number }
    strengths: string[]
  }
}

export default function ResultsPage() {
  const [results, setResults] = useState<AssessmentResult | null>(null)
  const [aiReport, setAiReport] = useState<AIReportResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'riasec' | 'bigfive' | 'values' | 'aptitude'>('overview')
  const [currentUser, setCurrentUser] = useState<{ name: string; email?: string; occupation?: string } | null>(null)

  useEffect(() => {
    // 获取当前用户信息
    const getCurrentUserInfo = () => {
      const authToken = localStorage.getItem('auth_token')
      const userSession = localStorage.getItem('user_session')
      
      if (authToken && userSession) {
        try {
          const userData = JSON.parse(userSession)
          const user = userData.user
          return {
            name: user?.name || user?.email || user?.user || '用户',
            email: user?.email,
            occupation: user?.occupation || user?.job || ''
          }
        } catch (e) {
          return { name: '匿名用户' }
        }
      }
      
      return { name: '匿名用户' }
    }
    
    setCurrentUser(getCurrentUserInfo())
    
    const loadResults = async () => {
      try {
        // 调试：打印当前用户ID
        const currentUserId = userDataService.getCurrentUserId()
        console.log('当前用户ID:', currentUserId)
        
        // 严格检查用户是否真正完成了测评
        console.log('用户ID:', currentUserId)
        
        // 1. 检查是否有问卷会话
        const sessionData = userDataService.getUserData('questionnaire_session')
        console.log('问卷会话数据:', sessionData)
        
        // 2. 检查会话是否标记为完成
        const isSessionCompleted = sessionData && sessionData.completed === true
        console.log('会话是否完成:', isSessionCompleted)
        
        // 3. 检查是否有测评结果数据
        const assessmentData = userDataService.getUserData('assessment_results')
        console.log('测评结果数据:', assessmentData)
        
        // 4. 尝试从问卷服务验证是否有真实的测评数据
        let hasRealAssessmentData = false
        try {
          const questionnaireSession = questionnaireService.getCurrentSession()
          if (questionnaireSession && questionnaireSession.answers && questionnaireSession.answers.length > 0) {
            // 检查是否有足够的答案（至少需要完成基本问卷）
            const allTypes = ['riasec', 'big_five', 'career_values', 'aptitude']
            const hasMinimumAnswers = allTypes.some(type => 
              questionnaireSession.answers.filter(answer => answer.questionnaireType === type).length > 0
            )
            if (hasMinimumAnswers) {
              hasRealAssessmentData = true
              console.log('找到真实的测评数据，答案数量:', questionnaireSession.answers.length)
            }
          }
        } catch (error) {
          console.log('问卷服务验证失败:', error)
        }
        
        console.log('是否有真实测评数据:', hasRealAssessmentData)
        
        // 最终验证：必须同时满足会话完成和真实数据存在
        const hasValidAssessmentData = isSessionCompleted && hasRealAssessmentData
        
        if (!hasValidAssessmentData) {
          console.log('用户未完成测评，拒绝访问结果页面')
          alert('请先完成测试。您需要完成所有测评题目后才能查看报告。')
          window.location.href = '/assessment'
          return
        }
        
        // 从问卷服务获取真实的测评结果
        let finalResults = null
        try {
          const assessmentResults = questionnaireService.calculateScores()
          console.log('测评结果:', assessmentResults)
          finalResults = assessmentResults
        } catch (error) {
          console.log('问卷服务无法计算分数:', error)
          // 尝试从localStorage获取已保存的结果
          const savedResults = userDataService.getUserData('assessment_results')
          if (savedResults) {
            finalResults = savedResults
            console.log('从localStorage获取到保存的结果:', savedResults)
          }
        }
        
        // 如果仍然没有有效结果，说明用户确实没有完成测评
        if (!finalResults || Object.keys(finalResults).length === 0) {
          console.log('没有找到有效的测评结果，用户未完成测评')
          alert('您还没有完成测评，请先完成测评后再查看报告')
          window.location.href = '/assessment'
          return
        }
        
        // 生成基础结果对象
        const baseResults: AssessmentResult = {
          riasec: {
            scores: (finalResults as any).riasec || {},
            dominant: getDominantTrait((finalResults as any).riasec),
            description: '基于您的兴趣测评结果生成',
            careers: []
          },
          bigFive: {
            scores: (finalResults as any).bigFive || {},
            traits: generateBigFiveTraits((finalResults as any).bigFive)
          },
          careerValues: {
            scores: (finalResults as any).careerValues || {},
            topValues: getTopValues((finalResults as any).careerValues)
          },
          aptitude: {
            scores: (finalResults as any).aptitude || {},
            strengths: getStrengths((finalResults as any).aptitude)
          }
        }
        
        setResults(baseResults)
        
        // 获取用户基本信息
        const userBasicInfo = userDataService.getUserData('basic_info')
        
        // 生成AI报告
        setIsGeneratingReport(true)
        try {
          const aiReportData = await aiService.generateCareerReport(finalResults as any, {
            ...currentUser,
            basicInfo: userBasicInfo
          })
          setAiReport(aiReportData)
          
          // 更新结果中的职业推荐
          baseResults.riasec.careers = aiReportData.career_recommendations.map(rec => rec.title)
          setResults(baseResults)
        } catch (aiError) {
          console.error('生成AI报告失败:', aiError)
          // AI报告失败时，显示错误信息但不设置默认数据
          alert('生成AI报告失败，请稍后重试')
        } finally {
          setIsGeneratingReport(false)
        }
        
        // 保存测评结果到localStorage，供dashboard页面检测
        localStorage.setItem('assessment_results', JSON.stringify(baseResults))
        localStorage.setItem('questionnaire_session', JSON.stringify({
          completed: true,
          timestamp: new Date().toISOString(),
          userId: currentUser?.name || 'anonymous'
        }))
      } catch (error) {
        console.error('加载结果失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadResults()
  }, [])

  // 辅助函数：获取主导特征
  const getDominantTrait = (riasecScores: any) => {
    if (!riasecScores) return 'Unknown'
    const entries = Object.entries(riasecScores)
    if (entries.length === 0) return 'Unknown'
    const dominant = entries.reduce((max, current) => 
      (current[1] as number) > (max[1] as number) ? current : max
    )
    
    // 将英文键值转换为中文名称
    const riasecMapping: Record<string, string> = {
      'R': '现实型',
      'I': '研究型', 
      'A': '艺术型',
      'S': '社会型',
      'E': '企业型',
      'C': '常规型'
    }
    
    return riasecMapping[dominant[0] as string] || 'Unknown'
  }

  // 辅助函数：生成Big Five特征描述
  const generateBigFiveTraits = (bigFiveScores: any) => {
    if (!bigFiveScores) return {}
    const traits: any = {}
    const mappings = {
      'O': '开放性',
      'C': '尽责性', 
      'E': '外向性',
      'A': '宜人性',
      'N': '神经质'
    }
    
    Object.entries(bigFiveScores).forEach(([key, value]) => {
      const score = value as number
      const level = score >= 80 ? '高' : score >= 60 ? '中等' : '一般'
      const description = `${mappings[key as keyof typeof mappings]}${level}，得分${score}%`
      traits[key] = { level, description }
    })
    
    return traits
  }

  // 辅助函数：获取前3个价值观
  const getTopValues = (valuesScores: any) => {
    if (!valuesScores) return []
    const mappings = {
      'achievement': '成就导向',
      'independence': '独立性',
      'recognition': '认可度',
      'relationships': '人际关系',
      'support': '支持度',
      'working_conditions': '工作条件'
    }
    
    return Object.entries(valuesScores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([key]) => mappings[key as keyof typeof mappings])
  }

  // 辅助函数：获取优势能力
  const getStrengths = (aptitudeScores: any) => {
    if (!aptitudeScores) return []
    const mappings = {
      'NR': '数理推理',
      'VR': '语言表达',
      'SP': '空间想象',
      'LG': '逻辑推理',
      'ME': '机械理解',
      'AT': '注意力细节',
      'MM': '记忆力',
      'CS': '计算技能'
    }
    
    return Object.entries(aptitudeScores)
      .filter(([,value]) => (value as number) >= 70)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .map(([key]) => mappings[key as keyof typeof mappings])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'riasec': return <Heart className="w-5 h-5" />
      case 'bigfive': return <Brain className="w-5 h-5" />
      case 'values': return <Target className="w-5 h-5" />
      case 'aptitude': return <Zap className="w-5 h-5" />
      default: return <Award className="w-5 h-5" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'riasec': return '职业兴趣'
      case 'bigfive': return '人格特质'
      case 'values': return '职业价值观'
      case 'aptitude': return '能力倾向'
      default: return '综合评估'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-emerald-200 to-blue-200"></div>
          <div className="absolute bottom-0 left-8 w-16 h-16 opacity-25 animate-float">
            <div className="w-full h-full bg-green-500 rounded-full transform rotate-45"></div>
          </div>
          <div className="absolute top-20 right-20 w-24 h-12 bg-white bg-opacity-35 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4 relative z-10"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          <p className="text-gray-700 font-medium">正在生成您的个性化报告...</p>
        </div>
      </div>
    )
  }

  if (isGeneratingReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-emerald-200 to-blue-200"></div>
          <div className="absolute bottom-0 left-8 w-16 h-16 opacity-25 animate-float">
            <div className="w-full h-full bg-green-500 rounded-full transform rotate-45"></div>
          </div>
          <div className="absolute top-20 right-20 w-24 h-12 bg-white bg-opacity-35 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4 relative z-10"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          <p className="text-gray-700 font-medium">AI正在分析您的测评结果...</p>
          <p className="text-sm text-gray-500 mt-2">正在生成个性化职业规划报告</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="text-center max-w-md mx-auto p-8 bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 border-opacity-30 relative z-10">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">报告生成失败</h2>
          <p className="text-gray-600 mb-6">抱歉，无法加载您的测评结果。请重新完成测评。</p>
          <Link
            href="/assessment"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            重新测评
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-emerald-200 to-blue-200"></div>
        
        {/* 多层山脉背景 */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3">
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-300 to-green-200 rounded-t-full transform scale-110 opacity-60"></div>
          <div className="absolute bottom-0 left-1/4 w-3/4 h-2/5 bg-gradient-to-t from-emerald-400 to-green-300 rounded-t-full opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-3/5 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-full opacity-80"></div>
        </div>
        
        {/* 探索路径 */}
        <div className="absolute bottom-32 right-0 w-64 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-70 transform rotate-12"></div>
        <div className="absolute bottom-20 right-16 w-48 h-2 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full opacity-60 transform rotate-6"></div>
        
        {/* 自然装饰 */}
        <div className="absolute bottom-0 right-8 w-16 h-16 opacity-25 animate-float">
          <div className="w-full h-full bg-green-500 rounded-full transform rotate-45"></div>
        </div>
        <div className="absolute bottom-0 right-16 w-12 h-12 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-full h-full bg-emerald-600 rounded-full transform rotate-12"></div>
        </div>
        
        {/* 浮动云朵 */}
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
            
            {/* 右侧功能按钮和用户信息 */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>下载报告</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                <span>分享</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name || '加载中...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
        {/* 返回按钮 - 位于卡片左上角 */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Link>
        </div>

        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 relative z-10">
              🎉 您的职业测评报告
            </h1>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于您的测评结果，我们为您生成了这份个性化的职业发展报告
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-green-100 border-opacity-30">
            <div className="flex space-x-2">
              {[
                { id: 'overview', name: '总览', icon: <TrendingUp className="w-4 h-4" /> },
                { id: 'riasec', name: '职业兴趣', icon: <Heart className="w-4 h-4" /> },
                { id: 'bigfive', name: '人格特质', icon: <Brain className="w-4 h-4" /> },
                { id: 'values', name: '价值观', icon: <Target className="w-4 h-4" /> },
                { id: 'aptitude', name: '能力倾向', icon: <Zap className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 border-opacity-30">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto relative z-10 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-bounce"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">测评完成！</h2>
                {aiReport ? (
                  <>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                      {aiReport.summary}
                    </p>
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 max-w-4xl mx-auto">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">AI分析总结</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-emerald-700 mb-2">兴趣分析</h4>
                          <p className="text-sm text-gray-600">{aiReport.interest_analysis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-emerald-700 mb-2">性格分析</h4>
                          <p className="text-sm text-gray-600">{aiReport.personality_analysis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-emerald-700 mb-2">价值观分析</h4>
                          <p className="text-sm text-gray-600">{aiReport.values_analysis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-emerald-700 mb-2">能力分析</h4>
                          <p className="text-sm text-gray-600">{aiReport.ability_analysis}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                    恭喜您完成了全面的职业测评！基于您的回答，我们为您分析了职业兴趣、人格特质、价值观和能力倾向，为您提供个性化的职业发展建议。
                  </p>
                )}
              </div>

              {/* 关键发现 - 基于真实数据 */}
              {results && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="flex items-center mb-4">
                      <Heart className="w-8 h-8 text-emerald-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">职业兴趣</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      主导类型：{results.riasec.dominant}型
                    </p>
                    <p className="text-xs text-gray-500">
                      {results.riasec.description || '基于您的兴趣测评结果'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <Brain className="w-8 h-8 text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">人格特质</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {Object.keys(results.bigFive.traits).length > 0 
                        ? Object.entries(results.bigFive.traits)
                            .sort(([,a], [,b]) => (b as any).level === '高' ? 1 : -1)
                            .slice(0, 2)
                            .map(([key, trait]) => (trait as any).level === '高' ? key : '')
                            .filter(Boolean)
                            .join('、') + '突出'
                        : '基于测评结果分析'
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      {aiReport?.personality_analysis || '适合团队协作和项目管理'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center mb-4">
                      <Target className="w-8 h-8 text-purple-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">职业价值观</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {results.careerValues.topValues.length > 0 
                        ? results.careerValues.topValues.slice(0, 2).join('、')
                        : '基于价值观测评'
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      {aiReport?.values_analysis || '追求成功和他人认可'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                    <div className="flex items-center mb-4">
                      <Zap className="w-8 h-8 text-orange-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">能力倾向</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {results.aptitude.strengths.length > 0 
                        ? results.aptitude.strengths.slice(0, 2).join('、')
                        : '基于能力测评'
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      {aiReport?.ability_analysis || '分析思维和问题解决能力强'}
                    </p>
                  </div>
                </div>
              )}

              {/* 推荐职业 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Award className="w-6 h-6 text-emerald-600 mr-2" />
                  推荐职业方向
                </h3>
                {aiReport && aiReport.career_recommendations ? (
                  <div className="space-y-4">
                    {aiReport.career_recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                        <h4 className="font-semibold text-gray-800 mb-2">{recommendation.title}</h4>
                        <p className="text-sm text-gray-600">{recommendation.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {results.riasec.careers.map((career, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
                        <span className="text-sm font-medium text-gray-700">{career}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 发展建议 */}
              {aiReport && aiReport.development_advice && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                    发展建议
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{aiReport.development_advice}</p>
                </div>
              )}

              {/* 鼓励信息 */}
              {aiReport && aiReport.closing_message && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 text-center">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">{aiReport.closing_message}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'riasec' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Heart className="w-6 h-6 text-emerald-600 mr-2" />
                职业兴趣测评结果
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(results.riasec.scores).map(([type, score]) => (
                  <div key={type} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{type}型</h3>
                      <span className="text-2xl font-bold text-emerald-600">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-gray-800 mb-3">主导类型分析</h3>
                <p className="text-gray-700 leading-relaxed">{results.riasec.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'bigfive' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Brain className="w-6 h-6 text-blue-600 mr-2" />
                人格特质测评结果
              </h2>
              
              <div className="space-y-4">
                {Object.entries(results.bigFive.traits).map(([trait, data]) => (
                  <div key={trait} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {trait === 'O' ? '开放性' : 
                         trait === 'C' ? '尽责性' : 
                         trait === 'E' ? '外向性' : 
                         trait === 'A' ? '宜人性' : '神经质性'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        data.level === '高' ? 'bg-green-100 text-green-700' :
                        data.level === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {data.level}
                      </span>
                    </div>
                    <p className="text-gray-700">{data.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Target className="w-6 h-6 text-purple-600 mr-2" />
                职业价值观测评结果
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(results.careerValues.scores).map(([value, score]) => (
                  <div key={value} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {value === 'achievement' ? '成就导向' :
                         value === 'independence' ? '独立性' :
                         value === 'recognition' ? '认可度' :
                         value === 'relationships' ? '人际关系' :
                         value === 'support' ? '支持度' : '工作条件'}
                      </h3>
                      <span className="text-2xl font-bold text-purple-600">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'aptitude' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Zap className="w-6 h-6 text-orange-600 mr-2" />
                能力倾向测评结果
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(results.aptitude.scores).map(([aptitude, score]) => (
                  <div key={aptitude} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {aptitude === 'NR' ? '数理能力' :
                         aptitude === 'VR' ? '文字能力' :
                         aptitude === 'SP' ? '空间能力' :
                         aptitude === 'LG' ? '逻辑推理' :
                         aptitude === 'ME' ? '机械能力' :
                         aptitude === 'AT' ? '注意力' :
                         aptitude === 'MM' ? '记忆力' : '编程思维'}
                      </h3>
                      <span className="text-2xl font-bold text-orange-600">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            返回主界面
          </Link>
          <button className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-semibold">
            <Download className="w-5 h-5 mr-2" />
            下载完整报告
          </button>
        </div>
      </div>
    </div>
  )
}

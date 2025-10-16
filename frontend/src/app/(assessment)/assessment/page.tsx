'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Heart, Brain, Target, Zap, Sparkles, User, LogIn } from 'lucide-react'
import Link from 'next/link'
import { questionnaireService, type QuestionnaireType } from '@/services/questionnaireService'
import { userDataService } from '@/services/userDataService'
import { getAllQuestionnaireTypes, questionnaireTypeNames, questionnaireTypeIcons } from '@/data/questionnaires'

export default function AssessmentPage() {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ name: string; email?: string } | null>(null)

  const questionnaireTypes = getAllQuestionnaireTypes()
  const currentType = questionnaireTypes[currentTypeIndex]
  const currentQuestions = questionnaireService.getQuestions(currentType)
  const currentQuestion = currentQuestions[currentQuestionIndex]

  useEffect(() => {
    // 获取当前用户ID并初始化问卷会话
    const getCurrentUserInfo = () => {
      // 尝试从localStorage获取用户信息
      const authToken = localStorage.getItem('auth_token')
      const userSession = localStorage.getItem('user_session')
      
      if (authToken && userSession) {
        try {
          const userData = JSON.parse(userSession)
          const user = userData.user
          return {
            userId: user?.id || user?.email || 'anonymous',
            userInfo: {
              name: user?.name || user?.email || user?.user || '用户',
              email: user?.email
            }
          }
        } catch (e) {
          return {
            userId: 'anonymous',
            userInfo: { name: '匿名用户' }
          }
        }
      }
      
      // 如果没有用户信息，使用匿名ID
      return {
        userId: 'anonymous',
        userInfo: { name: '匿名用户' }
      }
    }
    
    const { userId, userInfo } = getCurrentUserInfo()
    setCurrentUser(userInfo)
    
    // 清除之前的测评数据，确保重新测试时覆盖之前的结果
    console.log('清除之前的测评数据，开始新的测评会话')
    questionnaireService.clearSession()
    userDataService.deleteUserData('assessment_results')
    
    // 创建新的会话
    const session = questionnaireService.createSession(userId)
    setIsLoading(false)
  }, [])

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
    
    // 保存答案到问卷服务
    questionnaireService.saveAnswer(questionId, optionId, currentType)
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      // 当前问卷还有问题
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentTypeIndex < questionnaireTypes.length - 1) {
      // 当前问卷完成，进入下一个问卷
      questionnaireService.markQuestionnaireCompleted(currentType)
      setCurrentTypeIndex(currentTypeIndex + 1)
      setCurrentQuestionIndex(0)
      setAnswers({}) // 清空当前答案显示
    } else {
      // 所有问卷完成
      questionnaireService.markQuestionnaireCompleted(currentType)
      
      // 标记整个测评会话为完成状态
      const session = questionnaireService.getCurrentSession()
      if (session) {
        session.completed = true
        questionnaireService.saveSession()
        console.log('测评完成，会话已标记为完成状态')
      }
      
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentTypeIndex > 0) {
      // 返回上一个问卷
      setCurrentTypeIndex(currentTypeIndex - 1)
      setCurrentQuestionIndex(questionnaireService.getQuestions(questionnaireTypes[currentTypeIndex - 1]).length - 1)
    }
  }

  const handleComplete = () => {
    try {
      // 计算测评结果
      const results = questionnaireService.calculateScores()
      console.log('测评结果:', results)
      
      // 跳转到结果页面
      window.location.href = '/results'
    } catch (error) {
      console.error('计算测评结果失败:', error)
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
          <p className="text-gray-700 font-medium">正在为您准备测评内容...</p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-emerald-200 to-blue-200"></div>
          <div className="absolute bottom-0 left-8 w-16 h-16 opacity-25 animate-float">
            <div className="w-full h-full bg-green-500 rounded-full transform rotate-45"></div>
          </div>
          <div className="absolute top-20 right-20 w-24 h-12 bg-white bg-opacity-35 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 right-16 w-12 h-12 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-full h-full bg-emerald-600 rounded-full transform rotate-12"></div>
          </div>
        </div>
        
        <div className="text-center max-w-md mx-auto p-8 bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 border-opacity-30 relative z-10">
          <div className="relative inline-block mb-6">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto relative z-10 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-bounce"></div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🎉 测评完成！</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            感谢您完成所有测评，我们正在为您生成个性化的职业分析报告，这将帮助您更好地了解自己...
          </p>
          
          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:bg-white hover:text-gray-800 text-white py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-xl font-semibold flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
            查看我的报告
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    )
  }

  const totalQuestions = questionnaireTypes.reduce((total, type) => total + questionnaireService.getQuestions(type).length, 0)
  const completedQuestions = questionnaireTypes.slice(0, currentTypeIndex).reduce((total, type) => total + questionnaireService.getQuestions(type).length, 0) + currentQuestionIndex
  const progress = (completedQuestions / totalQuestions) * 100

  // 获取当前问卷类型的图标
  const getIcon = (type: QuestionnaireType) => {
    switch (type) {
      case 'riasec': return <Heart className="w-5 h-5" />
      case 'big_five': return <Brain className="w-5 h-5" />
      case 'career_values': return <Target className="w-5 h-5" />
      case 'aptitude': return <Zap className="w-5 h-5" />
      default: return <Heart className="w-5 h-5" />
    }
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
            
            {/* 中间进度信息 */}
            <div className="text-sm text-gray-600 font-medium">
              问题 {currentQuestionIndex + 1} / {currentQuestions.length} - {questionnaireTypeNames[currentType]}
            </div>
            
            {/* 右侧用户信息 */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {currentUser?.name || '加载中...'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 进度条 */}
      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-sm border-b border-green-100 border-opacity-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
        {/* 返回按钮 - 位于主要内容方框外边 */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Link>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 border-opacity-30">
          {/* 提示信息 - 移动到白色界面顶部 */}
          <div className="mb-6 text-center">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💡</span>
                </div>
                <p className="text-gray-700 font-medium">
                  请仔细阅读每个问题，选择最符合你实际情况的答案
                </p>
              </div>
            </div>
          </div>

          {/* 问卷类型指示器 */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {questionnaireTypes.map((type, index) => (
                <div
                  key={type}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    index === currentTypeIndex
                      ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-lg transform scale-105'
                      : index < currentTypeIndex
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <div className={`${index === currentTypeIndex ? 'animate-pulse' : ''}`}>
                    {getIcon(type)}
                  </div>
                  <span>{questionnaireTypeNames[type]}</span>
                  {index < currentTypeIndex && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 问题标题 */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed relative z-10">
                {currentQuestion?.text || '加载中...'}
              </h2>
              <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-medium">
                {currentType.toUpperCase()}
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>

          {/* 选项列表或输入框 */}
          {currentQuestion && currentQuestion.options && (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option: any, index: number) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group ${
                  answers[currentQuestion.id] === option.id
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 transition-all duration-300 ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg'
                      : 'border-gray-300 group-hover:border-emerald-400'
                  }`}>
                    {answers[currentQuestion.id] === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50 animate-pulse" />
                    )}
                  </div>
                  <span className="text-gray-800 font-medium group-hover:text-gray-900 transition-colors">
                    {option.text}
                  </span>
                  {answers[currentQuestion.id] === option.id && (
                    <div className="ml-auto">
                      <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-bounce"></div>
                    </div>
                  )}
                </div>
              </button>
              ))}
            </div>
          )}

          {/* 文本输入框 */}
          {currentQuestion && currentQuestion.inputType === 'text' && (
            <div className="mb-8">
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder || '请输入您的答案'}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400"
              />
            </div>
          )}

          {/* 导航按钮 */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 && currentTypeIndex === 0}
              className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>上一题</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion?.id]}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <span>
                {currentQuestionIndex === currentQuestions.length - 1 && currentTypeIndex === questionnaireTypes.length - 1 
                  ? '完成测评' 
                  : currentQuestionIndex === currentQuestions.length - 1 
                  ? '下一部分' 
                  : '下一题'
                }
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

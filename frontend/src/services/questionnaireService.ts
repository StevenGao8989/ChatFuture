// 问卷服务类 - 处理问卷相关的业务逻辑

import {
  QuestionnaireType,
  getQuestionnaire,
  getAllQuestionnaireTypes,
  getTotalQuestions
} from '@/data/questionnaires'
import { userDataService } from './userDataService'
import type { BasicInfoData } from '@/data/questionnaires/basic_info/questions'

// Re-export QuestionnaireType for external use
export type { QuestionnaireType }
import type { RiasecQuestion } from '@/data/questionnaires/riasec/questions'
import type { BigFiveQuestion } from '@/data/questionnaires/big_five/questions'
import type { CareerValuesQuestion } from '@/data/questionnaires/career_values/questions'
import type { AptitudeQuestion } from '@/data/questionnaires/aptitude/questions'

export interface QuestionnaireAnswer {
  questionId: string
  optionId: string
  questionnaireType: QuestionnaireType
  timestamp: string
}

export interface QuestionnaireSession {
  id: string
  userId?: string
  answers: QuestionnaireAnswer[]
  currentQuestionIndex: number
  completedTypes: QuestionnaireType[]
  startTime: string
  lastUpdateTime: string
  completed?: boolean // 标记整个测评是否完成
}

export interface AssessmentResult {
  riasecScores: Record<string, number>
  bigFiveScores: Record<string, number>
  careerValuesScores: Record<string, number>
  aptitudeScores: Record<string, number>
  overallScore: number
  recommendations: string[]
}

class QuestionnaireService {
  private session: QuestionnaireSession | null = null

  // 创建新的问卷会话
  createSession(userId?: string): QuestionnaireSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.session = {
      id: sessionId,
      userId,
      answers: [],
      currentQuestionIndex: 0,
      completedTypes: [],
      startTime: new Date().toISOString(),
      lastUpdateTime: new Date().toISOString()
    }

    // 保存到本地存储
    this.saveSession()
    
    return this.session
  }

  // 获取当前会话
  getCurrentSession(): QuestionnaireSession | null {
    if (!this.session) {
      this.loadSession()
    }
    return this.session
  }

  // 保存答案
  saveAnswer(questionId: string, optionId: string, questionnaireType: QuestionnaireType): void {
    if (!this.session) {
      throw new Error('No active session')
    }

    // 移除已存在的答案（如果用户修改了选择）
    this.session.answers = this.session.answers.filter(
      answer => answer.questionId !== questionId
    )

    // 添加新答案
    this.session.answers.push({
      questionId,
      optionId,
      questionnaireType,
      timestamp: new Date().toISOString()
    })

    this.session.lastUpdateTime = new Date().toISOString()
    this.saveSession()
  }

  // 获取指定问卷的问题
  getQuestions(type: QuestionnaireType): any[] {
    const questionnaire = getQuestionnaire(type)
    return questionnaire.questions
  }

  // 获取当前问题
  getCurrentQuestion(type: QuestionnaireType): any | null {
    const questions = this.getQuestions(type)
    const session = this.getCurrentSession()
    
    if (!session) return null
    
    // 找到该类型问卷的当前问题索引
    const currentQuestionIndex = this.getCurrentQuestionIndex(type)
    
    return questions[currentQuestionIndex] || null
  }

  // 获取当前问题索引
  getCurrentQuestionIndex(type: QuestionnaireType): number {
    const session = this.getCurrentSession()
    if (!session) return 0

    const typeAnswers = session.answers.filter(
      answer => answer.questionnaireType === type
    )
    
    return typeAnswers.length
  }

  // 检查是否完成指定问卷
  isQuestionnaireCompleted(type: QuestionnaireType): boolean {
    const session = this.getCurrentSession()
    if (!session) return false

    return session.completedTypes.includes(type)
  }

  // 标记问卷完成
  markQuestionnaireCompleted(type: QuestionnaireType): void {
    if (!this.session) return

    if (!this.session.completedTypes.includes(type)) {
      this.session.completedTypes.push(type)
      this.saveSession()
    }
  }

  // 检查是否完成所有问卷
  isAllQuestionnairesCompleted(): boolean {
    const allTypes = getAllQuestionnaireTypes()
    const session = this.getCurrentSession()
    
    if (!session) return false

    return allTypes.every(type => session.completedTypes.includes(type))
  }

  // 计算问卷得分
  calculateScores(): AssessmentResult {
    const session = this.getCurrentSession()
    if (!session) {
      throw new Error('No session found')
    }

    console.log('Calculating scores for session:', session.id)
    console.log('Total answers:', session.answers.length)

    const riasecScores = this.calculateRIASECScores(session.answers)
    const bigFiveScores = this.calculateBigFiveScores(session.answers)
    const careerValuesScores = this.calculateCareerValuesScores(session.answers)
    const aptitudeScores = this.calculateAptitudeScores(session.answers)

    console.log('RIASEC Scores:', riasecScores)
    console.log('Big Five Scores:', bigFiveScores)
    console.log('Career Values Scores:', careerValuesScores)
    console.log('Aptitude Scores:', aptitudeScores)

    const overallScore = this.calculateOverallScore(
      riasecScores,
      bigFiveScores,
      careerValuesScores,
      aptitudeScores
    )

    const recommendations = this.generateRecommendations(
      riasecScores,
      bigFiveScores,
      careerValuesScores,
      aptitudeScores
    )

    const result = {
      riasecScores,
      bigFiveScores,
      careerValuesScores,
      aptitudeScores,
      overallScore,
      recommendations
    }

    console.log('Final assessment result:', result)
    return result
  }

  // 计算RIASEC得分
  private calculateRIASECScores(answers: QuestionnaireAnswer[]): Record<string, number> {
    const riasecAnswers = answers.filter(answer => answer.questionnaireType === 'riasec')
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

    console.log('RIASEC answers:', riasecAnswers.length)

    riasecAnswers.forEach(answer => {
      const question = this.getQuestionById('riasec', answer.questionId)
      const option = question?.options.find((opt: any) => opt.id === answer.optionId)
      
      console.log(`Processing RIASEC answer: ${answer.questionId} -> ${answer.optionId}`)
      console.log('Question:', question?.text)
      console.log('Question type:', (question as any)?.type)
      console.log('Option:', option)
      
      if (question && (question as any).type && option) {
        // 根据选项ID获取分数值
        const scoreValue = this.getRiasecOptionScore(option.id)
        const questionType = (question as any).type
        
        if (scores.hasOwnProperty(questionType)) {
          scores[questionType] += scoreValue
          console.log(`Adding ${scoreValue} to ${questionType}, new total: ${scores[questionType]}`)
        }
      } else {
        console.warn('Invalid question or option structure:', { question, option })
      }
    })

    // 转换为百分比
    const totalQuestions = riasecAnswers.length / 6 // 每个维度6题
    Object.keys(scores).forEach(key => {
      scores[key] = Math.round((scores[key] / (totalQuestions * 4)) * 100) // 最高分是每题4分（-2到+2）
    })

    console.log('Final RIASEC scores:', scores)
    return scores
  }

  // 获取RIASEC选项的分数值
  private getRiasecOptionScore(optionId: string): number {
    const scoreMap: Record<string, number> = {
      'ri_-2': -2,
      'ri_-1': -1,
      'ri_0': 0,
      'ri_1': 1,
      'ri_2': 2
    }
    return scoreMap[optionId] || 0
  }

  // 计算Big Five得分
  private calculateBigFiveScores(answers: QuestionnaireAnswer[]): Record<string, number> {
    const bigFiveAnswers = answers.filter(answer => answer.questionnaireType === 'big_five')
    const scores: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 }

    console.log('Big Five answers:', bigFiveAnswers.length)

    bigFiveAnswers.forEach(answer => {
      const question = this.getQuestionById('big_five', answer.questionId)
      const option = question?.options.find((opt: any) => opt.id === answer.optionId)
      
      console.log(`Processing Big Five answer: ${answer.questionId} -> ${answer.optionId}`)
      console.log('Question:', question?.text)
      console.log('Option:', option)
      
      if (option && question && typeof option.score === 'number') {
        const trait = question.trait
        let score = option.score
        
        // 如果是反向计分题目，需要反转分数
        if (question.reverse) {
          score = -score
          console.log(`Reversing score for reverse question: ${score}`)
        }
        
        scores[trait] += score
        console.log(`Adding ${score} to ${trait}, new total: ${scores[trait]}`)
      } else {
        console.warn('Invalid option, question, or score type:', { option, question, scoreType: typeof option?.score })
      }
    })

    console.log('Final Big Five scores:', scores)
    return scores
  }

  // 计算职业价值观得分
  private calculateCareerValuesScores(answers: QuestionnaireAnswer[]): Record<string, number> {
    const valuesAnswers = answers.filter(answer => answer.questionnaireType === 'career_values')
    const scores: Record<string, number> = {
      achievement: 0,
      independence: 0,
      recognition: 0,
      relationships: 0,
      support: 0,
      working_conditions: 0
    }

    valuesAnswers.forEach(answer => {
      const question = this.getQuestionById('career_values', answer.questionId)
      const option = question?.options.find((opt: any) => opt.id === answer.optionId)
      
      if (option && option.score) {
        Object.keys(scores).forEach(key => {
          scores[key] += option.score[key] || 0
        })
      }
    })

    return scores
  }

  // 计算能力倾向得分
  private calculateAptitudeScores(answers: QuestionnaireAnswer[]): Record<string, number> {
    const aptitudeAnswers = answers.filter(answer => answer.questionnaireType === 'aptitude')
    const scores: Record<string, number> = {
      verbal: 0,
      numerical: 0,
      abstract: 0,
      spatial: 0,
      mechanical: 0,
      clerical: 0
    }

    aptitudeAnswers.forEach(answer => {
      const question = this.getQuestionById('aptitude', answer.questionId)
      const option = question?.options.find((opt: any) => opt.id === answer.optionId)
      
      if (option && option.score) {
        Object.keys(scores).forEach(key => {
          scores[key] += option.score[key] || 0
        })
      }
    })

    return scores
  }

  // 计算总体得分
  private calculateOverallScore(
    riasecScores: Record<string, number>,
    bigFiveScores: Record<string, number>,
    careerValuesScores: Record<string, number>,
    aptitudeScores: Record<string, number>
  ): number {
    // 这里可以根据需要实现复杂的加权计算逻辑
    const allScores = [
      ...Object.values(riasecScores),
      ...Object.values(bigFiveScores),
      ...Object.values(careerValuesScores),
      ...Object.values(aptitudeScores)
    ]
    
    return allScores.reduce((sum, score) => sum + score, 0) / allScores.length
  }

  // 生成建议
  private generateRecommendations(
    riasecScores: Record<string, number>,
    bigFiveScores: Record<string, number>,
    careerValuesScores: Record<string, number>,
    aptitudeScores: Record<string, number>
  ): string[] {
    const recommendations: string[] = []

    // 基于RIASEC得分生成建议
    const dominantRIASEC = Object.entries(riasecScores)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (dominantRIASEC) {
      const [type, score] = dominantRIASEC
      recommendations.push(`你的主导职业兴趣类型是${type}型，得分${score}`)
    }

    // 基于Big Five得分生成建议
    if (bigFiveScores.E > 0) {
      recommendations.push('你具有外向性特质，适合需要与人交流的工作')
    }

    // 基于职业价值观生成建议
    const topValue = Object.entries(careerValuesScores)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (topValue) {
      recommendations.push(`你最重视${topValue[0]}，在选择工作时应该考虑这一点`)
    }

    return recommendations
  }

  // 根据ID获取问题
  private getQuestionById(type: QuestionnaireType, questionId: string): any {
    try {
      const questions = this.getQuestions(type)
      const question = questions.find((q: any) => q.id === questionId)
      
      if (!question) {
        console.warn(`Question not found: ${questionId} in type ${type}`)
      }
      
      return question
    } catch (error) {
      console.error(`Error getting question ${questionId} from ${type}:`, error)
      return null
    }
  }

  // 保存会话到本地存储（用户隔离）
  public saveSession(): void {
    if (this.session) {
      userDataService.saveUserData('questionnaire_session', this.session)
    }
  }

  // 从本地存储加载会话（用户隔离）
  private loadSession(): void {
    try {
      const session = userDataService.getUserData('questionnaire_session')
      if (session) {
        this.session = session
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      this.session = null
    }
  }

  // 清除会话（用户隔离）
  clearSession(): void {
    this.session = null
    userDataService.deleteUserData('questionnaire_session')
  }

  // 重置会话
  resetSession(): void {
    const userId = this.session?.userId
    this.clearSession()
    if (userId) {
      this.createSession(userId)
    }
  }

  // 保存基本信息
  saveBasicInfo(basicInfo: BasicInfoData): void {
    userDataService.saveUserData('basic_info', basicInfo)
  }

  // 获取基本信息
  getBasicInfo(): BasicInfoData | null {
    return userDataService.getUserData('basic_info')
  }

  // 检查是否已填写基本信息
  hasBasicInfo(): boolean {
    return userDataService.hasUserData('basic_info')
  }

  // 清除基本信息
  clearBasicInfo(): void {
    userDataService.deleteUserData('basic_info')
  }

  // 调试方法：检查问卷数据完整性
  debugQuestionnaireData(): void {
    console.log('=== 问卷数据调试信息 ===')
    
    const types = getAllQuestionnaireTypes()
    types.forEach(type => {
      const questionnaire = getQuestionnaire(type)
      console.log(`\n${type.toUpperCase()} 问卷:`)
      console.log('配置:', questionnaire.config)
      console.log('问题数量:', questionnaire.questions.length)
      
      // 检查前两个问题的结构
      questionnaire.questions.slice(0, 2).forEach((question, index) => {
        console.log(`问题 ${index + 1}:`, {
          id: question.id,
          text: question.text?.substring(0, 50) + '...',
          optionsCount: question.options?.length,
          firstOption: question.options?.[0]
        })
      })
    })
    
    const session = this.getCurrentSession()
    if (session) {
      console.log('\n当前会话:', {
        id: session.id,
        answersCount: session.answers.length,
        completedTypes: session.completedTypes,
        answers: session.answers
      })
    } else {
      console.log('\n没有活动会话')
    }
    
    console.log('=== 调试信息结束 ===')
  }
}

// 导出单例实例
export const questionnaireService = new QuestionnaireService()

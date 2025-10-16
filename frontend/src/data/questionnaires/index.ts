// 问卷管理器 - 统一管理所有问卷数据

import { riasecQuestions, riasecConfig } from './riasec/questions'
import { bigFiveQuestions, bigFiveConfig } from './big_five/questions'
import { careerValuesQuestions, careerValuesConfig } from './career_values/questions'
import { aptitudeQuestions, aptitudeConfig } from './aptitude/questions'
import { basicInfoQuestions, basicInfoConfig } from './basic_info/questions'

export type QuestionnaireType = 'basic_info' | 'riasec' | 'big_five' | 'career_values' | 'aptitude'

export interface QuestionnaireConfig {
  name: string
  description: string
  totalQuestions: number
  categories?: Record<string, { name: string; description: string }>
  traits?: Record<string, { name: string; description: string }>
  values?: Record<string, { name: string; description: string }>
  abilities?: Record<string, { name: string; description: string }>
}

export interface Questionnaire {
  type: QuestionnaireType
  config: QuestionnaireConfig
  questions: any[]
}

// 所有问卷配置
export const questionnaires: Record<QuestionnaireType, Questionnaire> = {
  basic_info: {
    type: 'basic_info',
    config: basicInfoConfig,
    questions: basicInfoQuestions
  },
  riasec: {
    type: 'riasec',
    config: riasecConfig,
    questions: riasecQuestions
  },
  big_five: {
    type: 'big_five',
    config: bigFiveConfig,
    questions: bigFiveQuestions
  },
  career_values: {
    type: 'career_values',
    config: careerValuesConfig,
    questions: careerValuesQuestions
  },
  aptitude: {
    type: 'aptitude',
    config: aptitudeConfig,
    questions: aptitudeQuestions
  }
}

// 获取指定类型的问卷
export function getQuestionnaire(type: QuestionnaireType): Questionnaire {
  return questionnaires[type]
}

// 获取所有问卷类型
export function getAllQuestionnaireTypes(): QuestionnaireType[] {
  return Object.keys(questionnaires) as QuestionnaireType[]
}

// 获取问卷配置
export function getQuestionnaireConfig(type: QuestionnaireType): QuestionnaireConfig {
  return questionnaires[type].config
}

// 获取问卷问题
export function getQuestionnaireQuestions(type: QuestionnaireType): any[] {
  return questionnaires[type].questions
}

// 获取问卷总问题数
export function getTotalQuestions(type: QuestionnaireType): number {
  return questionnaires[type].questions.length
}

// 获取所有问卷的总问题数
export function getAllTotalQuestions(): number {
  return Object.values(questionnaires).reduce((total, q) => total + q.questions.length, 0)
}

// 问卷类型的中文名称映射
export const questionnaireTypeNames: Record<QuestionnaireType, string> = {
  basic_info: '基本信息收集',
  riasec: '职业兴趣测评',
  big_five: '人格特质测评',
  career_values: '职业价值观测评',
  aptitude: '能力倾向测评'
}

// 问卷类型的描述映射
export const questionnaireTypeDescriptions: Record<QuestionnaireType, string> = {
  basic_info: '收集您的基本信息，用于个性化分析和建议',
  riasec: '基于霍兰德职业兴趣理论的六边形模型，评估你的职业兴趣倾向',
  big_five: '基于大五人格理论的五维度人格评估，了解你的性格特质',
  career_values: '评估你在工作中的价值观和动机，找到真正适合的工作',
  aptitude: '评估你在不同领域的能力倾向，发现你的天赋所在'
}

// 问卷类型的图标映射（Lucide图标名称）
export const questionnaireTypeIcons: Record<QuestionnaireType, string> = {
  basic_info: 'User',
  riasec: 'Heart',
  big_five: 'Brain',
  career_values: 'Target',
  aptitude: 'Zap'
}

// 问卷类型的颜色主题映射
export const questionnaireTypeColors: Record<QuestionnaireType, string> = {
  basic_info: 'from-gray-500 to-slate-600',
  riasec: 'from-red-500 to-pink-600',
  big_five: 'from-blue-500 to-indigo-600',
  career_values: 'from-green-500 to-emerald-600',
  aptitude: 'from-purple-500 to-violet-600'
}

// 导出所有问卷数据
export * from './basic_info/questions'
export * from './riasec/questions'
export * from './big_five/questions'
export * from './career_values/questions'
export * from './aptitude/questions'

// 测评相关类型定义

export interface AssessmentQuestion {
  id: string
  type: AssessmentType
  category: string
  text: string
  options: QuestionOption[]
  weight?: number
}

export interface QuestionOption {
  id: string
  text: string
  score: Record<string, number>
}

export type AssessmentType = 'riasec' | 'big_five' | 'career_values' | 'aptitude'

export interface AssessmentAnswer {
  questionId: string
  optionId: string
  score: Record<string, number>
}

export interface AssessmentSession {
  id: string
  userId?: string
  answers: AssessmentAnswer[]
  completedAt?: string
  createdAt: string
}

export interface AssessmentResult {
  id: string
  sessionId: string
  userId?: string
  riasecScores: RIASECScores
  bigFiveScores: BigFiveScores
  careerValuesScores: CareerValuesScores
  aptitudeScores: AptitudeScores
  createdAt: string
}

export interface RIASECScores {
  R: number // Realistic - 现实型
  I: number // Investigative - 研究型
  A: number // Artistic - 艺术型
  S: number // Social - 社会型
  E: number // Enterprising - 企业型
  C: number // Conventional - 常规型
}

export interface BigFiveScores {
  O: number // Openness - 开放性
  C: number // Conscientiousness - 尽责性
  E: number // Extraversion - 外向性
  A: number // Agreeableness - 宜人性
  N: number // Neuroticism - 神经质性
}

export interface CareerValuesScores {
  achievement: number      // 成就导向
  independence: number     // 独立性
  recognition: number      // 认可度
  relationships: number    // 人际关系
  support: number          // 支持度
  working_conditions: number // 工作条件
}

export interface AptitudeScores {
  verbal: number          // 语言能力
  numerical: number       // 数理能力
  abstract: number        // 抽象推理
  spatial: number         // 空间想象
  mechanical: number      // 机械推理
  clerical: number        // 文书能力
}

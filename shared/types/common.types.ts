// 通用类型定义

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: ValidationError[]
}

// 环境配置类型
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  DATABASE_URL: string
  REDIS_URL: string
  JWT_SECRET: string
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  OPENAI_API_KEY?: string
  DEEPSEEK_API_KEY?: string
  LOCAL_AI_ENDPOINT?: string
  DEFAULT_AI_PROVIDER: 'openai' | 'deepseek' | 'local' | 'mock'
}

// 任务队列相关类型
export interface TaskStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  result?: any
  error?: string
  createdAt: string
  updatedAt: string
}

export interface QueueTask<T = any> {
  id: string
  type: string
  data: T
  priority?: number
  delay?: number
  attempts?: number
  maxAttempts?: number
}

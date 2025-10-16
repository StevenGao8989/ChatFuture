// 共享常量定义

export const APP_CONFIG = {
  NAME: 'ChatFuture',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI职业规划与形象生成平台',
  AUTHOR: 'ChatFuture Team',
} as const

export const ASSESSMENT_CONFIG = {
  TYPES: ['riasec', 'big_five', 'career_values', 'aptitude'] as const,
  MAX_QUESTIONS_PER_TYPE: 20,
  DEFAULT_TIMEOUT: 15 * 60 * 1000, // 15分钟
} as const

export const CARD_CONFIG = {
  STYLES: ['cartoon', 'realistic', 'anime', 'watercolor', 'oil_painting'] as const,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  GENERATION_TIMEOUT: 5 * 60 * 1000, // 5分钟
  CLEANUP_DELAY: 24 * 60 * 60 * 1000, // 24小时
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  ASSESSMENT: {
    QUESTIONS: '/assessment/questions',
    SUBMIT: '/assessment/submit',
    RESULT: '/assessment/result',
    HISTORY: '/assessment/history',
  },
  CARD: {
    GENERATE: '/card/generate',
    STATUS: '/card/status',
    GALLERY: '/card/gallery',
    DOWNLOAD: '/card/download',
  },
  STORAGE: {
    UPLOAD: '/storage/upload',
    DELETE: '/storage/delete',
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export const QUEUE_NAMES = {
  CARD_GENERATION: 'card-generation',
  EMAIL_NOTIFICATION: 'email-notification',
  FILE_CLEANUP: 'file-cleanup',
  DATA_ANALYTICS: 'data-analytics',
} as const

export const CACHE_KEYS = {
  ASSESSMENT_QUESTIONS: 'assessment:questions',
  USER_SESSION: 'user:session',
  CARD_TEMPLATES: 'card:templates',
  SYSTEM_CONFIG: 'system:config',
} as const

export const CACHE_TTL = {
  SHORT: 5 * 60, // 5分钟
  MEDIUM: 30 * 60, // 30分钟
  LONG: 2 * 60 * 60, // 2小时
  VERY_LONG: 24 * 60 * 60, // 24小时
} as const

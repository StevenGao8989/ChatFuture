// 画像卡相关类型定义

export interface GeneratedCard {
  id: string
  sessionId: string
  assessmentResultId: string
  userId?: string
  originalPhotoUrl?: string
  generatedCardUrl: string
  thumbnailUrl?: string
  promptUsed: string
  style: CardStyle
  metadata: CardMetadata
  createdAt: string
  updatedAt: string
}

export type CardStyle = 'cartoon'

export interface CardMetadata {
  version: string
  model: string
  parameters: {
    steps: number
    cfg_scale: number
    seed: number
    sampler: string
  }
  generation_time: number
  file_size: number
}

export interface CardGenerationRequest {
  sessionId: string
  assessmentResultId: string
  originalPhoto?: File
  style: CardStyle
  customPrompt?: string
}

export interface CardGenerationResponse {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  estimatedTime?: number
}

export interface CardGenerationResult {
  taskId: string
  status: 'completed' | 'failed'
  cardUrl?: string
  thumbnailUrl?: string
  error?: string
  metadata?: CardMetadata
}

export interface CardTemplate {
  id: string
  name: string
  description: string
  previewUrl: string
  style: CardStyle
  category: string
  isActive: boolean
}

export interface CardGallery {
  cards: GeneratedCard[]
  total: number
  page: number
  limit: number
}

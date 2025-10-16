/**
 * 用户基本信息问卷
 * 在正式测评前收集用户的基本信息，用于后续AI分析
 */

export interface BasicInfoQuestion {
  id: string
  type: 'demographic'
  text: string
  options?: BasicInfoOption[]
  inputType: 'select' | 'text' | 'number'
  required: boolean
  weight: number
  placeholder?: string
}

export interface BasicInfoOption {
  id: string
  text: string
  value: string
}

// 性别选项
export const genderOptions: BasicInfoOption[] = [
  { id: 'gender_male', text: '男', value: 'male' },
  { id: 'gender_female', text: '女', value: 'female' }
]

// 年龄范围选项
export const ageRangeOptions: BasicInfoOption[] = [
  { id: 'age_under_18', text: '18岁以下', value: 'under-18' },
  { id: 'age_18_25', text: '18-25岁', value: '18-25' },
  { id: 'age_26_35', text: '26-35岁', value: '26-35' },
  { id: 'age_36_45', text: '36-45岁', value: '36-45' },
  { id: 'age_46_55', text: '46-55岁', value: '46-55' },
  { id: 'age_55_plus', text: '55岁以上', value: '55+' }
]

// 基本信息问题
export const basicInfoQuestions: BasicInfoQuestion[] = [
  {
    id: 'basic_info_001',
    type: 'demographic',
    text: '请选择您的性别',
    options: genderOptions,
    inputType: 'select',
    required: true,
    weight: 1.0
  },
  {
    id: 'basic_info_002',
    type: 'demographic',
    text: '请选择您的年龄范围',
    options: ageRangeOptions,
    inputType: 'select',
    required: true,
    weight: 1.0
  },
  {
    id: 'basic_info_003',
    type: 'demographic',
    text: '请填写您当前的职业或专业领域',
    inputType: 'text',
    required: true,
    weight: 1.0,
    placeholder: '请输入您的职业或专业领域'
  }
]

// 基本信息问卷配置
export const basicInfoConfig = {
  name: '基本信息收集',
  description: '收集您的基本信息，用于个性化分析',
  totalQuestions: basicInfoQuestions.length,
  category: 'demographic',
  purpose: '为后续AI分析提供基础数据'
}

// 基本信息数据结构
export interface BasicInfoData {
  gender: string
  ageRange: string
  occupation: string
  completedAt: string
}

// 基本信息验证函数
export function validateBasicInfo(data: Partial<BasicInfoData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.gender) {
    errors.push('请选择您的性别')
  }
  
  if (!data.ageRange) {
    errors.push('请选择您的年龄范围')
  }
  
  if (!data.occupation || data.occupation.trim().length === 0) {
    errors.push('请填写您的职业信息')
  } else if (data.occupation.trim().length < 2) {
    errors.push('职业信息至少需要2个字符')
  } else if (data.occupation.trim().length > 50) {
    errors.push('职业信息不能超过50个字符')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 获取年龄范围的数值范围（用于分析）
export function getAgeRangeValue(ageRange: string): { min: number; max: number } {
  switch (ageRange) {
    case 'under-18':
      return { min: 0, max: 17 }
    case '18-25':
      return { min: 18, max: 25 }
    case '26-35':
      return { min: 26, max: 35 }
    case '36-45':
      return { min: 36, max: 45 }
    case '46-55':
      return { min: 46, max: 55 }
    case '55+':
      return { min: 55, max: 100 }
    default:
      return { min: 0, max: 0 }
  }
}

// 职业分类函数（用于AI分析）
export function categorizeOccupation(occupation: string): string[] {
  const categories: string[] = []
  const lowerOccupation = occupation.toLowerCase()
  
  // 技术类
  if (lowerOccupation.includes('工程师') || lowerOccupation.includes('developer') || 
      lowerOccupation.includes('程序员') || lowerOccupation.includes('技术') ||
      lowerOccupation.includes('it') || lowerOccupation.includes('software')) {
    categories.push('technology')
  }
  
  // 管理类
  if (lowerOccupation.includes('经理') || lowerOccupation.includes('主管') ||
      lowerOccupation.includes('总监') || lowerOccupation.includes('ceo') ||
      lowerOccupation.includes('manager') || lowerOccupation.includes('director')) {
    categories.push('management')
  }
  
  // 销售营销类
  if (lowerOccupation.includes('销售') || lowerOccupation.includes('营销') ||
      lowerOccupation.includes('市场') || lowerOccupation.includes('sales') ||
      lowerOccupation.includes('marketing')) {
    categories.push('sales_marketing')
  }
  
  // 教育类
  if (lowerOccupation.includes('教师') || lowerOccupation.includes('老师') ||
      lowerOccupation.includes('教授') || lowerOccupation.includes('教育') ||
      lowerOccupation.includes('teacher') || lowerOccupation.includes('educator')) {
    categories.push('education')
  }
  
  // 医疗类
  if (lowerOccupation.includes('医生') || lowerOccupation.includes('护士') ||
      lowerOccupation.includes('医疗') || lowerOccupation.includes('healthcare') ||
      lowerOccupation.includes('medical')) {
    categories.push('healthcare')
  }
  
  // 金融类
  if (lowerOccupation.includes('金融') || lowerOccupation.includes('银行') ||
      lowerOccupation.includes('财务') || lowerOccupation.includes('投资') ||
      lowerOccupation.includes('finance') || lowerOccupation.includes('banking')) {
    categories.push('finance')
  }
  
  // 艺术创意类
  if (lowerOccupation.includes('设计') || lowerOccupation.includes('艺术') ||
      lowerOccupation.includes('创意') || lowerOccupation.includes('designer') ||
      lowerOccupation.includes('artist') || lowerOccupation.includes('creative')) {
    categories.push('creative')
  }
  
  // 学生
  if (lowerOccupation.includes('学生') || lowerOccupation.includes('student')) {
    categories.push('student')
  }
  
  // 如果没有匹配到任何类别，返回通用类别
  if (categories.length === 0) {
    categories.push('other')
  }
  
  return categories
}

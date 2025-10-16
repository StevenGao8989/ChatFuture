'use client'

import { useState } from 'react'
import { User, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react'
import { questionnaireService } from '@/services/questionnaireService'
import type { BasicInfoData } from '@/data/questionnaires/basic_info/questions'
import { validateBasicInfo } from '@/data/questionnaires/basic_info/questions'

interface BasicInfoFormProps {
  onComplete: (basicInfo: BasicInfoData) => void
  onSkip?: () => void
}

export default function BasicInfoForm({ onComplete, onSkip }: BasicInfoFormProps) {
  const [formData, setFormData] = useState<Partial<BasicInfoData>>({
    gender: '',
    ageRange: '',
    occupation: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof BasicInfoData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // 清除相关错误
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])

    try {
      // 验证表单数据
      const validation = validateBasicInfo(formData)
      
      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }

      // 创建完整的基本信息对象
      const basicInfo: BasicInfoData = {
        gender: formData.gender!,
        ageRange: formData.ageRange!,
        occupation: formData.occupation!.trim(),
        completedAt: new Date().toISOString()
      }

      // 保存基本信息
      questionnaireService.saveBasicInfo(basicInfo)

      // 调用完成回调
      onComplete(basicInfo)

    } catch (error) {
      console.error('保存基本信息失败:', error)
      setErrors(['保存失败，请重试'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' }
  ]

  const ageRangeOptions = [
    { value: 'under-18', label: '18岁以下' },
    { value: '18-25', label: '18-25岁' },
    { value: '26-35', label: '26-35岁' },
    { value: '36-45', label: '36-45岁' },
    { value: '46-55', label: '46-55岁' },
    { value: '55+', label: '55岁以上' }
  ]

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 标题区域 */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full animate-pulse"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          基本信息收集
        </h2>
        <p className="text-gray-600">
          这些信息将帮助我们为您提供更精准的分析和建议
        </p>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 性别选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            请选择您的性别
          </label>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('gender', option.value)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  formData.gender === option.value
                    ? 'border-gray-400 bg-gray-50 text-gray-800'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {formData.gender === option.value && <CheckCircle className="w-4 h-4" />}
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 年龄范围选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            请选择您的年龄范围
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ageRangeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange('ageRange', option.value)}
                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                  formData.ageRange === option.value
                    ? 'border-gray-400 bg-gray-50 text-gray-800'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  {formData.ageRange === option.value && <CheckCircle className="w-3 h-3" />}
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 职业输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            请填写您当前的职业或专业领域
          </label>
          <input
            type="text"
            value={formData.occupation || ''}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            placeholder="如：软件工程师、市场营销、学生等"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            请输入2-50个字符
          </p>
        </div>

        {/* 错误信息 */}
        {errors.length > 0 && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">{error}</p>
              ))}
            </div>
          </div>
        )}

        {/* 按钮组 */}
        <div className="flex space-x-3">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              跳过
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 disabled:from-gray-300 disabled:to-slate-300 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>保存中...</span>
              </>
            ) : (
              <>
                <span>开始测评</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* 底部提示 */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          您的信息将被安全保存，仅用于为您提供个性化的职业分析
        </p>
      </div>
    </div>
  )
}

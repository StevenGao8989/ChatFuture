// 能力倾向测评问卷（自评式 Likert）
// 维度：数理(NR)、文字(VR)、空间(SP)、逻辑(LG)、机械(ME)、细节(AT)、记忆(MM)、编程(CS)

export interface AptitudeQuestion {
  id: string
  domain: 'NR' | 'VR' | 'SP' | 'LG' | 'ME' | 'AT' | 'MM' | 'CS'
  text: string
  options: AptitudeOption[]
  weight: number
}

export interface AptitudeOption {
  id: string
  text: string
  score: {
    NR?: number
    VR?: number
    SP?: number
    LG?: number
    ME?: number
    AT?: number
    MM?: number
    CS?: number
  }
}

// 统一Likert选项（-2 到 +2）
export const aptitudeLikert: AptitudeOption[] = [
  { id: 'likert_-2', text: '非常不符合/非常没把握', score: {} },
  { id: 'likert_-1', text: '不太符合/没把握', score: {} },
  { id: 'likert_0',  text: '一般/不确定', score: {} },
  { id: 'likert_1',  text: '比较符合/有把握', score: {} },
  { id: 'likert_2',  text: '非常符合/非常有把握', score: {} }
]

// 题目：每题针对单一域计分，选择项将按所选 Likert 的索引映射为该域的 -2..+2
// 前端实现：提交时将把所选 likert 的 -2..+2 分值写入对应域键
export const aptitudeQuestions: AptitudeQuestion[] = [
  // NR 数理 4
  { id: 'apt_NR_001', domain: 'NR', text: '我能迅速估算折扣、税费或汇率换算。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_NR_002', domain: 'NR', text: '面对复杂的数据表，我能提炼出关键趋势。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_NR_003', domain: 'NR', text: '我喜欢解代数/概率类题目并能找到多种解法。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_NR_004', domain: 'NR', text: '我能在压力下保持数字计算的准确性。', options: aptitudeLikert, weight: 1.0 },

  // VR 文字 4
  { id: 'apt_VR_001', domain: 'VR', text: '我能把专业材料改写成大众易懂的语言。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_VR_002', domain: 'VR', text: '我擅长快速抓住文章主旨并总结要点。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_VR_003', domain: 'VR', text: '我对用词、语法和逻辑连贯性很敏感。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_VR_004', domain: 'VR', text: '我能在讨论中清晰表达并说服他人。', options: aptitudeLikert, weight: 1.0 },

  // SP 空间 4
  { id: 'apt_SP_001', domain: 'SP', text: '我能在脑海中把二维图变换为三维形体。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_SP_002', domain: 'SP', text: '我能从不同视角想象物体的结构与装配顺序。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_SP_003', domain: 'SP', text: '阅读工程图/地图时我能迅速定位与导航。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_SP_004', domain: 'SP', text: '我擅长拼装模型或搭建乐高等结构。', options: aptitudeLikert, weight: 1.0 },

  // LG 逻辑 4
  { id: 'apt_LG_001', domain: 'LG', text: '我习惯用“前提-推理-结论”的结构解决问题。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_LG_002', domain: 'LG', text: '我能发现论证中的谬误或隐藏假设。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_LG_003', domain: 'LG', text: '我喜欢数独、逻辑推理或博弈类题目。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_LG_004', domain: 'LG', text: '我能把复杂问题拆分成可执行的步骤。', options: aptitudeLikert, weight: 1.0 },

  // ME 机械 4
  { id: 'apt_ME_001', domain: 'ME', text: '我能判断简单机构的受力与运动趋势。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_ME_002', domain: 'ME', text: '我动手能力强，能排查设备的常见故障。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_ME_003', domain: 'ME', text: '我理解齿轮、杠杆、滑轮等原理并能应用。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_ME_004', domain: 'ME', text: '我能根据材料与结构判断耐用性。', options: aptitudeLikert, weight: 1.0 },

  // AT 细节 4
  { id: 'apt_AT_001', domain: 'AT', text: '我能在文档/表格中迅速发现小错误。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_AT_002', domain: 'AT', text: '我在重复性工作中也能长期保持稳定质量。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_AT_003', domain: 'AT', text: '我会为任务建立清单并逐项校验。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_AT_004', domain: 'AT', text: '我对格式、标点、单位与精度有严格要求。', options: aptitudeLikert, weight: 1.0 },

  // MM 记忆 4
  { id: 'apt_MM_001', domain: 'MM', text: '我能快速记住新概念与其要点。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_MM_002', domain: 'MM', text: '我记人名、术语与步骤的准确度较高。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_MM_003', domain: 'MM', text: '我能在较长时间后准确回忆关键信息。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_MM_004', domain: 'MM', text: '我擅长建立记忆术并迁移到新领域。', options: aptitudeLikert, weight: 1.0 },

  // CS 编程 4
  { id: 'apt_CS_001', domain: 'CS', text: '我能用代码把需求拆解为模块与函数。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_CS_002', domain: 'CS', text: '我能阅读他人代码并进行调试与优化。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_CS_003', domain: 'CS', text: '我理解常见数据结构与算法的使用场景。', options: aptitudeLikert, weight: 1.0 },
  { id: 'apt_CS_004', domain: 'CS', text: '我能把现实问题抽象成可计算的流程。', options: aptitudeLikert, weight: 1.0 }
]

// 配置
export const aptitudeConfig = {
  name: '能力倾向测评',
  description: '基于自评的多维能力倾向画像（NR/VR/SP/LG/ME/AT/MM/CS）。',
  totalQuestions: aptitudeQuestions.length,
  domains: {
    NR: { name: '数理解题', description: '计算、估算与数据理解能力' },
    VR: { name: '文字表达', description: '阅读理解与语言表达能力' },
    SP: { name: '空间想象', description: '空间构型与三维思维能力' },
    LG: { name: '逻辑推理', description: '形式化思维与问题分解能力' },
    ME: { name: '机械动手', description: '结构理解与动手排障能力' },
    AT: { name: '细节敏感', description: '持续注意与质量控制能力' },
    MM: { name: '记忆保持', description: '信息编码与长时回忆能力' },
    CS: { name: '编程建模', description: '抽象建模与实现调试能力' }
  }
}

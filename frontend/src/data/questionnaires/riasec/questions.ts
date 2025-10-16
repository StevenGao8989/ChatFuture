// RIASEC 职业兴趣测评（霍兰德六维）
// 维度：R 现实型, I 研究型, A 艺术型, S 社会型, E 企业型, C 常规型
// 评分：Likert -2..+2（兴趣强度），每题仅对所属维度计分

export interface RiasecQuestion {
  id: string
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
  text: string
  options: RiasecOption[]
  weight: number
}

export interface RiasecOption {
  id: string
  text: string
  score: {
    R?: number
    I?: number
    A?: number
    S?: number
    E?: number
    C?: number
  }
}

// RIASEC选项的分数设置函数
const createRiasecScore = (type: string, value: number) => {
  const score: any = {}
  score[type] = value
  return score
}

export const riasecLikert: RiasecOption[] = [
  { id: 'ri_-2', text: '非常不感兴趣', score: {} }, // 分数将在问题级别设置
  { id: 'ri_-1', text: '不太感兴趣', score: {} },
  { id: 'ri_0',  text: '一般/不确定', score: {} },
  { id: 'ri_1',  text: '比较感兴趣', score: {} },
  { id: 'ri_2',  text: '非常感兴趣', score: {} }
]

// 每型6题，共36题
export const riasecQuestions: RiasecQuestion[] = [
  // R 现实型
  { id: 'RIASEC_R_001', type: 'R', text: '维修或组装器械/家具/电子产品。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_R_002', type: 'R', text: '在户外从事体力或操作性工作（如园艺、测绘）。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_R_003', type: 'R', text: '使用工具、设备或机器完成任务。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_R_004', type: 'R', text: '阅读产品或装配的技术手册并照做。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_R_005', type: 'R', text: '进行安全检查、质量检验或维护保养。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_R_006', type: 'R', text: '在工作中动手解决电工/水管等实际问题。', options: riasecLikert, weight: 1.0 },

  // I 研究型
  { id: 'RIASEC_I_001', type: 'I', text: '设计实验、收集数据并分析结果。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_I_002', type: 'I', text: '阅读科学论文或技术报告并复现结论。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_I_003', type: 'I', text: '用数学模型或编程解决问题。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_I_004', type: 'I', text: '探索未知并提出可检验的假设。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_I_005', type: 'I', text: '在实验室或研究环境中长期专注工作。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_I_006', type: 'I', text: '对复杂系统进行原理推导或仿真。', options: riasecLikert, weight: 1.0 },

  // A 艺术型
  { id: 'RIASEC_A_001', type: 'A', text: '创作绘画、写作、摄影或音乐等作品。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_A_002', type: 'A', text: '在开放、自由的氛围中表达自我。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_A_003', type: 'A', text: '进行舞台表演、演讲或视频创作。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_A_004', type: 'A', text: '从事视觉/交互/空间/时尚等设计。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_A_005', type: 'A', text: '为品牌或项目构思富有创意的点子。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_A_006', type: 'A', text: '通过艺术作品影响他人的感受。', options: riasecLikert, weight: 1.0 },

  // S 社会型
  { id: 'RIASEC_S_001', type: 'S', text: '辅导、教学或培训他人。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_S_002', type: 'S', text: '为他人提供心理/职业/学习支持。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_S_003', type: 'S', text: '组织志愿活动或社区服务。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_S_004', type: 'S', text: '在团队中协调冲突与沟通。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_S_005', type: 'S', text: '与不同背景的人建立信任关系。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_S_006', type: 'S', text: '在公共卫生或公益项目中帮助他人。', options: riasecLikert, weight: 1.0 },

  // E 企业型
  { id: 'RIASEC_E_001', type: 'E', text: '发起项目、整合资源并推动落地。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_E_002', type: 'E', text: '进行商业谈判或销售推广。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_E_003', type: 'E', text: '在不确定环境中快速决策与试错。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_E_004', type: 'E', text: '为团队设定目标并激励成员达成。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_E_005', type: 'E', text: '通过演讲/路演影响他人。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_E_006', type: 'E', text: '研究市场与商业模式以获取增长。', options: riasecLikert, weight: 1.0 },

  // C 常规型
  { id: 'RIASEC_C_001', type: 'C', text: '处理报表、档案与标准化流程。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_C_002', type: 'C', text: '遵循规范完成精确的数据录入/核对。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_C_003', type: 'C', text: '维护秩序、制度与合规要求。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_C_004', type: 'C', text: '在明确分工下高效配合。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_C_005', type: 'C', text: '整理复杂信息并形成标准模板。', options: riasecLikert, weight: 1.0 },
  { id: 'RIASEC_C_006', type: 'C', text: '长期稳定重复性工作也能保持质量。', options: riasecLikert, weight: 1.0 }
]

// 配置
export const riasecConfig = {
  name: 'RIASEC 职业兴趣测评',
  description: '评估你对六类职业活动的兴趣强度，生成霍兰德兴趣代码。',
  totalQuestions: riasecQuestions.length,
  types: {
    R: { name: '现实型', description: '实践、动手、操作性任务' },
    I: { name: '研究型', description: '分析、探索、科学问题' },
    A: { name: '艺术型', description: '创意、表达、审美导向' },
    S: { name: '社会型', description: '助人、沟通、服务' },
    E: { name: '企业型', description: '领导、影响、商业驱动' },
    C: { name: '常规型', description: '秩序、细节、流程' }
  }
}

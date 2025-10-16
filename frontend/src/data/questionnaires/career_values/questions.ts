// 职业价值观测评问卷
// 维度：成就导向(achievement)、独立性(independence)、认可度(recognition)、人际关系(relationships)、支持度(support)、工作条件(working_conditions)

export interface CareerValuesQuestion {
  id: string
  category: string
  text: string
  options: CareerValuesOption[]
  weight: number
}

export interface CareerValuesOption {
  id: string
  text: string
  score: {
    achievement?: number
    independence?: number
    recognition?: number
    relationships?: number
    support?: number
    working_conditions?: number
  }
}

export const careerValuesQuestions: CareerValuesQuestion[] = [
  // 你给的示例5题保留并继续扩展 —— 共12题
  {
    id: 'values_001',
    category: 'work_motivation',
    text: '在工作中，什么对你最重要？',
    weight: 1.0,
    options: [
      { id: 'opt_001', text: '高收入和奖金', score: { achievement: 3, independence: 1 } },
      { id: 'opt_002', text: '自主决策权', score: { independence: 3, achievement: 1 } },
      { id: 'opt_003', text: '同事和上司的认可', score: { recognition: 3, relationships: 1 } },
      { id: 'opt_004', text: '良好的团队合作', score: { relationships: 3, support: 1 } },
      { id: 'opt_005', text: '工作稳定性和保障', score: { support: 3, working_conditions: 1 } },
      { id: 'opt_006', text: '舒适的工作环境', score: { working_conditions: 3, support: 1 } }
    ]
  },
  {
    id: 'values_002',
    category: 'work_motivation',
    text: '你希望在工作中获得什么？',
    weight: 1.0,
    options: [
      { id: 'opt_007', text: '挑战性的项目和任务', score: { achievement: 3, independence: 1 } },
      { id: 'opt_008', text: '灵活的工作安排', score: { independence: 3, working_conditions: 1 } },
      { id: 'opt_009', text: '公开的表扬和奖励', score: { recognition: 3, achievement: 1 } },
      { id: 'opt_010', text: '与同事的友谊', score: { relationships: 3, support: 1 } },
      { id: 'opt_011', text: '公司的培训和福利', score: { support: 3, working_conditions: 1 } },
      { id: 'opt_012', text: '现代化的办公设备', score: { working_conditions: 3, independence: 1 } }
    ]
  },
  {
    id: 'values_003',
    category: 'work_motivation',
    text: '你理想的工作环境是什么样的？',
    weight: 1.0,
    options: [
      { id: 'opt_013', text: '竞争激烈，充满挑战', score: { achievement: 3, independence: 1 } },
      { id: 'opt_014', text: '自由度高，不受约束', score: { independence: 3, working_conditions: 1 } },
      { id: 'opt_015', text: '经常获得表扬和认可', score: { recognition: 3, achievement: 1 } },
      { id: 'opt_016', text: '团队氛围和谐融洽', score: { relationships: 3, support: 1 } },
      { id: 'opt_017', text: '有完善的保障制度', score: { support: 3, working_conditions: 1 } },
      { id: 'opt_018', text: '环境优美，设施齐全', score: { working_conditions: 3, support: 1 } }
    ]
  },
  {
    id: 'values_004',
    category: 'work_motivation',
    text: '什么最能激励你努力工作？',
    weight: 1.0,
    options: [
      { id: 'opt_019', text: '追求卓越和成功', score: { achievement: 3, recognition: 1 } },
      { id: 'opt_020', text: '能够自主决定工作方式', score: { independence: 3, achievement: 1 } },
      { id: 'opt_021', text: '获得他人的赞赏', score: { recognition: 3, relationships: 1 } },
      { id: 'opt_022', text: '帮助同事和团队成功', score: { relationships: 3, support: 1 } },
      { id: 'opt_023', text: '获得更好的福利待遇', score: { support: 3, working_conditions: 1 } },
      { id: 'opt_024', text: '在舒适的环境中工作', score: { working_conditions: 3, support: 1 } }
    ]
  },
  {
    id: 'values_005',
    category: 'work_motivation',
    text: '你希望从工作中得到什么满足感？',
    weight: 1.0,
    options: [
      { id: 'opt_025', text: '完成困难任务后的成就感', score: { achievement: 3, independence: 1 } },
      { id: 'opt_026', text: '按照自己的方式工作的自由', score: { independence: 3, working_conditions: 1 } },
      { id: 'opt_027', text: '获得他人的尊重和认可', score: { recognition: 3, achievement: 1 } },
      { id: 'opt_028', text: '与同事建立深厚的友谊', score: { relationships: 3, support: 1 } },
      { id: 'opt_029', text: '享受公司的各种福利', score: { support: 3, working_conditions: 1 } },
      { id: 'opt_030', text: '在理想的环境中工作', score: { working_conditions: 3, support: 1 } }
    ]
  },

  // 新增7~12题
  {
    id: 'values_006',
    category: 'growth',
    text: '当你评估一份offer时，哪项最能体现“成长”？',
    weight: 1.0,
    options: [
      { id: 'opt_031', text: '高难度目标与晋升通道清晰', score: { achievement: 3 } },
      { id: 'opt_032', text: '远程/弹性/自主安排时间', score: { independence: 3 } },
      { id: 'opt_033', text: '明星团队+行业认可的背书', score: { recognition: 3 } },
      { id: 'opt_034', text: '导师制与强互助文化', score: { relationships: 2, support: 1 } },
      { id: 'opt_035', text: '完善的培训预算与报销', score: { support: 3 } },
      { id: 'opt_036', text: '硬件配置拉满/工位舒适', score: { working_conditions: 3 } }
    ]
  },
  {
    id: 'values_007',
    category: 'decision_style',
    text: '你更偏好的决策方式是：',
    weight: 1.0,
    options: [
      { id: 'opt_037', text: '以结果为导向，追求突破', score: { achievement: 3 } },
      { id: 'opt_038', text: '以自主为先，权责到人', score: { independence: 3 } },
      { id: 'opt_039', text: '以声誉为先，注重口碑', score: { recognition: 3 } },
      { id: 'opt_040', text: '以共识为先，照顾关系', score: { relationships: 3 } },
      { id: 'opt_041', text: '以保障为先，规避风险', score: { support: 3 } },
      { id: 'opt_042', text: '以体验为先，重视环境', score: { working_conditions: 3 } }
    ]
  },
  {
    id: 'values_008',
    category: 'conflict',
    text: '遇到团队冲突，你最希望组织提供什么？',
    weight: 1.0,
    options: [
      { id: 'opt_043', text: '明确目标与绩效标准', score: { achievement: 2, support: 1 } },
      { id: 'opt_044', text: '授权机制，允许不同做法试错', score: { independence: 3 } },
      { id: 'opt_045', text: '公开反馈与荣誉机制', score: { recognition: 3 } },
      { id: 'opt_046', text: '专业的协作/沟通辅导', score: { relationships: 3 } },
      { id: 'opt_047', text: 'HR介入与申诉通道', score: { support: 3 } },
      { id: 'opt_048', text: '安静空间与设备支持', score: { working_conditions: 3 } }
    ]
  },
  {
    id: 'values_009',
    category: 'tradeoff',
    text: '在“高薪但高压”与“中薪但稳定”之间，你更接近：',
    weight: 1.0,
    options: [
      { id: 'opt_049', text: '高薪高压，挑战更重要', score: { achievement: 3 } },
      { id: 'opt_050', text: '自由度高即可抵消压力', score: { independence: 3 } },
      { id: 'opt_051', text: '只要认可度高也可接受', score: { recognition: 3 } },
      { id: 'opt_052', text: '更看重人和与氛围', score: { relationships: 3 } },
      { id: 'opt_053', text: '更看重稳定福利与制度', score: { support: 3 } },
      { id: 'opt_054', text: '更看重环境与体验', score: { working_conditions: 3 } }
    ]
  },
  {
    id: 'values_010',
    category: 'reward',
    text: '以下哪种回报最让你有被“看见”的感觉？',
    weight: 1.0,
    options: [
      { id: 'opt_055', text: '高额奖金/项目分成', score: { achievement: 3, recognition: 1 } },
      { id: 'opt_056', text: '话语权与独立预算', score: { independence: 3 } },
      { id: 'opt_057', text: '内部/外部公开表彰', score: { recognition: 3 } },
      { id: 'opt_058', text: '团队聚会/团建时的感谢', score: { relationships: 3 } },
      { id: 'opt_059', text: '长期激励/补贴/保障升级', score: { support: 3 } },
      { id: 'opt_060', text: '更好的工位/设备/差旅舱位', score: { working_conditions: 3 } }
    ]
  },
  {
    id: 'values_011',
    category: 'satisfaction_driver',
    text: '什么会让你对工作“持续满意”？',
    weight: 1.0,
    options: [
      { id: 'opt_061', text: '不断挑战与明确成长阶梯', score: { achievement: 3 } },
      { id: 'opt_062', text: '自主选择项目与同事', score: { independence: 3 } },
      { id: 'opt_063', text: '被领导与行业认可', score: { recognition: 3 } },
      { id: 'opt_064', text: '稳定可依赖的伙伴关系', score: { relationships: 3 } },
      { id: 'opt_065', text: '制度透明与资源可得', score: { support: 3 } },
      { id: 'opt_066', text: '环境舒适、工具高效', score: { working_conditions: 3 } }
    ]
  },
  {
    id: 'values_012',
    category: 'deal_breaker',
    text: '以下哪项最可能成为你“拒绝一份工作”的关键？',
    weight: 1.0,
    options: [
      { id: 'opt_067', text: '目标模糊、成就不可衡量', score: { achievement: -2 } },
      { id: 'opt_068', text: '流程繁琐、自由度极低', score: { independence: -2 } },
      { id: 'opt_069', text: '缺乏认可、努力不被看见', score: { recognition: -2 } },
      { id: 'opt_070', text: '关系紧张、缺少合作氛围', score: { relationships: -2 } },
      { id: 'opt_071', text: '制度不健全、缺乏保障', score: { support: -2 } },
      { id: 'opt_072', text: '环境差/设备落后/噪音大', score: { working_conditions: -2 } }
    ]
  }
]

// 导出配置信息
export const careerValuesConfig = {
  name: '职业价值观测评',
  description: '评估你在工作中的价值观和动机',
  totalQuestions: careerValuesQuestions.length,
  values: {
    achievement: { name: '成就导向', description: '追求成功和卓越' },
    independence: { name: '独立性', description: '自主性和自由度' },
    recognition: { name: '认可度', description: '获得他人的认可和赞赏' },
    relationships: { name: '人际关系', description: '与同事的友谊和合作' },
    support: { name: '支持度', description: '工作稳定性和保障' },
    working_conditions: { name: '工作条件', description: '工作环境和设施' }
  }
}

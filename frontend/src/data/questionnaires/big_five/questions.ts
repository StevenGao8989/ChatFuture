// Big Five 人格特质测评问卷（简化IPIP风格自编题）
// 维度：O 开放性, C 尽责性, E 外向性, A 宜人性, N 神经质
// 评分：Likert -2..+2，含反向计分 reverse

export interface BigFiveQuestion {
  id: string
  trait: 'O' | 'C' | 'E' | 'A' | 'N'
  text: string
  options: BigFiveOption[]
  weight: number
  reverse: boolean
}

export interface BigFiveOption {
  id: string
  text: string
  score: number // -2..2
}

export const bigFiveLikert: BigFiveOption[] = [
  { id: 'bf_-2', text: '非常不同意', score: -2 },
  { id: 'bf_-1', text: '不同意', score: -1 },
  { id: 'bf_0',  text: '中立/不确定', score: 0 },
  { id: 'bf_1',  text: '同意', score: 1 },
  { id: 'bf_2',  text: '非常同意', score: 2 }
]

// 每维6题，共30题
export const bigFiveQuestions: BigFiveQuestion[] = [
  // O 开放性
  { id: 'BF_O_001', trait: 'O', text: '我喜欢尝试全新的方法与体验。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_O_002', trait: 'O', text: '我经常被艺术、音乐或自然景观打动。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_O_003', trait: 'O', text: '我对抽象概念与理论讨论感兴趣。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_O_004', trait: 'O', text: '我不太愿意改变日常习惯。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_O_005', trait: 'O', text: '我会主动探索不同文化、观点或学科。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_O_006', trait: 'O', text: '我更偏好熟悉的事物而非新奇的选择。', options: bigFiveLikert, weight: 1.0, reverse: true },

  // C 尽责性
  { id: 'BF_C_001', trait: 'C', text: '我会按计划推进任务并按时完成。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_C_002', trait: 'C', text: '我的工作台/文件通常整理得井井有条。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_C_003', trait: 'C', text: '我容易被小事分心而拖延。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_C_004', trait: 'C', text: '我愿意为长期目标牺牲短期享乐。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_C_005', trait: 'C', text: '我做事常常没有条理。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_C_006', trait: 'C', text: '我会设定清晰标准并自我监督。', options: bigFiveLikert, weight: 1.0, reverse: false },

  // E 外向性
  { id: 'BF_E_001', trait: 'E', text: '在群体场合我精力充沛、健谈。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_E_002', trait: 'E', text: '我喜欢成为焦点并主动结识新朋友。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_E_003', trait: 'E', text: '我更偏好安静的独处时光。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_E_004', trait: 'E', text: '我在陌生环境中也能快速融入并交流。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_E_005', trait: 'E', text: '我在社交后常感到精力被消耗。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_E_006', trait: 'E', text: '我喜欢策划/参与热闹的活动。', options: bigFiveLikert, weight: 1.0, reverse: false },

  // A 宜人性
  { id: 'BF_A_001', trait: 'A', text: '我愿意倾听并体谅他人的处境。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_A_002', trait: 'A', text: '与人合作时我更看重双赢与公平。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_A_003', trait: 'A', text: '我有时为了赢会忽略他人感受。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_A_004', trait: 'A', text: '我乐于给予支持并分享资源。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_A_005', trait: 'A', text: '我容易与人发生对立和冲突。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_A_006', trait: 'A', text: '我相信大多数人是善意且可信赖的。', options: bigFiveLikert, weight: 1.0, reverse: false },

  // N 神经质
  { id: 'BF_N_001', trait: 'N', text: '我会因小事而感到焦虑或紧张。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_N_002', trait: 'N', text: '面对不确定性我难以保持放松。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_N_003', trait: 'N', text: '压力来临时我能从容应对。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_N_004', trait: 'N', text: '我情绪起伏较大，容易受环境影响。', options: bigFiveLikert, weight: 1.0, reverse: false },
  { id: 'BF_N_005', trait: 'N', text: '我很少感到沮丧或担忧。', options: bigFiveLikert, weight: 1.0, reverse: true },
  { id: 'BF_N_006', trait: 'N', text: '在意外发生时我会先产生负面反应。', options: bigFiveLikert, weight: 1.0, reverse: false }
]

// 配置
export const bigFiveConfig = {
  name: 'Big Five 人格测评',
  description: '开放性、尽责性、外向性、宜人性与神经质五大人格维度。',
  totalQuestions: bigFiveQuestions.length,
  traits: {
    O: { name: '开放性', description: '好奇、审美敏感、思想开放' },
    C: { name: '尽责性', description: '自律、条理、目标导向' },
    E: { name: '外向性', description: '活力、社交性、主张性' },
    A: { name: '宜人性', description: '共情、合作、信任' },
    N: { name: '神经质', description: '情绪稳定性的反向指标' }
  }
}

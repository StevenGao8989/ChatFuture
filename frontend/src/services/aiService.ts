/**
 * AI服务 - 处理职业规划分析和报告生成
 */

interface AssessmentData {
  riasec: {
    scores: { [key: string]: number }
  }
  bigFive: {
    scores: { [key: string]: number }
  }
  careerValues: {
    scores: { [key: string]: number }
  }
  aptitude: {
    scores: { [key: string]: number }
  }
}

interface AIReportResponse {
  summary: string
  interest_analysis: string
  personality_analysis: string
  values_analysis: string
  ability_analysis: string
  career_recommendations: Array<{
    title: string
    reason: string
  }>
  development_advice: string
  closing_message: string
}

class AIService {
  private static instance: AIService

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  /**
   * 生成职业规划报告
   */
  async generateCareerReport(assessmentData: AssessmentData, userInfo?: { 
    name?: string; 
    occupation?: string; 
    ageRange?: string; 
    gender?: string; 
    basicInfo?: any 
  }): Promise<AIReportResponse> {
    try {
      // 构建系统提示词
      const systemPrompt = `你是一名资深职业规划师兼心理测评专家，具备深厚的心理学理论功底。

[测评理论基础]
1. RIASEC兴趣理论（霍兰德职业兴趣理论）：
   - R(Realistic)现实型：偏好实际操作、工具使用、机械技术，适合工程师、技术员等
   - I(Investigative)研究型：喜欢观察、学习、分析，适合科学家、研究员、分析师等
   - A(Artistic)艺术型：重视创造、表达、审美，适合艺术家、设计师、作家等
   - S(Social)社会型：关心他人、帮助他人，适合教师、医生、社工等
   - E(Enterprising)企业型：追求领导、影响、成就，适合管理者、销售、企业家等
   - C(Conventional)常规型：偏好有序、稳定、精确，适合会计、文员、行政等

2. Big Five人格理论：
   - O(开放性)：创新思维、好奇心、艺术欣赏能力
   - C(尽责性)：自律、组织性、目标导向、可靠性
   - E(外向性)：社交活跃度、活力、积极情感
   - A(宜人性)：信任、合作、同理心、利他主义
   - N(神经质)：情绪稳定性、压力应对、焦虑倾向

3. 职业价值观：
   - achievement(成就导向)：追求成功、挑战、个人成就
   - independence(独立性)：自主决策、独立工作、自由表达
   - recognition(认可度)：获得认可、地位、声望
   - relationships(人际关系)：团队合作、人际和谐、支持他人
   - support(支持度)：工作环境支持、同事关系、组织关怀
   - working_conditions(工作条件)：薪资、福利、工作环境、工作保障

4. 能力倾向分析：
   - NR(数理推理)：数学逻辑、数据分析、问题解决
   - VR(语言表达)：沟通表达、阅读理解、写作能力
   - SP(空间想象)：空间感知、图形理解、设计思维
   - LG(逻辑推理)：逻辑思维、推理判断、分析能力
   - ME(机械理解)：机械原理、技术理解、操作能力
   - AT(注意力细节)：专注力、细节观察、精确性
   - MM(记忆力)：记忆能力、信息存储、学习能力
   - CS(计算技能)：计算速度、数据处理、量化思维

[分数解释标准]
- 80%以上：高，表示该维度特征非常明显
- 60-79%：中等偏高，表示该维度特征较为明显
- 40-59%：中等，表示该维度特征一般
- 20-39%：中等偏低，表示该维度特征较弱
- 20%以下：低，表示该维度特征不明显

请以专业、温暖、易懂的语言，结合以上理论基础和分数含义，为用户生成精准的职业测评报告。报告需逻辑清晰、用语积极，避免标签化或负面描述。

在分析时，请综合考虑用户的基本信息（年龄、性别、当前职业）与测评结果，提供更精准和个性化的职业规划建议。考虑不同年龄段、性别和职业背景的差异，给出适合用户当前阶段的发展建议。`

      // 构建用户数据输入
      const userDataPrompt = this.buildUserDataPrompt(assessmentData, userInfo)

      // 构建分析目标
      const analysisPrompt = `[分析目标]
请综合分析以上数据，完成以下任务：
1. 总体性格与职业类型概述（给出一句简短总结标签，如"富有同理心的探索者"）。
2. 分别分析四个维度（兴趣 / 性格 / 价值观 / 能力），用简洁的小标题说明用户特点。
3. 推荐 3–5 个最匹配的职业，每个职业附 2–3 句解释其适配原因。
4. 给出发展建议（如何发挥优势、改善弱项、适合学习的方向）。
5. 最后以一句鼓励性结语收尾。

[输出格式]
请严格按照以下 JSON 格式返回：
{
  "summary": "一句话总体印象",
  "interest_analysis": "...",
  "personality_analysis": "...",
  "values_analysis": "...",
  "ability_analysis": "...",
  "career_recommendations": [
    { "title": "职业名称", "reason": "推荐理由" },
    { "title": "职业名称", "reason": "推荐理由" }
  ],
  "development_advice": "...",
  "closing_message": "..."
}`

      const fullPrompt = `${systemPrompt}\n\n[用户数据 User Inputs]\n${userDataPrompt}\n\n${analysisPrompt}`

      // 调用AI API
      const response = await this.callAIAPI(fullPrompt)
      
      // 解析JSON响应
      const reportData = this.parseAIResponse(response)
      
      return reportData
    } catch (error) {
      console.error('生成AI报告失败:', error)
      throw new Error('生成报告失败，请稍后重试')
    }
  }

  /**
   * 构建用户数据提示词
   */
  private buildUserDataPrompt(assessmentData: AssessmentData, userInfo?: { 
    name?: string; 
    occupation?: string; 
    ageRange?: string; 
    gender?: string; 
    basicInfo?: any 
  }): string {
    const { riasec, bigFive, careerValues, aptitude } = assessmentData

    // RIASEC维度映射
    const riasecMapping = {
      'R': 'Realistic',
      'I': 'Investigative', 
      'A': 'Artistic',
      'S': 'Social',
      'E': 'Enterprising',
      'C': 'Conventional'
    }

    // Big Five维度映射
    const bigFiveMapping = {
      'O': '开放性',
      'C': '尽责性',
      'E': '外向性',
      'A': '宜人性',
      'N': '神经质'
    }

    // 职业价值观映射
    const valuesMapping = {
      'achievement': '成就导向',
      'independence': '独立性',
      'recognition': '认可度',
      'relationships': '人际关系',
      'support': '支持度',
      'working_conditions': '工作条件'
    }

    // 能力倾向映射
    const aptitudeMapping = {
      'NR': '数理推理',
      'VR': '语言表达',
      'SP': '空间想象',
      'LG': '逻辑推理',
      'ME': '机械理解',
      'AT': '注意力细节',
      'MM': '记忆力',
      'CS': '计算技能'
    }

    let prompt = '以下是用户的测评结果：\n'

    // 用户基本信息（优先使用userInfo，其次使用basicInfo作为备选）
    if (userInfo?.name) {
      prompt += `- 用户姓名：${userInfo.name}\n`
    }
    
    // 性别信息
    const gender = userInfo?.gender || userInfo?.basicInfo?.gender
    if (gender) {
      prompt += `- 性别：${gender}\n`
    }
    
    // 年龄范围信息
    const ageRange = userInfo?.ageRange || userInfo?.basicInfo?.ageRange
    if (ageRange) {
      prompt += `- 年龄范围：${ageRange}\n`
    }
    
    // 职业信息
    const occupation = userInfo?.occupation || userInfo?.basicInfo?.occupation
    if (occupation) {
      prompt += `- 当前职业：${occupation}\n`
    }

    prompt += '\n'

    // RIASEC兴趣分析
    prompt += '[兴趣测评结果 - RIASEC理论]\n'
    const riasecEntries = Object.entries(riasec.scores)
      .sort(([,a], [,b]) => (b as number) - (a as number)) // 按分数降序排列
    riasecEntries.forEach(([key, value]) => {
      const score = value as number
      const level = score >= 80 ? '高' : score >= 60 ? '中等偏高' : score >= 40 ? '中等' : score >= 20 ? '中等偏低' : '低'
      const type = riasecMapping[key as keyof typeof riasecMapping]
      prompt += `  - ${type}：${score}%（${level}）\n`
    })
    prompt += '\n'

    // Big Five性格分析
    prompt += '[性格测评结果 - Big Five理论]\n'
    const bigFiveEntries = Object.entries(bigFive.scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
    bigFiveEntries.forEach(([key, value]) => {
      const score = value as number
      const level = score >= 80 ? '高' : score >= 60 ? '中等偏高' : score >= 40 ? '中等' : score >= 20 ? '中等偏低' : '低'
      const trait = bigFiveMapping[key as keyof typeof bigFiveMapping]
      prompt += `  - ${trait}：${score}%（${level}）\n`
    })
    prompt += '\n'

    // 职业价值观分析
    prompt += '[价值观测评结果 - 职业价值观理论]\n'
    const valuesEntries = Object.entries(careerValues.scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
    valuesEntries.forEach(([key, value]) => {
      const score = value as number
      const level = score >= 80 ? '高' : score >= 60 ? '中等偏高' : score >= 40 ? '中等' : score >= 20 ? '中等偏低' : '低'
      const valueName = valuesMapping[key as keyof typeof valuesMapping]
      prompt += `  - ${valueName}：${score}%（${level}）\n`
    })
    prompt += '\n'

    // 能力倾向分析
    prompt += '[能力测评结果 - 核心能力倾向]\n'
    const aptitudeEntries = Object.entries(aptitude.scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
    aptitudeEntries.forEach(([key, value]) => {
      const score = value as number
      const level = score >= 80 ? '高' : score >= 60 ? '中等偏高' : score >= 40 ? '中等' : score >= 20 ? '中等偏低' : '低'
      const ability = aptitudeMapping[key as keyof typeof aptitudeMapping]
      prompt += `  - ${ability}：${score}%（${level}）\n`
    })
    prompt += '\n'

    return prompt
  }

  /**
   * 调用AI API
   */
  private async callAIAPI(prompt: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const provider = process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER || 'deepseek'

    if (!apiKey) {
      throw new Error('AI API密钥未配置')
    }

    if (provider === 'deepseek') {
      return this.callDeepSeekAPI(prompt, apiKey)
    } else if (provider === 'openai') {
      return this.callOpenAIAPI(prompt, apiKey)
    } else {
      throw new Error('不支持的AI提供商')
    }
  }

  /**
   * 调用DeepSeek API
   */
  private async callDeepSeekAPI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-r1-0528',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API调用失败: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  }

  /**
   * 调用OpenAI API
   */
  private async callOpenAIAPI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API调用失败: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  }

  /**
   * 解析AI响应
   */
  private parseAIResponse(response: string): AIReportResponse {
    try {
      // 尝试直接解析JSON
      const cleanResponse = response.trim()
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        return JSON.parse(jsonStr)
      } else {
        throw new Error('无法找到JSON格式的响应')
      }
    } catch (error) {
      console.error('解析AI响应失败:', error)
      console.log('原始响应:', response)
      
      // 如果解析失败，返回默认报告
      return this.getDefaultReport()
    }
  }

  /**
   * 获取默认报告（当AI调用失败时）
   */
  private getDefaultReport(): AIReportResponse {
    return {
      summary: "充满潜力的探索者",
      interest_analysis: "您具有多样化的兴趣模式，在多个领域都表现出一定的兴趣。",
      personality_analysis: "您的性格特征显示出良好的平衡性，具备适应不同环境的能力。",
      values_analysis: "您的价值观体系反映了对工作和生活质量的重视。",
      ability_analysis: "您的能力配置显示出在多个方面的潜力。",
      career_recommendations: [
        {
          title: "综合型职业",
          reason: "基于您的多样化特征，建议考虑能够发挥多维度能力的综合型职业。"
        }
      ],
      development_advice: "建议继续探索自己的兴趣方向，并在擅长的领域深入发展。",
      closing_message: "相信通过持续的学习和探索，您一定能够找到最适合自己的职业道路！"
    }
  }
}

export const aiService = AIService.getInstance()
export type { AssessmentData, AIReportResponse }

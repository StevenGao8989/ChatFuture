/**
 * 用户数据管理服务
 * 负责处理用户数据的隔离和存储
 */

export class UserDataService {
  private static instance: UserDataService

  public static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService()
    }
    return UserDataService.instance
  }

  /**
   * 获取当前用户ID
   */
  getCurrentUserId(): string {
    // 尝试从Supabase获取当前用户
    try {
      const supabaseUser = JSON.parse(localStorage.getItem('sb-auth-token') || '{}')
      if (supabaseUser?.user?.id) {
        return supabaseUser.user.id
      }
    } catch (error) {
      console.log('无法解析Supabase用户数据:', error)
    }
    
    // 检查本地存储的用户信息
    try {
      const userSession = localStorage.getItem('user_session')
      if (userSession) {
        const userData = JSON.parse(userSession)
        if (userData.user?.id) {
          return userData.user.id
        }
        // 使用email作为ID
        if (userData.user?.email) {
          return userData.user.email
        }
      }
    } catch (error) {
      console.log('无法解析用户会话数据:', error)
    }
    
    // 如果没有用户信息，返回匿名ID
    return 'anonymous'
  }

  /**
   * 获取用户特定的存储键
   */
  getUserStorageKey(baseKey: string): string {
    const userId = this.getCurrentUserId()
    return `${baseKey}_${userId}`
  }

  /**
   * 保存用户数据
   */
  saveUserData(key: string, data: any): void {
    const storageKey = this.getUserStorageKey(key)
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('保存用户数据失败:', error)
    }
  }

  /**
   * 获取用户数据
   */
  getUserData(key: string): any | null {
    const storageKey = this.getUserStorageKey(key)
    try {
      const data = localStorage.getItem(storageKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('获取用户数据失败:', error)
      return null
    }
  }

  /**
   * 删除用户数据
   */
  deleteUserData(key: string): void {
    const storageKey = this.getUserStorageKey(key)
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('删除用户数据失败:', error)
    }
  }

  /**
   * 清除所有用户数据
   */
  clearAllUserData(): void {
    const userId = this.getCurrentUserId()
    const keysToRemove: string[] = []
    
    // 遍历localStorage，找到属于当前用户的所有键
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.endsWith(`_${userId}`)) {
        keysToRemove.push(key)
      }
    }
    
    // 删除所有用户相关的数据
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
  }

  /**
   * 检查用户是否有特定的数据
   */
  hasUserData(key: string): boolean {
    const storageKey = this.getUserStorageKey(key)
    return localStorage.getItem(storageKey) !== null
  }

  /**
   * 获取用户数据列表
   */
  getUserDataKeys(): string[] {
    const userId = this.getCurrentUserId()
    const userKeys: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.endsWith(`_${userId}`)) {
        // 移除用户ID后缀，返回原始键名
        const originalKey = key.replace(`_${userId}`, '')
        userKeys.push(originalKey)
      }
    }
    
    return userKeys
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUserInfo(): { id: string; email?: string; name?: string } | null {
    const userId = this.getCurrentUserId()
    
    if (userId === 'anonymous') {
      return null
    }

    // 尝试从Supabase获取用户信息
    try {
      const supabaseUser = JSON.parse(localStorage.getItem('sb-auth-token') || '{}')
      if (supabaseUser?.user?.id === userId) {
        return {
          id: userId,
          email: supabaseUser.user.email,
          name: supabaseUser.user.user_metadata?.name
        }
      }
    } catch (error) {
      console.log('无法解析Supabase用户数据:', error)
    }
    
    // 尝试从本地存储获取用户信息
    try {
      const userSession = localStorage.getItem('user_session')
      if (userSession) {
        const userData = JSON.parse(userSession)
        if (userData.user?.email) {
          return {
            id: userId,
            email: userData.user.email,
            name: userData.user.name
          }
        }
      }
    } catch (error) {
      console.log('无法解析用户会话数据:', error)
    }

    return {
      id: userId,
      email: undefined,
      name: undefined
    }
  }
}

// 导出单例实例
export const userDataService = UserDataService.getInstance()

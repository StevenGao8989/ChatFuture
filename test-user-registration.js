// 测试用户注册和数据库同步的脚本
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// 请替换为您的实际Supabase配置
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zzuasosaszrxzcrdkipo.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dWFzb3Nhc3pyeHpjcmRraXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODgwODcsImV4cCI6MjA3NTk2NDA4N30.9CeoUclpYZeJG7NW-O-Xe86N02LxhyjhT_Mcxi8ZA9c'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('请先设置正确的Supabase配置:')
  console.log('1. 在.env.local文件中设置NEXT_PUBLIC_SUPABASE_URL和NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('2. 或者直接在此脚本中替换YOUR_SUPABASE_URL和YOUR_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testUserRegistration() {
  console.log('🧪 测试用户注册和数据库同步...\n')
  
  const testEmail = `test_user_${Date.now()}@example.com`
  const testPassword = 'testpassword123'
  const testName = 'Test User'
  
  console.log(`📧 测试邮箱: ${testEmail}`)
  console.log(`👤 测试用户名: ${testName}`)
  
  try {
    // 1. 测试用户注册
    console.log('\n1️⃣ 执行用户注册...')
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName
        }
      }
    })
    
    if (error) {
      console.error('❌ 注册失败:', error.message)
      return false
    }
    
    console.log('✅ 注册成功!')
    console.log(`🆔 用户ID: ${data.user?.id}`)
    console.log(`📧 用户邮箱: ${data.user?.email}`)
    console.log(`👤 用户元数据:`, data.user?.user_metadata)
    
    // 2. 检查auth.users表
    console.log('\n2️⃣ 检查auth.users表...')
    const { data: authUser, error: authError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('id', data.user?.id)
      .single()
    
    if (authError) {
      console.log('⚠️ 无法直接查询auth.users表（这是正常的）')
    } else {
      console.log('✅ auth.users表数据:', authUser)
    }
    
    // 3. 检查user_profiles表
    console.log('\n3️⃣ 检查user_profiles表...')
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user?.id)
      .single()
    
    if (profileError) {
      console.error('❌ user_profiles表查询失败:', profileError.message)
      console.log('🔍 这可能表明触发器没有正常工作')
    } else {
      console.log('✅ user_profiles表数据:', profile)
    }
    
    // 4. 检查user_preferences表
    console.log('\n4️⃣ 检查user_preferences表...')
    const { data: preferences, error: prefError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', data.user?.id)
      .single()
    
    if (prefError) {
      console.error('❌ user_preferences表查询失败:', prefError.message)
    } else {
      console.log('✅ user_preferences表数据:', preferences)
    }
    
    // 5. 检查user_auth_history表
    console.log('\n5️⃣ 检查user_auth_history表...')
    const { data: history, error: histError } = await supabase
      .from('user_auth_history')
      .select('*')
      .eq('user_id', data.user?.id)
      .single()
    
    if (histError) {
      console.error('❌ user_auth_history表查询失败:', histError.message)
    } else {
      console.log('✅ user_auth_history表数据:', history)
    }
    
    // 6. 总结
    console.log('\n📊 测试总结:')
    const hasProfile = !profileError
    const hasPreferences = !prefError
    const hasHistory = !histError
    
    console.log(`- user_profiles: ${hasProfile ? '✅ 正常' : '❌ 异常'}`)
    console.log(`- user_preferences: ${hasPreferences ? '✅ 正常' : '❌ 异常'}`)
    console.log(`- user_auth_history: ${hasHistory ? '✅ 正常' : '❌ 异常'}`)
    
    if (!hasProfile || !hasPreferences || !hasHistory) {
      console.log('\n🔧 建议解决方案:')
      console.log('1. 运行fix-user-profiles-issue.sql脚本')
      console.log('2. 检查数据库触发器是否正确创建')
      console.log('3. 检查RLS策略是否阻止了数据插入')
      return false
    } else {
      console.log('\n🎉 所有测试通过！用户注册和数据库同步正常工作')
      return true
    }
    
  } catch (err) {
    console.error('❌ 测试过程中发生异常:', err.message)
    return false
  }
}

async function checkExistingUsers() {
  console.log('\n🔍 检查现有用户数据...')
  
  try {
    // 检查user_profiles表
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (profileError) {
      console.error('❌ 查询user_profiles失败:', profileError.message)
    } else {
      console.log(`📊 user_profiles表记录数: ${profiles.length}`)
      if (profiles.length > 0) {
        console.log('📋 现有用户资料:')
        profiles.forEach((profile, index) => {
          console.log(`  ${index + 1}. ${profile.name} (${profile.email}) - ${profile.created_at}`)
        })
      }
    }
    
    // 检查user_preferences表
    const { data: preferences, error: prefError } = await supabase
      .from('user_preferences')
      .select('*')
    
    if (prefError) {
      console.error('❌ 查询user_preferences失败:', prefError.message)
    } else {
      console.log(`📊 user_preferences表记录数: ${preferences.length}`)
    }
    
  } catch (err) {
    console.error('❌ 检查现有用户时发生异常:', err.message)
  }
}

async function main() {
  await checkExistingUsers()
  await testUserRegistration()
}

main().catch(console.error)

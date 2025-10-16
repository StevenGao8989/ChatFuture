// 测试Supabase连接
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zzuasosaszrxzcrdkipo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dWFzb3Nhc3pyeHpjcmRraXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODgwODcsImV4cCI6MjA3NTk2NDA4N30.9CeoUclpYZeJG7NW-O-Xe86N02LxhyjhT_Mcxi8ZA9c'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('测试Supabase连接...')
    
    // 测试基本连接
    const { data, error } = await supabase.from('question_banks').select('count').limit(1)
    
    if (error) {
      console.error('Supabase连接失败:', error)
    } else {
      console.log('✅ Supabase连接成功!')
      console.log('数据:', data)
    }
  } catch (err) {
    console.error('连接测试异常:', err)
  }
}

testConnection()

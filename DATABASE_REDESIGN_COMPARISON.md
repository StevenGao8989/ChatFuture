# ChatFuture 数据库架构重新设计 - 对比文档

## 🎯 设计目标

**统一流程**: Session → Assessment(题/答/分) → Result 聚合 → Card 画像 → 分享/查看
**数据隔离**: 接入 Supabase Auth + RLS，数据按 user_id 隔离
**分享功能**: 支持分享 Token，只读访问卡片
**可扩展性**: 支持职业推荐、埋点、批量统计、清理任务

## 📊 架构对比

### 旧架构 vs 新架构

| 方面 | 旧架构 | 新架构 | 改进 |
|------|--------|--------|------|
| **核心流程** | 分散的表结构 | Session为中心的流程 | ✅ 统一数据流 |
| **表数量** | 18个表 | 10个表 | ✅ 精简67% |
| **命名规范** | 不一致 | 统一规范 | ✅ 首字母大写表名 |
| **数据隔离** | 基础RLS | 完整RLS策略 | ✅ 按user_id隔离 |
| **分享功能** | 无 | ShareToken支持 | ✅ 只读访问 |
| **扩展性** | 有限 | 高度可扩展 | ✅ 支持埋点、推荐 |

## 🗂️ 表结构对比

### 核心业务表

#### 旧架构
```sql
-- 分散的表结构
user_profiles          -- 用户资料
assessment_sessions     -- 测评会话
assessment_answers      -- 测评答案
assessment_results      -- 测评结果
ai_reports             -- AI报告
system_configs         -- 系统配置
```

#### 新架构
```sql
-- 统一流程架构
"Session"              -- 测评会话（核心）
"Module"               -- 测评模块配置
"Question"             -- 问题库
"Answer"               -- 答案记录
"Result"               -- 测评结果
"Card"                 -- 卡片画像
"ShareToken"           -- 分享令牌
```

### 扩展功能表

#### 新架构新增
```sql
"Upload"               -- 文件上传
"ImageJob"             -- 图片生成任务
"EventLog"             -- 事件日志
"Recommendation"       -- 职业推荐
```

## 🔄 数据流程对比

### 旧架构流程
```
用户注册 → user_profiles
    ↓
开始测评 → assessment_sessions
    ↓
回答问题 → assessment_answers
    ↓
生成结果 → assessment_results
    ↓
AI分析 → ai_reports
```

### 新架构流程
```
用户注册 → auth.users (Supabase Auth)
    ↓
创建会话 → Session
    ↓
选择模块 → Module
    ↓
回答问题 → Question → Answer
    ↓
计算结果 → Result
    ↓
生成卡片 → Card
    ↓
分享功能 → ShareToken
```

## 🎨 命名规范对比

### 旧架构命名
```sql
-- 表名：小写复数
user_profiles
assessment_sessions
assessment_answers

-- 列名：snake_case
created_at
updated_at
user_id
```

### 新架构命名
```sql
-- 表名：首字母大写单数
"Session"
"Module" 
"Question"
"Answer"
"Result"
"Card"
"ShareToken"

-- 列名：snake_case
created_at
updated_at
user_id
session_id
```

## 🔐 安全策略对比

### 旧架构RLS
```sql
-- 基础策略
CREATE POLICY "Users can view own data" ON user_profiles 
    FOR SELECT USING (auth.uid() = user_id);
```

### 新架构RLS
```sql
-- 完整策略体系
-- Session表策略
CREATE POLICY "Users can view own sessions" ON "Session" 
    FOR SELECT USING (auth.uid() = user_id);

-- Answer表策略（通过Session关联）
CREATE POLICY "Users can view own answers" ON "Answer" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "Session" WHERE id = session_id AND user_id = auth.uid())
    );

-- Card表策略（支持公开访问）
CREATE POLICY "Anyone can view public cards" ON "Card" 
    FOR SELECT USING (is_public = true);
```

## 🚀 功能特性对比

### 旧架构功能
- ✅ 用户注册登录
- ✅ 基础测评功能
- ✅ 结果存储
- ❌ 分享功能
- ❌ 埋点统计
- ❌ 职业推荐
- ❌ 图片生成

### 新架构功能
- ✅ 用户注册登录
- ✅ 统一测评流程
- ✅ 结果聚合分析
- ✅ 卡片画像生成
- ✅ 分享Token功能
- ✅ 事件日志埋点
- ✅ 职业推荐系统
- ✅ 图片生成任务
- ✅ 文件上传管理
- ✅ 数据清理任务

## 📈 性能优化对比

### 旧架构索引
```sql
-- 基础索引
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
```

### 新架构索引
```sql
-- 优化索引体系
-- Session表索引
CREATE INDEX idx_session_user_id ON "Session"(user_id);
CREATE INDEX idx_session_status ON "Session"(status);
CREATE INDEX idx_session_user_status ON "Session"(user_id, status);

-- Answer表索引
CREATE INDEX idx_answer_session_id ON "Answer"(session_id);
CREATE INDEX idx_answer_session_module ON "Answer"(session_id, module);

-- ShareToken表索引
CREATE INDEX idx_share_token_token ON "ShareToken"(token);
CREATE INDEX idx_share_token_active ON "ShareToken"(is_active);
```

## 🔧 触发器对比

### 旧架构触发器
```sql
-- 基础触发器
CREATE TRIGGER update_updated_at_column() -- 更新时间戳
```

### 新架构触发器
```sql
-- 完整触发器体系
CREATE TRIGGER update_session_stats_trigger -- 会话状态更新
CREATE TRIGGER update_updated_at_column()   -- 更新时间戳
-- 支持会话状态自动计算、完成时间记录等
```

## 📊 统计功能对比

### 旧架构统计
```sql
-- 无统计视图
-- 需要手动查询
```

### 新架构统计
```sql
-- 内置统计视图
CREATE VIEW user_assessment_overview AS -- 用户测评概览
CREATE VIEW assessment_statistics AS    -- 测评统计

-- 辅助函数
CREATE FUNCTION get_user_assessment_status() -- 获取用户状态
CREATE FUNCTION cleanup_expired_data()       -- 清理过期数据
```

## 🎯 使用场景对比

### 旧架构使用场景
1. **用户注册** → 创建user_profiles
2. **开始测评** → 创建assessment_sessions
3. **回答问题** → 存储assessment_answers
4. **查看结果** → 查询assessment_results

### 新架构使用场景
1. **用户注册** → 使用Supabase Auth
2. **创建会话** → 创建Session记录
3. **选择模块** → 从Module表获取配置
4. **回答问题** → 存储Answer记录
5. **计算结果** → 生成Result记录
6. **生成卡片** → 创建Card记录
7. **分享功能** → 创建ShareToken
8. **统计分析** → 使用内置视图和函数

## 🚀 迁移优势

### 1. **统一流程**
- 以Session为中心的数据流
- 清晰的数据关系
- 易于理解和维护

### 2. **数据隔离**
- 完整的RLS策略
- 按user_id隔离
- 支持分享功能

### 3. **可扩展性**
- 支持埋点统计
- 支持职业推荐
- 支持图片生成
- 支持文件上传

### 4. **性能优化**
- 优化的索引策略
- 内置统计视图
- 自动清理功能

### 5. **开发效率**
- 统一的命名规范
- 完整的触发器
- 丰富的辅助函数

## 📋 迁移步骤

1. **备份现有数据**
2. **运行迁移脚本** (`migrate-to-redesigned-schema.sql`)
3. **导入问题数据** (`import-questions-data.sql`)
4. **测试核心功能**
5. **更新前端代码**
6. **测试分享功能**

## 🎉 总结

新架构完全满足设计目标：
- ✅ **统一流程**: Session → Assessment → Result → Card → Share
- ✅ **数据隔离**: Supabase Auth + RLS，按user_id隔离
- ✅ **分享功能**: ShareToken支持只读访问
- ✅ **可扩展性**: 支持职业推荐、埋点、统计等
- ✅ **命名规范**: 表名首字母大写，列名snake_case
- ✅ **性能优化**: 优化的索引和统计功能

新架构比旧架构更简洁、更强大、更易维护！

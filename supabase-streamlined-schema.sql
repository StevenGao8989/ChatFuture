-- =====================================================
-- ChatFuture AI职业规划平台 - 精简数据库架构
-- =====================================================
-- 设计目标: 专注核心功能，删除无用数据
-- 核心流程: UserProfile → AssessmentSession → AssessmentResult → CareerProfileCard → Share
-- =====================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 枚举类型定义
-- =====================================================

-- 测评模块类型
CREATE TYPE assessment_module AS ENUM (
    'basic_info',    -- 基本信息
    'riasec',        -- 职业兴趣
    'big_five',      -- 大五人格
    'career_values', -- 职业价值观
    'aptitude'       -- 能力倾向
);

-- 卡片样式类型
CREATE TYPE card_style AS ENUM (
    'professional',  -- 专业风格
    'creative',      -- 创意风格
    'minimalist',    -- 简约风格
    'colorful'       -- 彩色风格
);

-- 任务状态类型
CREATE TYPE job_status AS ENUM (
    'pending',       -- 等待中
    'processing',    -- 处理中
    'completed',     -- 已完成
    'failed'         -- 失败
);

-- =====================================================
-- 2. 核心业务表
-- =====================================================

-- 用户资料表 (UserProfile) - 精简版
CREATE TABLE "UserProfile" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    avatar_url TEXT,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    age_range VARCHAR(20) CHECK (age_range IN ('under-18', '18-25', '26-35', '36-45', '46-55', '55+')),
    location VARCHAR(100), -- 城市/地区
    bio TEXT, -- 个人简介
    current_occupation VARCHAR(100), -- 当前职业
    industry VARCHAR(100), -- 行业
    education_level VARCHAR(50), -- 教育水平
    skills TEXT[], -- 技能列表
    interests TEXT[], -- 兴趣列表
    career_goals TEXT, -- 职业目标
    preferred_work_style VARCHAR(100), -- 偏好工作方式
    is_profile_complete BOOLEAN DEFAULT false, -- 资料是否完整
    profile_completion_percentage INTEGER DEFAULT 0, -- 资料完成度
    last_active_at TIMESTAMPTZ,
    meta JSONB DEFAULT '{}', -- 其他元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 测评模块配置表 (AssessmentModule)
CREATE TABLE "AssessmentModule" (
    code assessment_module PRIMARY KEY,
    name_cn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description TEXT,
    total_questions INTEGER DEFAULT 0,
    estimated_duration_minutes INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    icon_name VARCHAR(50),
    color_theme VARCHAR(100),
    config JSONB DEFAULT '{}', -- 模块配置
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 问题表 (AssessmentQuestion)
CREATE TABLE "AssessmentQuestion" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module assessment_module REFERENCES "AssessmentModule"(code) ON DELETE CASCADE,
    item_code VARCHAR(100) NOT NULL, -- 问题唯一标识
    stem TEXT NOT NULL, -- 问题题干
    question_type VARCHAR(20) DEFAULT 'select' CHECK (question_type IN ('select', 'text', 'number', 'scale')),
    input_type VARCHAR(20) DEFAULT 'radio' CHECK (input_type IN ('radio', 'checkbox', 'text', 'number', 'scale')),
    options JSONB DEFAULT '[]', -- 选项数组
    weight DECIMAL(3,2) DEFAULT 1.0,
    display_order INTEGER DEFAULT 0,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[],
    meta JSONB DEFAULT '{}', -- 问题元数据
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module, item_code)
);

-- 测评会话表 (AssessmentSession)
CREATE TABLE "AssessmentSession" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    current_module assessment_module,
    completed_modules assessment_module[] DEFAULT '{}',
    total_questions INTEGER DEFAULT 0,
    answered_questions INTEGER DEFAULT 0,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    completion_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    ip_address INET,
    user_agent TEXT,
    meta JSONB DEFAULT '{}', -- 会话元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 答案表 (AssessmentAnswer)
CREATE TABLE "AssessmentAnswer" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    module assessment_module NOT NULL,
    item_code VARCHAR(100) NOT NULL,
    answer_value TEXT NOT NULL,
    answer_time TIMESTAMPTZ DEFAULT NOW(),
    time_spent_seconds INTEGER,
    meta JSONB DEFAULT '{}', -- 答案元数据
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 测评结果表 (AssessmentResult)
CREATE TABLE "AssessmentResult" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    module assessment_module NOT NULL,
    scores JSONB NOT NULL, -- 各维度得分 {"realistic": 85, "investigative": 72}
    dominant_type VARCHAR(50), -- 主导类型
    percentile_rank DECIMAL(5,2), -- 百分位排名
    interpretation TEXT, -- 结果解释
    strengths TEXT[], -- 优势列表
    weaknesses TEXT[], -- 劣势列表
    recommendations TEXT[], -- 建议列表
    meta JSONB DEFAULT '{}', -- 结果元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, module)
);

-- 职业推荐表 (CareerRecommendation)
CREATE TABLE "CareerRecommendation" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    module assessment_module NOT NULL,
    items JSONB NOT NULL, -- 推荐项目数组
    algorithm_version VARCHAR(20) DEFAULT '1.0',
    confidence_score DECIMAL(3,2), -- 置信度
    meta JSONB DEFAULT '{}', -- 推荐元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 职业画像卡片表 (CareerProfileCard)
CREATE TABLE "CareerProfileCard" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    style card_style DEFAULT 'professional',
    image_url TEXT, -- 生成的卡片图片URL
    thumbnail_url TEXT, -- 缩略图URL
    title VARCHAR(200),
    subtitle VARCHAR(200),
    content JSONB DEFAULT '{}', -- 卡片内容
    layout_config JSONB DEFAULT '{}', -- 布局配置
    is_public BOOLEAN DEFAULT false, -- 是否公开
    view_count INTEGER DEFAULT 0, -- 查看次数
    like_count INTEGER DEFAULT 0, -- 点赞次数
    meta JSONB DEFAULT '{}', -- 卡片元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id)
);

-- 分享令牌表 (ProfileShareToken)
CREATE TABLE "ProfileShareToken" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    token VARCHAR(100) UNIQUE NOT NULL, -- 分享令牌
    expires_at TIMESTAMPTZ, -- 过期时间
    max_views INTEGER, -- 最大查看次数
    current_views INTEGER DEFAULT 0, -- 当前查看次数
    is_active BOOLEAN DEFAULT true, -- 是否有效
    meta JSONB DEFAULT '{}', -- 分享元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. 扩展功能表
-- =====================================================

-- 文件上传表 (ProfileUpload)
CREATE TABLE "ProfileUpload" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    object_key VARCHAR(500) NOT NULL, -- 存储对象键
    file_name VARCHAR(200),
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_type VARCHAR(50) DEFAULT 'photo', -- 上传类型
    is_processed BOOLEAN DEFAULT false, -- 是否已处理
    meta JSONB DEFAULT '{}', -- 上传元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 图片生成任务表 (ProfileImageJob)
CREATE TABLE "ProfileImageJob" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    status job_status DEFAULT 'pending',
    photo_key VARCHAR(500), -- 用户照片键
    prompt TEXT, -- 生成提示词
    model VARCHAR(100), -- AI模型
    progress INTEGER DEFAULT 0, -- 进度百分比
    result_url TEXT, -- 结果图片URL
    error_message TEXT, -- 错误信息
    retry_count INTEGER DEFAULT 0, -- 重试次数
    processing_time_ms INTEGER, -- 处理时间
    meta JSONB DEFAULT '{}', -- 任务元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 事件日志表 (AssessmentEventLog)
CREATE TABLE "AssessmentEventLog" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES "AssessmentSession"(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 事件类型
    event_data JSONB DEFAULT '{}', -- 事件数据
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. 索引创建
-- =====================================================

-- UserProfile表索引
CREATE INDEX idx_user_profile_user_id ON "UserProfile"(user_id);
CREATE INDEX idx_user_profile_email ON "UserProfile"(email);
CREATE INDEX idx_user_profile_name ON "UserProfile"(name);
CREATE INDEX idx_user_profile_location ON "UserProfile"(location);
CREATE INDEX idx_user_profile_industry ON "UserProfile"(industry);
CREATE INDEX idx_user_profile_complete ON "UserProfile"(is_profile_complete);
CREATE INDEX idx_user_profile_last_active ON "UserProfile"(last_active_at);

-- AssessmentSession表索引
CREATE INDEX idx_assessment_session_user_id ON "AssessmentSession"(user_id);
CREATE INDEX idx_assessment_session_status ON "AssessmentSession"(status);
CREATE INDEX idx_assessment_session_created_at ON "AssessmentSession"(created_at);
CREATE INDEX idx_assessment_session_user_status ON "AssessmentSession"(user_id, status);

-- AssessmentAnswer表索引
CREATE INDEX idx_assessment_answer_session_id ON "AssessmentAnswer"(session_id);
CREATE INDEX idx_assessment_answer_module ON "AssessmentAnswer"(module);
CREATE INDEX idx_assessment_answer_session_module ON "AssessmentAnswer"(session_id, module);

-- AssessmentResult表索引
CREATE INDEX idx_assessment_result_session_id ON "AssessmentResult"(session_id);
CREATE INDEX idx_assessment_result_module ON "AssessmentResult"(module);
CREATE INDEX idx_assessment_result_session_module ON "AssessmentResult"(session_id, module);

-- CareerProfileCard表索引
CREATE INDEX idx_career_profile_card_session_id ON "CareerProfileCard"(session_id);
CREATE INDEX idx_career_profile_card_public ON "CareerProfileCard"(is_public);
CREATE INDEX idx_career_profile_card_created_at ON "CareerProfileCard"(created_at);

-- ProfileShareToken表索引
CREATE INDEX idx_profile_share_token_token ON "ProfileShareToken"(token);
CREATE INDEX idx_profile_share_token_session_id ON "ProfileShareToken"(session_id);
CREATE INDEX idx_profile_share_token_active ON "ProfileShareToken"(is_active);

-- AssessmentQuestion表索引
CREATE INDEX idx_assessment_question_module ON "AssessmentQuestion"(module);
CREATE INDEX idx_assessment_question_item_code ON "AssessmentQuestion"(item_code);
CREATE INDEX idx_assessment_question_active ON "AssessmentQuestion"(is_active);

-- 其他表索引
CREATE INDEX idx_career_recommendation_session_id ON "CareerRecommendation"(session_id);
CREATE INDEX idx_profile_upload_session_id ON "ProfileUpload"(session_id);
CREATE INDEX idx_profile_image_job_session_id ON "ProfileImageJob"(session_id);
CREATE INDEX idx_profile_image_job_status ON "ProfileImageJob"(status);
CREATE INDEX idx_assessment_event_log_session_id ON "AssessmentEventLog"(session_id);
CREATE INDEX idx_assessment_event_log_event_type ON "AssessmentEventLog"(event_type);

-- =====================================================
-- 5. 触发器函数
-- =====================================================

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间戳触发器
CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON "UserProfile" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_session_updated_at BEFORE UPDATE ON "AssessmentSession" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_module_updated_at BEFORE UPDATE ON "AssessmentModule" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_question_updated_at BEFORE UPDATE ON "AssessmentQuestion" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_result_updated_at BEFORE UPDATE ON "AssessmentResult" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_recommendation_updated_at BEFORE UPDATE ON "CareerRecommendation" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_profile_card_updated_at BEFORE UPDATE ON "CareerProfileCard" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_share_token_updated_at BEFORE UPDATE ON "ProfileShareToken" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_upload_updated_at BEFORE UPDATE ON "ProfileUpload" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_image_job_updated_at BEFORE UPDATE ON "ProfileImageJob" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 会话状态更新触发器函数
CREATE OR REPLACE FUNCTION update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- 如果会话状态变为completed，更新完成时间
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completion_time = NOW();
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NOW() - NEW.start_time)) / 60;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessment_session_stats_trigger 
    BEFORE UPDATE ON "AssessmentSession" 
    FOR EACH ROW EXECUTE FUNCTION update_session_stats();

-- 创建用户资料触发器函数
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- 创建用户资料
    INSERT INTO "UserProfile" (
        user_id, 
        email, 
        name,
        avatar_url
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'name', 
            NEW.email::text
        ),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- 记录错误但不阻止用户创建
        RAISE WARNING '创建用户资料时出错: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建用户资料触发器
CREATE TRIGGER create_user_profile_trigger 
    AFTER INSERT ON auth.users 
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- =====================================================
-- 6. 行级安全策略 (RLS)
-- =====================================================

-- 启用RLS
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentAnswer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CareerRecommendation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CareerProfileCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProfileShareToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProfileUpload" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProfileImageJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentEventLog" ENABLE ROW LEVEL SECURITY;

-- UserProfile表策略
CREATE POLICY "Users can view own profile" ON "UserProfile" 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON "UserProfile" 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON "UserProfile" 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can insert profiles" ON "UserProfile" 
    FOR INSERT WITH CHECK (true);

-- AssessmentSession表策略
CREATE POLICY "Users can view own assessment sessions" ON "AssessmentSession" 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own assessment sessions" ON "AssessmentSession" 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessment sessions" ON "AssessmentSession" 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AssessmentAnswer表策略
CREATE POLICY "Users can view own assessment answers" ON "AssessmentAnswer" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can insert own assessment answers" ON "AssessmentAnswer" 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );

-- AssessmentResult表策略
CREATE POLICY "Users can view own assessment results" ON "AssessmentResult" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );

-- CareerProfileCard表策略
CREATE POLICY "Users can view own career profile cards" ON "CareerProfileCard" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can update own career profile cards" ON "CareerProfileCard" 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );
CREATE POLICY "Anyone can view public career profile cards" ON "CareerProfileCard" 
    FOR SELECT USING (is_public = true);

-- ProfileShareToken表策略
CREATE POLICY "Users can view own profile share tokens" ON "ProfileShareToken" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can create own profile share tokens" ON "ProfileShareToken" 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );

-- 其他表策略
CREATE POLICY "Users can view own career recommendations" ON "CareerRecommendation" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can view own profile uploads" ON "ProfileUpload" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can view own profile image jobs" ON "ProfileImageJob" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can view own assessment event logs" ON "AssessmentEventLog" 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "AssessmentSession" WHERE id = session_id AND user_id = auth.uid())
    );

-- 公共表策略（AssessmentModule, AssessmentQuestion）
CREATE POLICY "Anyone can read assessment modules" ON "AssessmentModule" 
    FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read assessment questions" ON "AssessmentQuestion" 
    FOR SELECT USING (is_active = true);

-- =====================================================
-- 7. 初始化数据
-- =====================================================

-- 插入测评模块
INSERT INTO "AssessmentModule" (code, name_cn, name_en, description, total_questions, estimated_duration_minutes, display_order, icon_name, color_theme) VALUES
('basic_info', '基本信息收集', 'Basic Information', '收集用户的基本信息，用于个性化分析和建议', 3, 2, 1, 'User', 'from-gray-500 to-slate-600'),
('riasec', '职业兴趣测评', 'RIASEC Career Interest', '基于霍兰德职业兴趣理论的六边形模型，评估你的职业兴趣倾向', 60, 15, 2, 'Heart', 'from-red-500 to-pink-600'),
('big_five', '人格特质测评', 'Big Five Personality', '基于大五人格理论的五维度人格评估，了解你的性格特质', 50, 12, 3, 'Brain', 'from-blue-500 to-indigo-600'),
('career_values', '职业价值观测评', 'Career Values', '评估你在工作中的价值观和动机，找到真正适合的工作', 40, 10, 4, 'Target', 'from-green-500 to-emerald-600'),
('aptitude', '能力倾向测评', 'Aptitude Assessment', '评估你在不同领域的能力倾向，发现你的天赋所在', 45, 12, 5, 'Zap', 'from-purple-500 to-violet-600')
ON CONFLICT (code) DO UPDATE SET
    name_cn = EXCLUDED.name_cn,
    name_en = EXCLUDED.name_en,
    description = EXCLUDED.description,
    total_questions = EXCLUDED.total_questions,
    estimated_duration_minutes = EXCLUDED.estimated_duration_minutes,
    display_order = EXCLUDED.display_order,
    icon_name = EXCLUDED.icon_name,
    color_theme = EXCLUDED.color_theme,
    updated_at = NOW();

-- =====================================================
-- 8. 辅助函数
-- =====================================================

-- 获取用户完整测评状态的函数
CREATE OR REPLACE FUNCTION get_user_assessment_status(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    session_count INTEGER;
    completed_count INTEGER;
    latest_session RECORD;
    user_profile RECORD;
    has_results BOOLEAN := false;
    has_card BOOLEAN := false;
BEGIN
    -- 统计用户的测评会话
    SELECT COUNT(*) INTO session_count FROM "AssessmentSession" WHERE user_id = user_uuid;
    
    -- 统计已完成的会话
    SELECT COUNT(*) INTO completed_count FROM "AssessmentSession" WHERE user_id = user_uuid AND status = 'completed';
    
    -- 获取最新的会话信息
    SELECT * INTO latest_session FROM "AssessmentSession" 
    WHERE user_id = user_uuid 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- 获取用户资料信息
    SELECT * INTO user_profile FROM "UserProfile" WHERE user_id = user_uuid;
    
    -- 检查是否有测评结果
    SELECT EXISTS(SELECT 1 FROM "AssessmentResult" r JOIN "AssessmentSession" s ON r.session_id = s.id WHERE s.user_id = user_uuid) INTO has_results;
    
    -- 检查是否有卡片
    SELECT EXISTS(SELECT 1 FROM "CareerProfileCard" c JOIN "AssessmentSession" s ON c.session_id = s.id WHERE s.user_id = user_uuid) INTO has_card;
    
    -- 构建结果
    result := jsonb_build_object(
        'total_sessions', session_count,
        'completed_sessions', completed_count,
        'has_results', has_results,
        'has_card', has_card,
        'user_profile', CASE 
            WHEN user_profile.id IS NOT NULL THEN 
                jsonb_build_object(
                    'id', user_profile.id,
                    'name', user_profile.name,
                    'email', user_profile.email,
                    'avatar_url', user_profile.avatar_url,
                    'is_profile_complete', user_profile.is_profile_complete,
                    'profile_completion_percentage', user_profile.profile_completion_percentage,
                    'last_active_at', user_profile.last_active_at
                )
            ELSE NULL 
        END,
        'latest_session', CASE 
            WHEN latest_session.id IS NOT NULL THEN 
                jsonb_build_object(
                    'id', latest_session.id,
                    'status', latest_session.status,
                    'created_at', latest_session.created_at,
                    'completion_time', latest_session.completion_time
                )
            ELSE NULL 
        END,
        'has_completed_assessment', completed_count > 0
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 清理过期数据的函数
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS JSONB AS $$
DECLARE
    expired_sessions INTEGER := 0;
    expired_share_tokens INTEGER := 0;
    expired_event_logs INTEGER := 0;
    result JSONB;
BEGIN
    -- 清理过期的未完成会话（超过24小时）
    DELETE FROM "AssessmentSession" 
    WHERE status IN ('active', 'abandoned') 
    AND created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS expired_sessions = ROW_COUNT;
    
    -- 清理过期的分享令牌
    DELETE FROM "ProfileShareToken" 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS expired_share_tokens = ROW_COUNT;
    
    -- 清理过期的事件日志（超过30天）
    DELETE FROM "AssessmentEventLog" 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS expired_event_logs = ROW_COUNT;
    
    -- 构建清理结果
    result := jsonb_build_object(
        'expired_sessions_deleted', expired_sessions,
        'expired_share_tokens_deleted', expired_share_tokens,
        'expired_event_logs_deleted', expired_event_logs,
        'cleanup_time', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. 视图创建
-- =====================================================

-- 用户测评概览视图
CREATE VIEW user_assessment_overview AS
SELECT 
    s.user_id,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT CASE WHEN s.status = 'completed' THEN s.id END) as completed_sessions,
    MAX(s.completion_time) as last_completion_time,
    MAX(s.created_at) as last_session_time,
    COUNT(DISTINCT r.session_id) > 0 as has_results,
    COUNT(DISTINCT c.session_id) > 0 as has_card
FROM "AssessmentSession" s
LEFT JOIN "AssessmentResult" r ON r.session_id = s.id
LEFT JOIN "CareerProfileCard" c ON c.session_id = s.id
GROUP BY s.user_id;

-- 测评统计视图
CREATE VIEW assessment_statistics AS
SELECT 
    m.code as module_code,
    m.name_cn,
    COUNT(DISTINCT s.user_id) as total_users,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT CASE WHEN s.status = 'completed' THEN s.id END) as completed_sessions,
    AVG(CASE WHEN s.duration_minutes IS NOT NULL THEN s.duration_minutes END) as avg_duration_minutes
FROM "AssessmentModule" m
LEFT JOIN "AssessmentSession" s ON m.code = ANY(s.completed_modules)
GROUP BY m.code, m.name_cn;

-- =====================================================
-- 数据库架构创建完成
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'ChatFuture 精简数据库架构创建完成！';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '核心流程支持:';
    RAISE NOTICE 'UserProfile → AssessmentSession → AssessmentResult → CareerProfileCard → Share';
    RAISE NOTICE '';
    RAISE NOTICE '已创建的表:';
    RAISE NOTICE '- 用户管理: UserProfile (精简版)';
    RAISE NOTICE '- 核心业务: AssessmentSession, AssessmentModule, AssessmentQuestion, AssessmentAnswer, AssessmentResult, CareerProfileCard';
    RAISE NOTICE '- 分享功能: ProfileShareToken';
    RAISE NOTICE '- 扩展功能: ProfileUpload, ProfileImageJob, AssessmentEventLog, CareerRecommendation';
    RAISE NOTICE '';
    RAISE NOTICE 'UserProfile精简内容:';
    RAISE NOTICE '- 基础信息: name, email, avatar_url, gender, age_range, location, bio';
    RAISE NOTICE '- 职业信息: current_occupation, industry, education_level';
    RAISE NOTICE '- 技能兴趣: skills, interests, career_goals, preferred_work_style';
    RAISE NOTICE '- 状态跟踪: is_profile_complete, profile_completion_percentage, last_active_at';
    RAISE NOTICE '';
    RAISE NOTICE '已删除的无用字段:';
    RAISE NOTICE '- work_experience_years (工作年限)';
    RAISE NOTICE '- company_size (公司规模)';
    RAISE NOTICE '- salary_range (薪资范围)';
    RAISE NOTICE '- career_stage (职业阶段)';
    RAISE NOTICE '- languages (语言能力)';
    RAISE NOTICE '- certifications (认证证书)';
    RAISE NOTICE '- social_links (社交媒体链接)';
    RAISE NOTICE '- privacy_settings (隐私设置)';
    RAISE NOTICE '- notification_settings (通知设置)';
    RAISE NOTICE '- preferences (用户偏好)';
    RAISE NOTICE '';
    RAISE NOTICE '已创建的功能:';
    RAISE NOTICE '- 行级安全策略 (RLS)';
    RAISE NOTICE '- 自动更新时间戳触发器';
    RAISE NOTICE '- 会话状态更新触发器';
    RAISE NOTICE '- 用户资料自动创建触发器';
    RAISE NOTICE '- 辅助函数: get_user_assessment_status, cleanup_expired_data';
    RAISE NOTICE '- 统计视图: user_assessment_overview, assessment_statistics';
    RAISE NOTICE '';
    RAISE NOTICE '设计特点:';
    RAISE NOTICE '- 精简实用: 只保留核心必要字段';
    RAISE NOTICE '- 数据隔离: 按user_id隔离，支持RLS';
    RAISE NOTICE '- 分享功能: ProfileShareToken支持只读访问';
    RAISE NOTICE '- 可扩展: 支持职业推荐、埋点、统计等';
    RAISE NOTICE '- 命名规范: 表名首字母大写，列名snake_case';
    RAISE NOTICE '';
    RAISE NOTICE '下一步:';
    RAISE NOTICE '1. 导入问题数据到AssessmentQuestion表';
    RAISE NOTICE '2. 测试UserProfile创建和更新';
    RAISE NOTICE '3. 测试AssessmentSession创建和AssessmentAnswer提交';
    RAISE NOTICE '4. 测试AssessmentResult计算和CareerProfileCard生成';
    RAISE NOTICE '5. 测试ProfileShareToken分享功能';
    RAISE NOTICE '=========================================';
END $$;

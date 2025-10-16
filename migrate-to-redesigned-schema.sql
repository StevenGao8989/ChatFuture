-- =====================================================
-- ChatFuture 数据库迁移脚本 - 从旧架构到新架构
-- =====================================================
-- 迁移目标: 旧架构 → 新架构 (Session → Assessment → Result → Card → Share)
-- =====================================================

-- 1. 备份现有数据（可选）
-- =====================================================

-- 创建备份表（如果需要保留数据）
-- CREATE TABLE user_profiles_backup AS SELECT * FROM user_profiles;
-- CREATE TABLE assessment_sessions_backup AS SELECT * FROM assessment_sessions;
-- CREATE TABLE assessment_answers_backup AS SELECT * FROM assessment_answers;
-- CREATE TABLE assessment_results_backup AS SELECT * FROM assessment_results;

-- 2. 删除旧表和相关对象
-- =====================================================

-- 删除旧触发器
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS update_session_stats_trigger ON assessment_sessions;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_assessment_sessions_updated_at ON assessment_sessions;
DROP TRIGGER IF EXISTS update_assessment_answers_updated_at ON assessment_answers;
DROP TRIGGER IF EXISTS update_assessment_results_updated_at ON assessment_results;
DROP TRIGGER IF EXISTS update_ai_reports_updated_at ON ai_reports;
DROP TRIGGER IF EXISTS update_system_configs_updated_at ON system_configs;

-- 删除旧函数
DROP FUNCTION IF EXISTS create_user_profile();
DROP FUNCTION IF EXISTS update_session_stats();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 删除旧视图
DROP VIEW IF EXISTS user_assessment_overview;
DROP VIEW IF EXISTS assessment_statistics;

-- 删除旧表（按依赖关系顺序）
DROP TABLE IF EXISTS ai_reports CASCADE;
DROP TABLE IF EXISTS assessment_results CASCADE;
DROP TABLE IF EXISTS assessment_answers CASCADE;
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS system_configs CASCADE;

-- 3. 创建新架构
-- =====================================================

-- 运行新架构创建脚本
\i supabase-redesigned-schema.sql

-- 4. 数据迁移（如果有现有数据）
-- =====================================================

-- 迁移用户数据到新架构
-- 注意：新架构不需要user_profiles表，用户信息直接从auth.users获取

-- 迁移会话数据
INSERT INTO "Session" (
    id, user_id, status, current_module, completed_modules,
    total_questions, answered_questions, start_time, completion_time,
    duration_minutes, ip_address, user_agent, meta, created_at, updated_at
)
SELECT 
    id, user_id, status, 
    current_questionnaire_type::assessment_module,
    completed_types::assessment_module[],
    total_questions, answered_questions, start_time, completion_time,
    duration_minutes, ip_address, user_agent, '{}'::jsonb, created_at, updated_at
FROM assessment_sessions_backup
WHERE EXISTS (SELECT 1 FROM assessment_sessions_backup);

-- 迁移答案数据
INSERT INTO "Answer" (
    session_id, module, item_code, answer_value, answer_time,
    time_spent_seconds, meta, created_at
)
SELECT 
    session_id, questionnaire_type::assessment_module, question_key, answer_value,
    answer_time, time_spent_seconds, '{}'::jsonb, created_at
FROM assessment_answers_backup
WHERE EXISTS (SELECT 1 FROM assessment_answers_backup);

-- 迁移结果数据
INSERT INTO "Result" (
    session_id, module, scores, dominant_type, percentile_rank,
    interpretation, strengths, weaknesses, recommendations, meta, created_at, updated_at
)
SELECT 
    session_id, result_type::assessment_module, scores, dominant_type, percentile_rank,
    interpretation, strengths, weaknesses, recommendations, '{}'::jsonb, created_at, updated_at
FROM assessment_results_backup
WHERE EXISTS (SELECT 1 FROM assessment_results_backup);

-- 5. 验证迁移结果
-- =====================================================

DO $$
DECLARE
    session_count INTEGER;
    answer_count INTEGER;
    result_count INTEGER;
BEGIN
    -- 统计迁移的数据
    SELECT COUNT(*) INTO session_count FROM "Session";
    SELECT COUNT(*) INTO answer_count FROM "Answer";
    SELECT COUNT(*) INTO result_count FROM "Result";
    
    RAISE NOTICE '=========================================';
    RAISE NOTICE '数据迁移完成统计:';
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'Session表记录数: %', session_count;
    RAISE NOTICE 'Answer表记录数: %', answer_count;
    RAISE NOTICE 'Result表记录数: %', result_count;
    RAISE NOTICE '=========================================';
END $$;

-- 6. 清理备份表（可选）
-- =====================================================

-- 如果确认迁移成功，可以删除备份表
-- DROP TABLE IF EXISTS user_profiles_backup;
-- DROP TABLE IF EXISTS assessment_sessions_backup;
-- DROP TABLE IF EXISTS assessment_answers_backup;
-- DROP TABLE IF EXISTS assessment_results_backup;

-- 7. 完成提示
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'ChatFuture 数据库迁移完成！';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '迁移内容:';
    RAISE NOTICE '- 删除了旧架构的所有表和对象';
    RAISE NOTICE '- 创建了新的统一流程架构';
    RAISE NOTICE '- 迁移了现有数据（如果有）';
    RAISE NOTICE '- 配置了RLS策略和触发器';
    RAISE NOTICE '';
    RAISE NOTICE '新架构特点:';
    RAISE NOTICE '- Session → Assessment → Result → Card → Share';
    RAISE NOTICE '- 支持数据隔离和分享功能';
    RAISE NOTICE '- 可扩展的职业推荐和埋点功能';
    RAISE NOTICE '- 统一的命名规范和数据结构';
    RAISE NOTICE '';
    RAISE NOTICE '下一步:';
    RAISE NOTICE '1. 导入问题数据到Question表';
    RAISE NOTICE '2. 测试新架构的功能';
    RAISE NOTICE '3. 更新前端代码以适配新架构';
    RAISE NOTICE '4. 测试分享功能';
    RAISE NOTICE '=========================================';
END $$;

-- =====================================================
-- ChatFuture 问题数据导入脚本
-- =====================================================
-- 将前端问题数据导入到Question表
-- =====================================================

-- 1. 导入基本信息问题
-- =====================================================

INSERT INTO "Question" (module, item_code, stem, question_type, input_type, options, display_order, category, is_active) VALUES
('basic_info', 'gender', '您的性别是？', 'select', 'radio', '[
    {"key": "male", "text": "男", "value": "male"},
    {"key": "female", "text": "女", "value": "female"},
    {"key": "other", "text": "其他", "value": "other"},
    {"key": "prefer_not_to_say", "text": "不愿透露", "value": "prefer_not_to_say"}
]'::jsonb, 1, '基本信息', true),

('basic_info', 'age_range', '您的年龄范围是？', 'select', 'radio', '[
    {"key": "under-18", "text": "18岁以下", "value": "under-18"},
    {"key": "18-25", "text": "18-25岁", "value": "18-25"},
    {"key": "26-35", "text": "26-35岁", "value": "26-35"},
    {"key": "36-45", "text": "36-45岁", "value": "36-45"},
    {"key": "46-55", "text": "46-55岁", "value": "46-55"},
    {"key": "55+", "text": "55岁以上", "value": "55+"}
]'::jsonb, 2, '基本信息', true),

('basic_info', 'occupation', '您目前的职业是？', 'text', 'text', '[]'::jsonb, 3, '基本信息', true)
ON CONFLICT (module, item_code) DO UPDATE SET
    stem = EXCLUDED.stem,
    question_type = EXCLUDED.question_type,
    input_type = EXCLUDED.input_type,
    options = EXCLUDED.options,
    display_order = EXCLUDED.display_order,
    category = EXCLUDED.category,
    updated_at = NOW();

-- 2. 导入RIASEC职业兴趣问题（示例）
-- =====================================================

INSERT INTO "Question" (module, item_code, stem, question_type, input_type, options, display_order, category, is_active) VALUES
('riasec', 'r1', '我喜欢修理机械设备和工具', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 1, '现实型', true),

('riasec', 'r2', '我喜欢使用工具和机器工作', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 2, '现实型', true),

('riasec', 'i1', '我喜欢研究科学问题', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 3, '研究型', true),

('riasec', 'i2', '我喜欢分析和解决复杂问题', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 4, '研究型', true),

('riasec', 'a1', '我喜欢创作艺术作品', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 5, '艺术型', true),

('riasec', 'a2', '我喜欢表达自己的想法和情感', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 6, '艺术型', true),

('riasec', 's1', '我喜欢帮助他人解决问题', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 7, '社会型', true),

('riasec', 's2', '我喜欢与他人合作完成项目', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 8, '社会型', true),

('riasec', 'e1', '我喜欢领导和管理团队', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 9, '企业型', true),

('riasec', 'e2', '我喜欢制定计划和目标', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 10, '企业型', true),

('riasec', 'c1', '我喜欢按照既定程序工作', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 11, '常规型', true),

('riasec', 'c2', '我喜欢整理和组织信息', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 12, '常规型', true)
ON CONFLICT (module, item_code) DO UPDATE SET
    stem = EXCLUDED.stem,
    question_type = EXCLUDED.question_type,
    input_type = EXCLUDED.input_type,
    options = EXCLUDED.options,
    display_order = EXCLUDED.display_order,
    category = EXCLUDED.category,
    updated_at = NOW();

-- 3. 导入大五人格问题（示例）
-- =====================================================

INSERT INTO "Question" (module, item_code, stem, question_type, input_type, options, display_order, category, is_active) VALUES
('big_five', 'o1', '我喜欢尝试新的体验和活动', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 1, '开放性', true),

('big_five', 'o2', '我喜欢思考抽象概念', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 2, '开放性', true),

('big_five', 'c1', '我总是按时完成任务', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 3, '尽责性', true),

('big_five', 'c2', '我喜欢制定详细的计划', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 4, '尽责性', true),

('big_five', 'e1', '我在社交场合中很活跃', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 5, '外向性', true),

('big_five', 'e2', '我喜欢成为关注的焦点', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 6, '外向性', true),

('big_five', 'a1', '我信任他人的善意', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 7, '宜人性', true),

('big_five', 'a2', '我经常帮助他人', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 8, '宜人性', true),

('big_five', 'n1', '我经常感到焦虑', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 9, '神经质', true),

('big_five', 'n2', '我容易感到压力', 'select', 'radio', '[
    {"key": "strongly_disagree", "text": "非常不同意", "value": "1"},
    {"key": "disagree", "text": "不同意", "value": "2"},
    {"key": "neutral", "text": "中性", "value": "3"},
    {"key": "agree", "text": "同意", "value": "4"},
    {"key": "strongly_agree", "text": "非常同意", "value": "5"}
]'::jsonb, 10, '神经质', true)
ON CONFLICT (module, item_code) DO UPDATE SET
    stem = EXCLUDED.stem,
    question_type = EXCLUDED.question_type,
    input_type = EXCLUDED.input_type,
    options = EXCLUDED.options,
    display_order = EXCLUDED.display_order,
    category = EXCLUDED.category,
    updated_at = NOW();

-- 4. 更新Module表的问题数量
-- =====================================================

UPDATE "Module" SET 
    total_questions = (
        SELECT COUNT(*) FROM "Question" WHERE module = "Module".code AND is_active = true
    ),
    updated_at = NOW();

-- 5. 验证导入结果
-- =====================================================

DO $$
DECLARE
    basic_info_count INTEGER;
    riasec_count INTEGER;
    big_five_count INTEGER;
    total_count INTEGER;
BEGIN
    -- 统计各模块的问题数量
    SELECT COUNT(*) INTO basic_info_count FROM "Question" WHERE module = 'basic_info' AND is_active = true;
    SELECT COUNT(*) INTO riasec_count FROM "Question" WHERE module = 'riasec' AND is_active = true;
    SELECT COUNT(*) INTO big_five_count FROM "Question" WHERE module = 'big_five' AND is_active = true;
    SELECT COUNT(*) INTO total_count FROM "Question" WHERE is_active = true;
    
    RAISE NOTICE '=========================================';
    RAISE NOTICE '问题数据导入完成统计:';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '基本信息问题数: %', basic_info_count;
    RAISE NOTICE 'RIASEC问题数: %', riasec_count;
    RAISE NOTICE '大五人格问题数: %', big_five_count;
    RAISE NOTICE '总问题数: %', total_count;
    RAISE NOTICE '=========================================';
END $$;

-- 6. 完成提示
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=========================================';
    RAISE NOTICE '问题数据导入完成！';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '已导入的问题类型:';
    RAISE NOTICE '- 基本信息收集 (3题)';
    RAISE NOTICE '- RIASEC职业兴趣 (12题示例)';
    RAISE NOTICE '- 大五人格特质 (10题示例)';
    RAISE NOTICE '';
    RAISE NOTICE '下一步:';
    RAISE NOTICE '1. 根据需要添加更多问题';
    RAISE NOTICE '2. 测试问题查询功能';
    RAISE NOTICE '3. 测试答案提交功能';
    RAISE NOTICE '4. 测试结果计算功能';
    RAISE NOTICE '=========================================';
END $$;

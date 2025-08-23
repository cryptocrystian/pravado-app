-- Seed Demo Data for PRAVADO Platform
-- Migration: 003_seed_demo_data.sql
-- Purpose: Demo organization, user, wallet credits, sample content and PR

BEGIN;

-- ===== DEMO ORGANIZATION =====

-- Insert demo tenant (if not exists)
INSERT INTO tenants (id, name, branding, subscription_tier, settings)
VALUES (
    '00000000-0000-4000-8000-000000000001'::UUID,
    'PRAVADO Demo Corp',
    '{
        "logo_url": "https://pravado.com/logo.png",
        "primary_color": "#2B3A67",
        "secondary_color": "#00A8A8"
    }'::JSONB,
    'pro',
    '{
        "pr_enabled": true,
        "citemind_enabled": true,
        "visibility_tracking": true,
        "ai_operations_limit": 1000,
        "pr_credits_monthly": 5
    }'::JSONB
) ON CONFLICT (id) DO NOTHING;

-- ===== DEMO USER =====

-- Insert demo user profile
INSERT INTO user_profiles (id, email, full_name, tenant_id, role, tier, onboarding_completed)
VALUES (
    '00000000-0000-4000-8000-000000000002'::UUID,
    'demo@pravado.com',
    'Demo User',
    '00000000-0000-4000-8000-000000000001'::UUID,
    'admin',
    'pro',
    true
) ON CONFLICT (id) DO NOTHING;

-- ===== WALLET SETUP =====

-- Create main wallet for demo tenant
INSERT INTO wallets (id, tenant_id, wallet_type, press_release_credits, ai_operations_credits, premium_credits)
VALUES (
    '00000000-0000-4000-8000-000000000003'::UUID,
    '00000000-0000-4000-8000-000000000001'::UUID,
    'main',
    15, -- 15 PR credits
    500, -- 500 AI operation credits
    5 -- 5 premium credits
) ON CONFLICT (tenant_id, wallet_type) DO NOTHING;

-- Add initial wallet transaction (credit issuance)
INSERT INTO wallet_transactions (
    wallet_id, tenant_id, user_id, transaction_type, credit_type, 
    amount, balance_before, balance_after, reference_type, description
)
VALUES 
    (
        '00000000-0000-4000-8000-000000000003'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        '00000000-0000-4000-8000-000000000002'::UUID,
        'credit',
        'press_release_credits',
        15,
        0,
        15,
        'subscription',
        'Initial pro tier credit allocation'
    ),
    (
        '00000000-0000-4000-8000-000000000003'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        '00000000-0000-4000-8000-000000000002'::UUID,
        'credit',
        'ai_operations_credits',
        500,
        0,
        500,
        'subscription',
        'Initial AI operations credit allocation'
    ),
    (
        '00000000-0000-4000-8000-000000000003'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        '00000000-0000-4000-8000-000000000002'::UUID,
        'credit',
        'premium_credits',
        5,
        0,
        5,
        'subscription',
        'Initial premium feature credit allocation'
    );

-- ===== SAMPLE CONTENT =====

-- Create sample campaign
INSERT INTO campaigns (id, tenant_id, name, description, goals, start_date, end_date, status)
VALUES (
    '00000000-0000-4000-8000-000000000010'::UUID,
    '00000000-0000-4000-8000-000000000001'::UUID,
    'Q4 Product Launch Campaign',
    'Marketing campaign for new AI-powered marketing intelligence platform launch',
    ARRAY['Brand awareness', 'Lead generation', 'Media coverage'],
    '2025-10-01'::DATE,
    '2025-12-31'::DATE,
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Create sample content piece
INSERT INTO content_pieces (
    id, tenant_id, campaign_id, title, content_body, content_type, 
    status, seo_score, engagement_rate, published_at
)
VALUES (
    '00000000-0000-4000-8000-000000000011'::UUID,
    '00000000-0000-4000-8000-000000000001'::UUID,
    '00000000-0000-4000-8000-000000000010'::UUID,
    'The Future of AI-Powered Marketing Intelligence',
    'As businesses navigate an increasingly complex digital landscape, the need for sophisticated marketing intelligence has never been greater. Traditional marketing approaches are giving way to AI-powered platforms that can analyze, predict, and optimize across multiple channels simultaneously.

    PRAVADO represents the next generation of marketing intelligence, combining advanced AI with intuitive workflows to deliver unprecedented visibility into campaign performance. Our platform tracks citations across AI search engines, optimizes content for generative search results, and provides real-time insights that drive measurable results.

    Key benefits include:
    - Cross-platform citation tracking across ChatGPT, Claude, Perplexity, and Gemini
    - Automated press release distribution with media relationship management
    - Visibility scoring that aggregates performance across PR, SEO, content, and social channels
    - AI-powered content optimization and personalization

    The marketing landscape is evolving rapidly, and businesses that embrace AI-powered intelligence tools will have a significant competitive advantage in capturing and maintaining market share.',
    'blog_post',
    'published',
    85,
    4.7,
    '2025-08-20 10:00:00'::TIMESTAMP WITH TIME ZONE
) ON CONFLICT (id) DO NOTHING;

-- ===== SAMPLE PRESS RELEASE =====

-- Create sample press release
INSERT INTO press_releases (
    id, tenant_id, user_id, title, content, summary, target_audience, keywords,
    status, submission_tier, distribution_channels
)
VALUES (
    '00000000-0000-4000-8000-000000000020'::UUID,
    '00000000-0000-4000-8000-000000000001'::UUID,
    '00000000-0000-4000-8000-000000000002'::UUID,
    'PRAVADO Launches Revolutionary AI Marketing Intelligence Platform',
    'FOR IMMEDIATE RELEASE

    PRAVADO Launches Revolutionary AI Marketing Intelligence Platform
    New Platform Combines Citation Tracking, Press Release Distribution, and Visibility Analytics in Single Solution

    San Francisco, CA - August 22, 2025 - PRAVADO, a leading marketing technology company, today announced the launch of its groundbreaking AI-powered marketing intelligence platform. The comprehensive solution addresses the growing need for businesses to track their brand presence across AI search engines while managing traditional PR and content marketing workflows in one unified system.

    "The marketing landscape has fundamentally changed with the rise of AI search engines like ChatGPT, Claude, and Perplexity," said [CEO Name], Chief Executive Officer of PRAVADO. "Our platform is the first to offer comprehensive citation tracking across these platforms while integrating traditional PR distribution and content optimization tools."

    Key features of the PRAVADO platform include:

    • CiteMind™ Technology: Automated tracking of brand mentions and competitor analysis across major AI platforms
    • Integrated PR Distribution: Streamlined press release creation and distribution to targeted media contacts
    • Visibility Score: Proprietary algorithm that aggregates performance across PR, SEO, content, and social channels
    • AI Content Optimization: Advanced content recommendations based on search intent and audience targeting

    The platform addresses critical challenges facing modern marketers:
    - Difficulty tracking brand mentions in AI-generated search results
    - Fragmented workflows across multiple marketing tools
    - Lack of unified analytics across PR, content, and social channels
    - Time-intensive manual processes for media outreach and content optimization

    "Traditional marketing tools weren''t built for the AI era," added [CMO Name], Chief Marketing Officer. "PRAVADO bridges the gap between conventional marketing practices and the new reality of AI-driven search and content discovery."

    Early beta customers report significant improvements in campaign efficiency and visibility tracking. [Customer Name] from [Company] noted, "PRAVADO has transformed how we track our brand presence. We can now see not just where we rank in Google, but how we appear in AI-generated responses across multiple platforms."

    The platform is now available for enterprise customers, with pricing starting at $299 per month for the Growth plan. A free trial is available for qualified businesses.

    About PRAVADO:
    PRAVADO is a marketing technology company focused on AI-powered marketing intelligence. Founded in 2024, the company is headquartered in San Francisco, California, with additional offices in New York and Austin. For more information, visit www.pravado.com.

    Media Contact:
    [Name]
    PRAVADO
    Phone: (555) 123-4567
    Email: press@pravado.com

    ###',
    'Major product launch announcement for AI marketing intelligence platform targeting enterprise customers and media coverage.',
    'Enterprise marketing directors, technology journalists, marketing trade publications, industry analysts',
    ARRAY['AI marketing', 'marketing intelligence', 'citation tracking', 'press release distribution', 'marketing automation', 'AI search engines'],
    'draft',
    'premium',
    ARRAY['PR Newswire', 'Business Wire', 'Tech media list', 'Industry analysts']
) ON CONFLICT (id) DO NOTHING;

-- ===== SAMPLE SEO KEYWORDS =====

-- Insert sample SEO keywords
INSERT INTO seo_keywords (id, tenant_id, campaign_id, keyword, search_volume, ranking_position, competition_level, target_url)
VALUES 
    (
        '00000000-0000-4000-8000-000000000030'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        '00000000-0000-4000-8000-000000000010'::UUID,
        'AI marketing intelligence',
        2400,
        8,
        'medium',
        'https://pravado.com/ai-marketing-intelligence'
    ),
    (
        '00000000-0000-4000-8000-000000000031'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        '00000000-0000-4000-8000-000000000010'::UUID,
        'marketing automation platform',
        5200,
        15,
        'high',
        'https://pravado.com/platform'
    ),
    (
        '00000000-0000-4000-8000-000000000032'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        '00000000-0000-4000-8000-000000000010'::UUID,
        'citation tracking tool',
        890,
        3,
        'low',
        'https://pravado.com/citemind'
    ),
    (
        '00000000-0000-4000-8000-000000000033'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        '00000000-0000-4000-8000-000000000010'::UUID,
        'press release distribution',
        3100,
        12,
        'medium',
        'https://pravado.com/pr-distribution'
    );

-- ===== VISIBILITY SCORE SNAPSHOTS =====

-- Insert historical visibility scores for trending
INSERT INTO visibility_score_snapshots (
    tenant_id, overall_score, pr_score, seo_score, content_score, social_score,
    snapshot_date
)
VALUES 
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        65, 60, 68, 70, 62,
        '2025-08-15'::DATE
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        68, 64, 70, 72, 65,
        '2025-08-16'::DATE
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        72, 68, 74, 75, 68,
        '2025-08-17'::DATE
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        69, 65, 71, 73, 67,
        '2025-08-18'::DATE
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        74, 70, 76, 78, 72,
        '2025-08-19'::DATE
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        71, 67, 73, 75, 70,
        '2025-08-20'::DATE
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        74, 70, 76, 78, 72,
        '2025-08-21'::DATE
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        76, 72, 78, 80, 74,
        '2025-08-22'::DATE
    );

-- ===== CITATION TRACKING SETUP =====

-- Create sample citation queries
INSERT INTO ai_citation_queries (
    id, tenant_id, query_text, query_type, target_entity,
    content_id, keywords, status
)
VALUES 
    (
        '00000000-0000-4000-8000-000000000040'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        'PRAVADO marketing intelligence platform',
        'brand_mention',
        'PRAVADO',
        NULL,
        ARRAY['PRAVADO', 'marketing intelligence', 'AI marketing'],
        'active'
    ),
    (
        '00000000-0000-4000-8000-000000000041'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        'AI-powered marketing intelligence future',
        'content_tracking',
        'AI Marketing Content',
        '00000000-0000-4000-8000-000000000011'::UUID,
        ARRAY['AI marketing', 'marketing intelligence', 'future'],
        'active'
    );

-- Sample citation results showing presence across platforms
INSERT INTO ai_citation_results (
    query_id, tenant_id, platform, search_query, found, position, snippet, confidence_score
)
VALUES 
    (
        '00000000-0000-4000-8000-000000000040'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        'chatgpt',
        'What are the best marketing intelligence platforms?',
        true,
        3,
        'PRAVADO is an emerging AI-powered marketing intelligence platform that offers comprehensive citation tracking and PR distribution features.',
        0.867
    ),
    (
        '00000000-0000-4000-8000-000000000040'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        'claude',
        'marketing intelligence tools comparison',
        true,
        2,
        'Among newer platforms, PRAVADO stands out for its integrated approach to AI citation tracking and traditional PR workflows.',
        0.923
    ),
    (
        '00000000-0000-4000-8000-000000000040'::UUID,
        '00000000-0000-4000-8000-000000000001'::UUID,
        'perplexity',
        'PRAVADO marketing platform features',
        true,
        1,
        'PRAVADO combines CiteMind technology with press release distribution in a unified marketing intelligence platform.',
        0.945
    );

-- Platform citation aggregations
INSERT INTO ai_platform_citations (
    tenant_id, entity_type, entity_name, platform, citation_count, 
    average_position, average_confidence, first_seen_at, last_seen_at,
    mentions_last_week, mentions_last_month
)
VALUES 
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        'brand',
        'PRAVADO',
        'chatgpt',
        15,
        3.2,
        0.834,
        '2025-08-15 09:00:00'::TIMESTAMP WITH TIME ZONE,
        '2025-08-22 14:30:00'::TIMESTAMP WITH TIME ZONE,
        8,
        15
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        'brand',
        'PRAVADO',
        'claude',
        23,
        2.1,
        0.891,
        '2025-08-14 11:15:00'::TIMESTAMP WITH TIME ZONE,
        '2025-08-22 16:45:00'::TIMESTAMP WITH TIME ZONE,
        12,
        23
    ),
    (
        '00000000-0000-4000-8000-000000000001'::UUID,
        'brand',
        'PRAVADO',
        'perplexity',
        31,
        1.7,
        0.912,
        '2025-08-13 08:30:00'::TIMESTAMP WITH TIME ZONE,
        '2025-08-22 17:20:00'::TIMESTAMP WITH TIME ZONE,
        18,
        31
    );

COMMIT;
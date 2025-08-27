-- SEO Tabs Live Database Migration
-- Migration: 006_seo_tables
-- Created: 2025-08-24
-- Description: Creates tables for SEO keywords, competitors, and backlinks tracking

-- Drop tables if they exist (for development/testing)
DROP TABLE IF EXISTS seo_backlinks CASCADE;
DROP TABLE IF EXISTS seo_competitors CASCADE;
DROP TABLE IF EXISTS seo_keywords CASCADE;

-- SEO Keywords Table
CREATE TABLE IF NOT EXISTS seo_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    difficulty_0_100 INTEGER CHECK (difficulty_0_100 >= 0 AND difficulty_0_100 <= 100),
    position INTEGER CHECK (position > 0),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique keyword per organization
    CONSTRAINT unique_org_keyword UNIQUE (org_id, keyword)
);

-- SEO Competitors Table
CREATE TABLE IF NOT EXISTS seo_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    share_of_voice_0_100 INTEGER CHECK (share_of_voice_0_100 >= 0 AND share_of_voice_0_100 <= 100),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique domain per organization
    CONSTRAINT unique_org_domain UNIQUE (org_id, domain)
);

-- SEO Backlinks Table
CREATE TABLE IF NOT EXISTS seo_backlinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source_url VARCHAR(2048) NOT NULL,
    target_path VARCHAR(1024) NOT NULL,
    da_0_100 INTEGER CHECK (da_0_100 >= 0 AND da_0_100 <= 100), -- Domain Authority
    discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique source -> target mapping per organization
    CONSTRAINT unique_org_backlink UNIQUE (org_id, source_url, target_path)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_keywords_org_last_seen 
    ON seo_keywords(org_id, last_seen DESC);

CREATE INDEX IF NOT EXISTS idx_seo_keywords_difficulty 
    ON seo_keywords(org_id, difficulty_0_100 DESC);

CREATE INDEX IF NOT EXISTS idx_seo_keywords_position 
    ON seo_keywords(org_id, position ASC);

CREATE INDEX IF NOT EXISTS idx_seo_competitors_org_last_seen 
    ON seo_competitors(org_id, last_seen DESC);

CREATE INDEX IF NOT EXISTS idx_seo_competitors_share_voice 
    ON seo_competitors(org_id, share_of_voice_0_100 DESC);

CREATE INDEX IF NOT EXISTS idx_seo_backlinks_org_discovered 
    ON seo_backlinks(org_id, discovered_at DESC);

CREATE INDEX IF NOT EXISTS idx_seo_backlinks_da 
    ON seo_backlinks(org_id, da_0_100 DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_backlinks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access data from their organization
CREATE POLICY seo_keywords_org_policy ON seo_keywords
    FOR ALL USING (
        org_id IN (
            SELECT organization_id 
            FROM organization_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY seo_competitors_org_policy ON seo_competitors
    FOR ALL USING (
        org_id IN (
            SELECT organization_id 
            FROM organization_memberships 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY seo_backlinks_org_policy ON seo_backlinks
    FOR ALL USING (
        org_id IN (
            SELECT organization_id 
            FROM organization_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- Insert demo data for testing (replace with actual org_id in production)
-- Note: These will need to be updated with real organization IDs

-- Demo keywords
INSERT INTO seo_keywords (org_id, keyword, difficulty_0_100, position, last_seen) VALUES
    ('11111111-1111-1111-1111-111111111111', 'ai content writing', 85, 3, NOW() - INTERVAL '1 day'),
    ('11111111-1111-1111-1111-111111111111', 'automated press release', 72, 7, NOW() - INTERVAL '2 days'),
    ('11111111-1111-1111-1111-111111111111', 'content marketing automation', 68, 12, NOW() - INTERVAL '3 days'),
    ('11111111-1111-1111-1111-111111111111', 'digital pr platform', 91, 2, NOW() - INTERVAL '1 hour'),
    ('11111111-1111-1111-1111-111111111111', 'seo content tools', 76, 15, NOW() - INTERVAL '5 days'),
    ('11111111-1111-1111-1111-111111111111', 'brand visibility tracking', 83, 8, NOW() - INTERVAL '2 hours'),
    ('11111111-1111-1111-1111-111111111111', 'citation monitoring', 65, 21, NOW() - INTERVAL '1 week'),
    ('11111111-1111-1111-1111-111111111111', 'media coverage analysis', 79, 5, NOW() - INTERVAL '3 hours')
ON CONFLICT (org_id, keyword) DO UPDATE SET
    difficulty_0_100 = EXCLUDED.difficulty_0_100,
    position = EXCLUDED.position,
    last_seen = EXCLUDED.last_seen,
    updated_at = NOW();

-- Demo competitors
INSERT INTO seo_competitors (org_id, domain, share_of_voice_0_100, last_seen) VALUES
    ('11111111-1111-1111-1111-111111111111', 'contentking.com', 78, NOW() - INTERVAL '2 days'),
    ('11111111-1111-1111-1111-111111111111', 'semrush.com', 95, NOW() - INTERVAL '1 day'),
    ('11111111-1111-1111-1111-111111111111', 'ahrefs.com', 92, NOW() - INTERVAL '3 hours'),
    ('11111111-1111-1111-1111-111111111111', 'moz.com', 88, NOW() - INTERVAL '1 day'),
    ('11111111-1111-1111-1111-111111111111', 'screamingtrog.com', 71, NOW() - INTERVAL '4 days'),
    ('11111111-1111-1111-1111-111111111111', 'brightedge.com', 84, NOW() - INTERVAL '2 days'),
    ('11111111-1111-1111-1111-111111111111', 'conductor.com', 76, NOW() - INTERVAL '1 week'),
    ('11111111-1111-1111-1111-111111111111', 'searchmetrics.com', 82, NOW() - INTERVAL '3 days')
ON CONFLICT (org_id, domain) DO UPDATE SET
    share_of_voice_0_100 = EXCLUDED.share_of_voice_0_100,
    last_seen = EXCLUDED.last_seen,
    updated_at = NOW();

-- Demo backlinks
INSERT INTO seo_backlinks (org_id, source_url, target_path, da_0_100, discovered_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'https://techcrunch.com/2024/01/15/ai-content-revolution/', '/features/content-ai', 94, NOW() - INTERVAL '2 weeks'),
    ('11111111-1111-1111-1111-111111111111', 'https://mashable.com/article/automated-pr-tools/', '/platform/press-release', 89, NOW() - INTERVAL '10 days'),
    ('11111111-1111-1111-1111-111111111111', 'https://venturebeat.com/ai/content-marketing-ai/', '/blog/content-marketing', 91, NOW() - INTERVAL '1 week'),
    ('11111111-1111-1111-1111-111111111111', 'https://searchengineland.com/seo-automation-tools/', '/tools/seo', 87, NOW() - INTERVAL '5 days'),
    ('11111111-1111-1111-1111-111111111111', 'https://contentmarketinginstitute.com/ai-tools/', '/features', 85, NOW() - INTERVAL '3 days'),
    ('11111111-1111-1111-1111-111111111111', 'https://martech.org/pr-automation/', '/platform', 82, NOW() - INTERVAL '1 day'),
    ('11111111-1111-1111-1111-111111111111', 'https://forbes.com/sites/ai-content-marketing/', '/case-studies/forbes', 96, NOW() - INTERVAL '2 days'),
    ('11111111-1111-1111-1111-111111111111', 'https://entrepreneur.com/article/digital-pr/', '/blog/digital-pr-guide', 88, NOW() - INTERVAL '4 hours'),
    ('11111111-1111-1111-1111-111111111111', 'https://inc.com/ai-powered-marketing/', '/features/ai-marketing', 90, NOW() - INTERVAL '6 days'),
    ('11111111-1111-1111-1111-111111111111', 'https://wired.com/story/content-automation/', '/platform/automation', 93, NOW() - INTERVAL '1 week')
ON CONFLICT (org_id, source_url, target_path) DO UPDATE SET
    da_0_100 = EXCLUDED.da_0_100,
    discovered_at = EXCLUDED.discovered_at,
    updated_at = NOW();

-- Create helper functions for aggregations
CREATE OR REPLACE FUNCTION get_seo_keywords_summary(org_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT JSON_BUILD_OBJECT(
        'total_count', COUNT(*),
        'avg_difficulty', ROUND(AVG(difficulty_0_100), 1),
        'avg_position', ROUND(AVG(position), 1),
        'top_10_count', COUNT(*) FILTER (WHERE position <= 10),
        'last_updated', MAX(last_seen)
    ) INTO result
    FROM seo_keywords
    WHERE org_id = org_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_seo_competitors_summary(org_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT JSON_BUILD_OBJECT(
        'total_count', COUNT(*),
        'avg_share_of_voice', ROUND(AVG(share_of_voice_0_100), 1),
        'top_competitor', (
            SELECT domain 
            FROM seo_competitors 
            WHERE org_id = org_uuid 
            ORDER BY share_of_voice_0_100 DESC 
            LIMIT 1
        ),
        'last_updated', MAX(last_seen)
    ) INTO result
    FROM seo_competitors
    WHERE org_id = org_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_seo_backlinks_summary(org_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT JSON_BUILD_OBJECT(
        'total_count', COUNT(*),
        'avg_da', ROUND(AVG(da_0_100), 1),
        'high_da_count', COUNT(*) FILTER (WHERE da_0_100 >= 80),
        'recent_count', COUNT(*) FILTER (WHERE discovered_at >= NOW() - INTERVAL '7 days'),
        'last_discovered', MAX(discovered_at)
    ) INTO result
    FROM seo_backlinks
    WHERE org_id = org_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON seo_keywords TO anon, authenticated;
GRANT SELECT ON seo_competitors TO anon, authenticated;
GRANT SELECT ON seo_backlinks TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_seo_keywords_summary(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_seo_competitors_summary(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_seo_backlinks_summary(UUID) TO anon, authenticated;

-- Add comments for documentation
COMMENT ON TABLE seo_keywords IS 'SEO keyword tracking with difficulty and position data';
COMMENT ON TABLE seo_competitors IS 'Competitor domains with share of voice metrics';
COMMENT ON TABLE seo_backlinks IS 'Backlink profile with domain authority scores';

COMMENT ON COLUMN seo_keywords.difficulty_0_100 IS 'SEO difficulty score from 0 (easy) to 100 (very hard)';
COMMENT ON COLUMN seo_keywords.position IS 'Current search engine ranking position';
COMMENT ON COLUMN seo_competitors.share_of_voice_0_100 IS 'Percentage of visibility in shared keyword set';
COMMENT ON COLUMN seo_backlinks.da_0_100 IS 'Moz Domain Authority score from 0 to 100';
COMMENT ON COLUMN seo_backlinks.source_url IS 'URL of the page containing the backlink';
COMMENT ON COLUMN seo_backlinks.target_path IS 'Path on our domain that is being linked to';
-- Visibility Score Snapshots Migration
-- Migration: 007_visibility_score_snapshots
-- Created: 2025-08-24
-- Description: Creates table for daily visibility score snapshots and scoring functions

-- Drop table if exists (for development/testing)
DROP TABLE IF EXISTS visibility_score_snapshots CASCADE;

-- Visibility Score Snapshots Table
CREATE TABLE IF NOT EXISTS visibility_score_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    breakdown JSONB NOT NULL DEFAULT '{}',
    trend JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one snapshot per org per day
    CONSTRAINT unique_org_date UNIQUE (org_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visibility_score_org_date 
    ON visibility_score_snapshots(org_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_visibility_score_date 
    ON visibility_score_snapshots(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE visibility_score_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access data from their organization
CREATE POLICY visibility_score_org_policy ON visibility_score_snapshots
    FOR ALL USING (
        org_id IN (
            SELECT organization_id 
            FROM organization_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- Visibility Score Configuration Table
CREATE TABLE IF NOT EXISTS visibility_score_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    weights JSONB NOT NULL DEFAULT '{
        "cadence": 0.2,
        "citemind": 0.4,
        "pr": 0.2,
        "seo": 0.2
    }'::jsonb,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- One config per organization
    CONSTRAINT unique_org_config UNIQUE (org_id)
);

-- Enable RLS for config table
ALTER TABLE visibility_score_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY visibility_config_org_policy ON visibility_score_config
    FOR ALL USING (
        org_id IN (
            SELECT organization_id 
            FROM organization_memberships 
            WHERE user_id = auth.uid()
        )
    );

-- Insert default configuration for demo org
INSERT INTO visibility_score_config (org_id, weights) VALUES
    ('11111111-1111-1111-1111-111111111111', '{
        "cadence": 0.2,
        "citemind": 0.4,
        "pr": 0.2,
        "seo": 0.2
    }'::jsonb)
ON CONFLICT (org_id) DO UPDATE SET
    weights = EXCLUDED.weights,
    updated_at = NOW();

-- Function to calculate content cadence score (0-100)
CREATE OR REPLACE FUNCTION calculate_content_cadence_score(org_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    content_count INTEGER;
    recent_count INTEGER;
    recency_bonus INTEGER;
    cadence_score INTEGER;
BEGIN
    -- Get total published content in period
    SELECT COUNT(*) INTO content_count
    FROM content_items 
    WHERE org_id = org_uuid 
      AND status = 'published'
      AND published_at >= NOW() - INTERVAL '1 day' * days_back;
    
    -- Get recent content (last 7 days)
    SELECT COUNT(*) INTO recent_count
    FROM content_items 
    WHERE org_id = org_uuid 
      AND status = 'published'
      AND published_at >= NOW() - INTERVAL '7 days';
    
    -- Calculate base score (content frequency)
    cadence_score := LEAST(100, content_count * 5); -- 20 articles = 100 score
    
    -- Add recency bonus
    recency_bonus := LEAST(20, recent_count * 10); -- Up to 20 bonus points
    
    cadence_score := LEAST(100, cadence_score + recency_bonus);
    
    RETURN COALESCE(cadence_score, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate CiteMind score (0-100)
CREATE OR REPLACE FUNCTION calculate_citemind_score(org_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    citemind_score INTEGER;
    citation_prob DECIMAL;
    authority_index INTEGER;
    platform_coverage INTEGER;
BEGIN
    -- Mock CiteMind data for demo
    -- In production, this would query actual CiteMind analytics
    citation_prob := 0.74; -- 74% citation probability
    authority_index := 84; -- Authority index score
    platform_coverage := 3; -- Number of platforms with presence
    
    -- Calculate weighted CiteMind score
    citemind_score := (
        (citation_prob * 100 * 0.4) + -- Citation probability weight
        (authority_index * 0.4) +     -- Authority index weight  
        (LEAST(100, platform_coverage * 20) * 0.2) -- Platform coverage weight
    )::INTEGER;
    
    RETURN LEAST(100, GREATEST(0, citemind_score));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate PR momentum score (0-100)
CREATE OR REPLACE FUNCTION calculate_pr_momentum_score(org_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    pr_score INTEGER;
    wallet_debits INTEGER;
    pr_submissions INTEGER;
BEGIN
    -- Mock PR data for demo
    -- In production, this would query actual wallet debits and PR submissions
    wallet_debits := 5; -- Number of PR-related wallet debits
    pr_submissions := 3; -- Number of press release submissions
    
    -- Calculate PR momentum score
    pr_score := (wallet_debits * 10) + (pr_submissions * 15);
    pr_score := LEAST(100, pr_score);
    
    RETURN COALESCE(pr_score, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate SEO baseline score (0-100)
CREATE OR REPLACE FUNCTION calculate_seo_baseline_score(org_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    seo_score INTEGER;
    keyword_count INTEGER;
    avg_position DECIMAL;
    backlink_count INTEGER;
    avg_da DECIMAL;
BEGIN
    -- Get keyword metrics
    SELECT 
        COUNT(*),
        AVG(position)
    INTO keyword_count, avg_position
    FROM seo_keywords 
    WHERE org_id = org_uuid;
    
    -- Get backlink metrics
    SELECT 
        COUNT(*),
        AVG(da_0_100)
    INTO backlink_count, avg_da
    FROM seo_backlinks 
    WHERE org_id = org_uuid;
    
    -- Calculate SEO baseline score
    seo_score := (
        LEAST(50, keyword_count * 2) + -- Up to 50 points for keywords (25 keywords = max)
        LEAST(30, (100 - COALESCE(avg_position, 50)) * 0.6) + -- Position scoring (lower is better)
        LEAST(20, backlink_count * 2) -- Up to 20 points for backlinks (10 backlinks = max)
    )::INTEGER;
    
    RETURN LEAST(100, GREATEST(0, seo_score));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Main function to calculate overall visibility score
CREATE OR REPLACE FUNCTION calculate_visibility_score(org_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    config_weights JSONB;
    cadence_score INTEGER;
    citemind_score INTEGER;
    pr_score INTEGER;
    seo_score INTEGER;
    overall_score INTEGER;
    breakdown JSONB;
    result JSONB;
BEGIN
    -- Get scoring weights for organization
    SELECT weights INTO config_weights
    FROM visibility_score_config 
    WHERE org_id = org_uuid;
    
    -- Use default weights if no config found
    IF config_weights IS NULL THEN
        config_weights := '{
            "cadence": 0.2,
            "citemind": 0.4,
            "pr": 0.2,
            "seo": 0.2
        }'::jsonb;
    END IF;
    
    -- Calculate component scores
    cadence_score := calculate_content_cadence_score(org_uuid);
    citemind_score := calculate_citemind_score(org_uuid);
    pr_score := calculate_pr_momentum_score(org_uuid);
    seo_score := calculate_seo_baseline_score(org_uuid);
    
    -- Calculate weighted overall score
    overall_score := (
        cadence_score * (config_weights->>'cadence')::DECIMAL +
        citemind_score * (config_weights->>'citemind')::DECIMAL +
        pr_score * (config_weights->>'pr')::DECIMAL +
        seo_score * (config_weights->>'seo')::DECIMAL
    )::INTEGER;
    
    -- Create breakdown object
    breakdown := JSON_BUILD_OBJECT(
        'cadence', cadence_score,
        'citemind', citemind_score,
        'pr', pr_score,
        'seo', seo_score,
        'weights', config_weights
    );
    
    -- Create result object
    result := JSON_BUILD_OBJECT(
        'score', overall_score,
        'breakdown', breakdown
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create daily visibility score snapshot
CREATE OR REPLACE FUNCTION create_visibility_score_snapshot(org_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    score_data JSONB;
    trend_data JSONB;
    previous_score INTEGER;
    current_score INTEGER;
    score_change INTEGER;
    snapshot_record visibility_score_snapshots;
BEGIN
    -- Calculate current visibility score
    score_data := calculate_visibility_score(org_uuid);
    current_score := (score_data->>'score')::INTEGER;
    
    -- Get previous day's score for trend calculation
    SELECT score INTO previous_score
    FROM visibility_score_snapshots
    WHERE org_id = org_uuid 
      AND date = CURRENT_DATE - INTERVAL '1 day';
    
    -- Calculate trend
    IF previous_score IS NOT NULL THEN
        score_change := current_score - previous_score;
        trend_data := JSON_BUILD_OBJECT(
            'direction', CASE 
                WHEN score_change > 0 THEN 'up'
                WHEN score_change < 0 THEN 'down'
                ELSE 'neutral'
            END,
            'change', ABS(score_change),
            'previous_score', previous_score
        );
    ELSE
        trend_data := JSON_BUILD_OBJECT(
            'direction', 'neutral',
            'change', 0,
            'previous_score', null
        );
    END IF;
    
    -- Insert or update snapshot
    INSERT INTO visibility_score_snapshots (
        org_id, 
        date, 
        score, 
        breakdown, 
        trend
    ) VALUES (
        org_uuid,
        CURRENT_DATE,
        current_score,
        score_data->'breakdown',
        trend_data
    )
    ON CONFLICT (org_id, date) DO UPDATE SET
        score = EXCLUDED.score,
        breakdown = EXCLUDED.breakdown,
        trend = EXCLUDED.trend,
        created_at = NOW()
    RETURNING * INTO snapshot_record;
    
    -- Return the full snapshot data
    RETURN JSON_BUILD_OBJECT(
        'score', snapshot_record.score,
        'breakdown', snapshot_record.breakdown,
        'trend', snapshot_record.trend,
        'date', snapshot_record.date
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get visibility score history (for sparkline)
CREATE OR REPLACE FUNCTION get_visibility_score_history(org_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
    history_data JSONB;
BEGIN
    SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
            'date', date,
            'score', score
        ) ORDER BY date ASC
    ) INTO history_data
    FROM visibility_score_snapshots
    WHERE org_id = org_uuid
      AND date >= CURRENT_DATE - INTERVAL '1 day' * days_back;
    
    RETURN COALESCE(history_data, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert demo snapshots for the last 30 days
DO $$
DECLARE
    demo_org_id UUID := '11111111-1111-1111-1111-111111111111';
    day_offset INTEGER;
    snapshot_date DATE;
    base_score INTEGER;
    daily_score INTEGER;
    score_variance INTEGER;
BEGIN
    FOR day_offset IN 0..29 LOOP
        snapshot_date := CURRENT_DATE - INTERVAL '1 day' * day_offset;
        
        -- Generate realistic score progression (trending upward with variance)
        base_score := 65 + (29 - day_offset); -- Base score improves over time
        score_variance := (RANDOM() * 10 - 5)::INTEGER; -- ±5 variance
        daily_score := LEAST(100, GREATEST(0, base_score + score_variance));
        
        INSERT INTO visibility_score_snapshots (
            org_id,
            date,
            score,
            breakdown,
            trend
        ) VALUES (
            demo_org_id,
            snapshot_date,
            daily_score,
            JSON_BUILD_OBJECT(
                'cadence', (daily_score * 0.2 + RANDOM() * 10 - 5)::INTEGER,
                'citemind', (daily_score * 0.4 + RANDOM() * 10 - 5)::INTEGER,
                'pr', (daily_score * 0.2 + RANDOM() * 10 - 5)::INTEGER,
                'seo', (daily_score * 0.2 + RANDOM() * 10 - 5)::INTEGER,
                'weights', '{
                    "cadence": 0.2,
                    "citemind": 0.4,
                    "pr": 0.2,
                    "seo": 0.2
                }'::jsonb
            ),
            JSON_BUILD_OBJECT(
                'direction', CASE 
                    WHEN day_offset = 29 THEN 'neutral'
                    WHEN RANDOM() > 0.5 THEN 'up'
                    ELSE 'down'
                END,
                'change', (RANDOM() * 5)::INTEGER,
                'previous_score', CASE 
                    WHEN day_offset = 29 THEN null
                    ELSE daily_score - (RANDOM() * 6 - 3)::INTEGER
                END
            )
        )
        ON CONFLICT (org_id, date) DO UPDATE SET
            score = EXCLUDED.score,
            breakdown = EXCLUDED.breakdown,
            trend = EXCLUDED.trend;
    END LOOP;
END;
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON visibility_score_snapshots TO anon, authenticated;
GRANT SELECT ON visibility_score_config TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_visibility_score(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_visibility_score_snapshot(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_visibility_score_history(UUID, INTEGER) TO anon, authenticated;

-- Add comments for documentation
COMMENT ON TABLE visibility_score_snapshots IS 'Daily snapshots of organization visibility scores';
COMMENT ON TABLE visibility_score_config IS 'Configuration and weights for visibility score calculation';

COMMENT ON COLUMN visibility_score_snapshots.score IS 'Overall visibility score (0-100)';
COMMENT ON COLUMN visibility_score_snapshots.breakdown IS 'JSON object with component scores and weights';
COMMENT ON COLUMN visibility_score_snapshots.trend IS 'JSON object with trend direction and change data';
COMMENT ON COLUMN visibility_score_config.weights IS 'JSON object with component weights (must sum to 1.0)';
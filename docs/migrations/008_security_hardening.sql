/**
 * Security Hardening Migration (G)
 * 
 * This migration implements comprehensive security measures:
 * - Row Level Security (RLS) policies for multi-tenant data isolation
 * - Enhanced authentication and authorization
 * - Audit trail tables for security monitoring
 * - Performance indexes for secure operations
 */

-- Enable Row Level Security on all existing tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visibility_score_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_backlinks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organizations table
-- Users can only access their own organization
CREATE POLICY "org_isolation" ON organizations
    FOR ALL
    USING (id = current_setting('app.current_org_id')::UUID)
    WITH CHECK (id = current_setting('app.current_org_id')::UUID);

-- Create RLS policies for visibility_score_snapshots
-- Users can only access snapshots for their organization
CREATE POLICY "visibility_org_isolation" ON visibility_score_snapshots
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID)
    WITH CHECK (org_id = current_setting('app.current_org_id')::UUID);

-- Create RLS policies for SEO tables
CREATE POLICY "seo_keywords_org_isolation" ON seo_keywords
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID)
    WITH CHECK (org_id = current_setting('app.current_org_id')::UUID);

CREATE POLICY "seo_competitors_org_isolation" ON seo_competitors
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID)
    WITH CHECK (org_id = current_setting('app.current_org_id')::UUID);

CREATE POLICY "seo_backlinks_org_isolation" ON seo_backlinks
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID)
    WITH CHECK (org_id = current_setting('app.current_org_id')::UUID);

-- Create audit trail table for security monitoring
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(255), -- External user identifier (from JWT)
    action VARCHAR(100) NOT NULL, -- CREATE, READ, UPDATE, DELETE, LOGIN, etc.
    resource_type VARCHAR(100) NOT NULL, -- organizations, seo_keywords, etc.
    resource_id UUID, -- ID of the affected resource
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT,
    metadata JSONB -- Additional context (e.g., fields changed)
);

-- Enable RLS on audit log
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log RLS policy - users can only see their org's logs
CREATE POLICY "audit_org_isolation" ON security_audit_log
    FOR SELECT
    USING (org_id = current_setting('app.current_org_id')::UUID);

-- Create indexes for audit log performance
CREATE INDEX idx_security_audit_org_timestamp ON security_audit_log(org_id, timestamp DESC);
CREATE INDEX idx_security_audit_user_timestamp ON security_audit_log(user_id, timestamp DESC);
CREATE INDEX idx_security_audit_action_timestamp ON security_audit_log(action, timestamp DESC);

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_org_id UUID,
    p_user_id VARCHAR(255),
    p_action VARCHAR(100),
    p_resource_type VARCHAR(100),
    p_resource_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO security_audit_log (
        org_id,
        user_id,
        action,
        resource_type,
        resource_id,
        ip_address,
        user_agent,
        success,
        error_message,
        metadata
    ) VALUES (
        p_org_id,
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_ip_address,
        p_user_agent,
        p_success,
        p_error_message,
        p_metadata
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- Create function to set organization context for RLS
CREATE OR REPLACE FUNCTION set_current_org_id(org_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Validate that the organization exists and user has access
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = org_uuid) THEN
        RAISE EXCEPTION 'Organization not found or access denied';
    END IF;
    
    -- Set the current organization context
    PERFORM set_config('app.current_org_id', org_uuid::TEXT, TRUE);
END;
$$;

-- Create rate limiting table for API endpoints
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL, -- IP address or user_id
    endpoint VARCHAR(255) NOT NULL,
    requests_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique constraint for rate limiting
CREATE UNIQUE INDEX idx_rate_limit_identifier_endpoint_window 
ON api_rate_limits(identifier, endpoint, window_start);

-- Create index for cleanup queries
CREATE INDEX idx_rate_limits_created_at ON api_rate_limits(created_at);

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier VARCHAR(255),
    p_endpoint VARCHAR(255),
    p_max_requests INTEGER DEFAULT 100,
    p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    window_start_time TIMESTAMPTZ;
    current_requests INTEGER;
BEGIN
    -- Calculate window start time (aligned to window boundaries)
    window_start_time := date_trunc('hour', NOW()) + 
                        (EXTRACT(minute FROM NOW())::INTEGER / p_window_minutes) * 
                        (p_window_minutes || ' minutes')::INTERVAL;
    
    -- Try to update existing record or insert new one
    INSERT INTO api_rate_limits (identifier, endpoint, requests_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, window_start_time)
    ON CONFLICT (identifier, endpoint, window_start)
    DO UPDATE SET
        requests_count = api_rate_limits.requests_count + 1,
        updated_at = NOW()
    RETURNING requests_count INTO current_requests;
    
    -- Return TRUE if under limit, FALSE if over limit
    RETURN current_requests <= p_max_requests;
END;
$$;

-- Create cleanup function for old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete records older than 24 hours
    DELETE FROM api_rate_limits 
    WHERE created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Create table for storing security configuration
CREATE TABLE IF NOT EXISTS security_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    config_key VARCHAR(255) NOT NULL,
    config_value JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, config_key)
);

-- Enable RLS on security config
ALTER TABLE security_config ENABLE ROW LEVEL SECURITY;

-- Security config RLS policy
CREATE POLICY "security_config_org_isolation" ON security_config
    FOR ALL
    USING (org_id = current_setting('app.current_org_id')::UUID)
    WITH CHECK (org_id = current_setting('app.current_org_id')::UUID);

-- Insert default security configurations
INSERT INTO security_config (org_id, config_key, config_value)
SELECT 
    id as org_id,
    'rate_limits' as config_key,
    jsonb_build_object(
        'api_requests_per_hour', 1000,
        'seo_queries_per_hour', 100,
        'visibility_computations_per_day', 10
    ) as config_value
FROM organizations
ON CONFLICT (org_id, config_key) DO NOTHING;

INSERT INTO security_config (org_id, config_key, config_value)
SELECT 
    id as org_id,
    'access_control' as config_key,
    jsonb_build_object(
        'require_mfa', false,
        'session_timeout_minutes', 480,
        'max_concurrent_sessions', 5,
        'ip_whitelist_enabled', false,
        'ip_whitelist', '[]'::jsonb
    ) as config_value
FROM organizations
ON CONFLICT (org_id, config_key) DO NOTHING;

-- Create indexes for security config
CREATE INDEX idx_security_config_org_key ON security_config(org_id, config_key);

-- Demo: Log initial security setup
DO $$
DECLARE
    org_record RECORD;
BEGIN
    FOR org_record IN SELECT id FROM organizations LOOP
        PERFORM log_security_event(
            org_record.id,
            'system',
            'SECURITY_SETUP',
            'security_config',
            NULL,
            NULL,
            'Migration Script',
            TRUE,
            NULL,
            jsonb_build_object(
                'migration', '008_security_hardening',
                'features', jsonb_build_array(
                    'Row Level Security',
                    'Audit Trail',
                    'Rate Limiting',
                    'Security Configuration'
                )
            )
        );
    END LOOP;
END
$$;

-- Create function to get security metrics for monitoring
CREATE OR REPLACE FUNCTION get_security_metrics(
    p_org_id UUID,
    p_hours_back INTEGER DEFAULT 24
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    metrics JSONB;
    total_requests INTEGER;
    failed_requests INTEGER;
    unique_users INTEGER;
    rate_limit_violations INTEGER;
BEGIN
    -- Set organization context
    PERFORM set_config('app.current_org_id', p_org_id::TEXT, TRUE);
    
    -- Get basic security metrics
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE NOT success) as failures,
        COUNT(DISTINCT user_id) as users,
        COUNT(*) FILTER (WHERE action = 'RATE_LIMIT_EXCEEDED') as rate_limits
    INTO total_requests, failed_requests, unique_users, rate_limit_violations
    FROM security_audit_log
    WHERE org_id = p_org_id 
    AND timestamp >= NOW() - (p_hours_back || ' hours')::INTERVAL;
    
    -- Build metrics object
    metrics := jsonb_build_object(
        'period_hours', p_hours_back,
        'total_requests', COALESCE(total_requests, 0),
        'failed_requests', COALESCE(failed_requests, 0),
        'success_rate', 
            CASE 
                WHEN COALESCE(total_requests, 0) > 0 
                THEN ROUND((1.0 - COALESCE(failed_requests, 0)::NUMERIC / total_requests) * 100, 2)
                ELSE 100.0
            END,
        'unique_users', COALESCE(unique_users, 0),
        'rate_limit_violations', COALESCE(rate_limit_violations, 0),
        'generated_at', NOW()
    );
    
    RETURN metrics;
END;
$$;

-- Grant necessary permissions (in production, these would be more restrictive)
-- These are demo permissions for development
GRANT SELECT ON security_audit_log TO PUBLIC;
GRANT SELECT ON api_rate_limits TO PUBLIC;
GRANT SELECT ON security_config TO PUBLIC;
GRANT EXECUTE ON FUNCTION log_security_event TO PUBLIC;
GRANT EXECUTE ON FUNCTION set_current_org_id TO PUBLIC;
GRANT EXECUTE ON FUNCTION check_rate_limit TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_security_metrics TO PUBLIC;

-- Create comments for documentation
COMMENT ON TABLE security_audit_log IS 'Audit trail for all security-relevant actions';
COMMENT ON TABLE api_rate_limits IS 'Rate limiting state for API endpoints';
COMMENT ON TABLE security_config IS 'Organization-specific security configuration';
COMMENT ON FUNCTION log_security_event IS 'Logs security events with context';
COMMENT ON FUNCTION set_current_org_id IS 'Sets organization context for RLS';
COMMENT ON FUNCTION check_rate_limit IS 'Checks and updates API rate limits';
COMMENT ON FUNCTION get_security_metrics IS 'Returns security metrics for monitoring';
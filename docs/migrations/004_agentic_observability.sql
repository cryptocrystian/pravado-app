-- Migration 004: Agentic Observability & CiteMind Analytics
-- Branch: feat/agentic-analytics-b1
-- Purpose: Add agent observability tables and CiteMind KPI tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- AGENTIC OBSERVABILITY TABLES
-- ================================================

-- Agent runs: Track each job execution as an agent run
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES cm_jobs(id) ON DELETE CASCADE,
    planner VARCHAR(100) NOT NULL, -- e.g., 'citemind-orchestrator', 'pr-analyzer'
    status VARCHAR(50) NOT NULL DEFAULT 'running', -- running, completed, failed, budget_exceeded
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    steps INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE,
    meta_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agent steps: Individual tool/action invocations within a run
CREATE TABLE IF NOT EXISTS agent_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    step_no INTEGER NOT NULL,
    tool VARCHAR(100) NOT NULL, -- e.g., 'llm_call', 'web_search', 'db_query'
    input_hash VARCHAR(64), -- SHA256 of input for deduplication
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    duration_ms INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
    output_ref VARCHAR(255), -- Reference to output location (e.g., artifact ID)
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(run_id, step_no)
);

-- Tool artifacts: Store outputs/results from agent steps
CREATE TABLE IF NOT EXISTS tool_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_id UUID NOT NULL REFERENCES agent_steps(id) ON DELETE CASCADE,
    kind VARCHAR(50) NOT NULL, -- 'llm_response', 'search_results', 'analysis', etc.
    ref VARCHAR(255) NOT NULL, -- Storage reference (R2 key, inline if small)
    meta_json JSONB DEFAULT '{}', -- Metadata about the artifact
    size_bytes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- CITEMIND ANALYTICS TABLES
-- ================================================

-- Citation queries and probability tracking
CREATE TABLE IF NOT EXISTS ai_citation_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'press_release', 'article', etc.
    citation_probability DECIMAL(3, 2) DEFAULT 0, -- 0.00 to 1.00
    platforms_queried INTEGER DEFAULT 0,
    platforms_found INTEGER DEFAULT 0,
    last_queried_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, content_id)
);

-- AI platform citations tracking
CREATE TABLE IF NOT EXISTS ai_platform_citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'chatgpt', 'claude', 'perplexity', 'gemini'
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    citation_found BOOLEAN DEFAULT FALSE,
    relevance_score DECIMAL(3, 2), -- 0.00 to 1.00
    position INTEGER, -- Position in results (1-based)
    query_context JSONB DEFAULT '{}',
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Citation analytics rollups
CREATE TABLE IF NOT EXISTS citation_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    avg_citation_probability DECIMAL(3, 2),
    platform_coverage_pct DECIMAL(5, 2), -- 0.00 to 100.00
    authority_signal_index INTEGER, -- 0 to 100
    citations_found_count INTEGER DEFAULT 0,
    content_analyzed_count INTEGER DEFAULT 0,
    total_queries_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, date)
);

-- Citation results with timing
CREATE TABLE IF NOT EXISTS ai_citation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    platform VARCHAR(50) NOT NULL,
    citation_found BOOLEAN DEFAULT FALSE,
    time_to_citation_hours INTEGER, -- Hours from publish to first citation
    authority_signals JSONB DEFAULT '{}', -- Domain authority, backlinks, etc.
    result_metadata JSONB DEFAULT '{}',
    found_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Agent observability indexes
CREATE INDEX idx_agent_runs_job_id ON agent_runs(job_id);
CREATE INDEX idx_agent_runs_org_id_status ON agent_runs(org_id, status);
CREATE INDEX idx_agent_runs_started_at ON agent_runs(started_at DESC);
CREATE INDEX idx_agent_steps_run_id_step_no ON agent_steps(run_id, step_no);
CREATE INDEX idx_agent_steps_status ON agent_steps(status);
CREATE INDEX idx_tool_artifacts_step_id ON tool_artifacts(step_id);

-- Citation analytics indexes
CREATE INDEX idx_ai_citation_queries_tenant_content ON ai_citation_queries(tenant_id, content_id);
CREATE INDEX idx_ai_citation_queries_probability ON ai_citation_queries(citation_probability DESC);
CREATE INDEX idx_ai_platform_citations_tenant_platform ON ai_platform_citations(tenant_id, platform);
CREATE INDEX idx_ai_platform_citations_content ON ai_platform_citations(content_id, citation_found);
CREATE INDEX idx_citation_analytics_tenant_date ON citation_analytics(tenant_id, date DESC);
CREATE INDEX idx_ai_citation_results_tenant_content ON ai_citation_results(tenant_id, content_id);
CREATE INDEX idx_ai_citation_results_time_to_citation ON ai_citation_results(time_to_citation_hours) WHERE citation_found = true;

-- ================================================
-- FUNCTIONS FOR KPI CALCULATIONS
-- ================================================

-- Calculate platform coverage percentage
CREATE OR REPLACE FUNCTION calculate_platform_coverage(p_tenant_id UUID, p_date_from DATE, p_date_to DATE)
RETURNS DECIMAL AS $$
DECLARE
    total_platforms INTEGER := 4; -- ChatGPT, Claude, Perplexity, Gemini
    platforms_with_citations INTEGER;
BEGIN
    SELECT COUNT(DISTINCT platform)
    INTO platforms_with_citations
    FROM ai_platform_citations
    WHERE tenant_id = p_tenant_id
        AND citation_found = true
        AND DATE(checked_at) BETWEEN p_date_from AND p_date_to;
    
    RETURN ROUND((platforms_with_citations::DECIMAL / total_platforms) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Calculate authority signal index
CREATE OR REPLACE FUNCTION calculate_authority_index(p_authority_signals JSONB)
RETURNS INTEGER AS $$
DECLARE
    domain_authority INTEGER;
    backlink_count INTEGER;
    trust_flow INTEGER;
    calculated_index INTEGER;
BEGIN
    domain_authority := COALESCE((p_authority_signals->>'domain_authority')::INTEGER, 0);
    backlink_count := LEAST(COALESCE((p_authority_signals->>'backlink_count')::INTEGER, 0), 100);
    trust_flow := COALESCE((p_authority_signals->>'trust_flow')::INTEGER, 0);
    
    -- Weighted composite: DA (40%), Backlinks (30%), Trust (30%)
    calculated_index := ROUND(
        (domain_authority * 0.4) + 
        (backlink_count * 0.3) + 
        (trust_flow * 0.3)
    );
    
    RETURN LEAST(calculated_index, 100);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_runs_updated_at BEFORE UPDATE ON agent_runs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_steps_updated_at BEFORE UPDATE ON agent_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_citation_queries_updated_at BEFORE UPDATE ON ai_citation_queries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_citation_analytics_updated_at BEFORE UPDATE ON citation_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- GRANTS
-- ================================================

-- Grant appropriate permissions (adjust based on your user roles)
GRANT SELECT, INSERT, UPDATE ON agent_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON agent_steps TO authenticated;
GRANT SELECT, INSERT ON tool_artifacts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ai_citation_queries TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ai_platform_citations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON citation_analytics TO authenticated;
GRANT SELECT, INSERT ON ai_citation_results TO authenticated;

-- ================================================
-- SEED DATA FOR TESTING
-- ================================================

-- Add sample agent run for demo org
INSERT INTO agent_runs (org_id, job_id, planner, status, cost_usd, tokens_in, tokens_out, steps, finished_at)
SELECT 
    t.id,
    j.id,
    'citemind-orchestrator',
    'completed',
    0.125,
    1500,
    2300,
    5,
    CURRENT_TIMESTAMP + INTERVAL '2 minutes'
FROM tenants t
JOIN cm_jobs j ON j.tenant_id = t.id
WHERE t.name = 'Demo Organization'
LIMIT 1;

-- Add citation analytics sample
INSERT INTO citation_analytics (tenant_id, date, avg_citation_probability, platform_coverage_pct, authority_signal_index, citations_found_count, content_analyzed_count, total_queries_count)
SELECT 
    id,
    CURRENT_DATE,
    0.72,
    75.00,
    82,
    15,
    20,
    80
FROM tenants
WHERE name = 'Demo Organization';
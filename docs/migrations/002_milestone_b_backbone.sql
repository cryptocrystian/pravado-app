-- Milestone B: Platform Backbone, Wallet System, PR Submission, and CiteMind Orchestrator
-- Migration: 002_milestone_b_backbone.sql
-- Created: 2025-08-22

BEGIN;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===== WALLET SYSTEM =====

-- Wallets: Per-tenant credit tracking
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    wallet_type VARCHAR(50) NOT NULL DEFAULT 'main',
    
    -- Credit balances by type
    press_release_credits INTEGER DEFAULT 0,
    ai_operations_credits INTEGER DEFAULT 0,
    premium_credits INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, wallet_type)
);

-- Wallet transactions: Credit usage audit trail
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    
    -- Transaction details
    transaction_type VARCHAR(50) NOT NULL, -- 'debit', 'credit', 'refund'
    credit_type VARCHAR(50) NOT NULL, -- 'press_release_credits', 'ai_operations_credits', etc.
    amount INTEGER NOT NULL, -- Positive for credits, negative for debits
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Context
    reference_type VARCHAR(50), -- 'press_release', 'ai_operation', 'purchase'
    reference_id UUID,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== PRESS RELEASES & SUBMISSIONS =====

-- Press releases: Content and submission tracking
CREATE TABLE IF NOT EXISTS press_releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    target_audience TEXT,
    keywords TEXT[],
    
    -- Submission details
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'distributed', 'published', 'failed'
    submission_tier VARCHAR(50), -- 'basic', 'premium'
    distribution_channels TEXT[],
    
    -- Partner integration
    partner_submission_id TEXT,
    partner_response JSONB,
    partner_status VARCHAR(50),
    
    -- Dates
    submitted_at TIMESTAMP WITH TIME ZONE,
    distributed_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== EVENTS SYSTEM =====

-- Events: System event log for orchestration
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    
    -- Event identification
    event_type VARCHAR(100) NOT NULL, -- 'pr.submitted', 'content.published', etc.
    event_source VARCHAR(50) NOT NULL DEFAULT 'api',
    
    -- Event data
    entity_type VARCHAR(50), -- 'press_release', 'content_piece', etc.
    entity_id UUID,
    payload JSONB DEFAULT '{}',
    
    -- Processing
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'failed'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== VISIBILITY SCORES =====

-- Visibility score snapshots: Historical tracking
CREATE TABLE IF NOT EXISTS visibility_score_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Score breakdown
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    pr_score INTEGER DEFAULT 0,
    seo_score INTEGER DEFAULT 0,
    content_score INTEGER DEFAULT 0,
    social_score INTEGER DEFAULT 0,
    
    -- Weights used in calculation
    pr_weight DECIMAL(3,2) DEFAULT 0.35,
    seo_weight DECIMAL(3,2) DEFAULT 0.35,
    content_weight DECIMAL(3,2) DEFAULT 0.20,
    social_weight DECIMAL(3,2) DEFAULT 0.10,
    
    -- Metadata
    calculation_method VARCHAR(50) DEFAULT 'v1',
    data_sources TEXT[],
    snapshot_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, snapshot_date)
);

-- ===== CITEMIND AI SYSTEM =====

-- AI citation queries: Track what we're monitoring
CREATE TABLE IF NOT EXISTS ai_citation_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Query details
    query_text TEXT NOT NULL,
    query_type VARCHAR(50) NOT NULL, -- 'brand_mention', 'competitor_analysis', 'content_tracking'
    target_entity VARCHAR(100), -- Company name, content title, etc.
    
    -- Context
    content_id UUID REFERENCES content_pieces(id),
    press_release_id UUID REFERENCES press_releases(id),
    keywords TEXT[],
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'archived'
    last_scanned_at TIMESTAMP WITH TIME ZONE,
    scan_frequency_hours INTEGER DEFAULT 24,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI citation results: Individual platform scan results
CREATE TABLE IF NOT EXISTS ai_citation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_id UUID NOT NULL REFERENCES ai_citation_queries(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Platform info
    platform VARCHAR(50) NOT NULL, -- 'chatgpt', 'claude', 'perplexity', 'gemini'
    platform_version VARCHAR(50),
    
    -- Search context
    search_query TEXT NOT NULL,
    search_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Results
    found BOOLEAN DEFAULT FALSE,
    position INTEGER, -- Position in results if found
    snippet TEXT,
    confidence_score DECIMAL(4,3), -- 0.000 to 1.000
    context_relevance DECIMAL(4,3),
    
    -- Raw data
    raw_response JSONB,
    processing_metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI platform citations: Aggregated citation tracking per platform
CREATE TABLE IF NOT EXISTS ai_platform_citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Entity being cited
    entity_type VARCHAR(50) NOT NULL, -- 'brand', 'content', 'press_release'
    entity_id UUID,
    entity_name TEXT NOT NULL,
    
    -- Platform tracking
    platform VARCHAR(50) NOT NULL,
    citation_count INTEGER DEFAULT 0,
    average_position DECIMAL(5,2),
    average_confidence DECIMAL(4,3),
    
    -- Trend data
    first_seen_at TIMESTAMP WITH TIME ZONE,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    mentions_last_week INTEGER DEFAULT 0,
    mentions_last_month INTEGER DEFAULT 0,
    
    -- Metadata
    status VARCHAR(50) DEFAULT 'active',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, entity_type, entity_id, platform)
);

-- Citation analytics: High-level citation metrics
CREATE TABLE IF NOT EXISTS citation_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Time period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type VARCHAR(20) DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
    
    -- Metrics
    total_queries INTEGER DEFAULT 0,
    total_citations INTEGER DEFAULT 0,
    platforms_scanned TEXT[],
    average_position DECIMAL(5,2),
    citation_growth_rate DECIMAL(5,2),
    
    -- Breakdown by platform
    platform_breakdown JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, period_start, period_end, period_type)
);

-- ===== CITEMIND JOB SYSTEM =====

-- CiteMind jobs: Async job processing queue
CREATE TABLE IF NOT EXISTS cm_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Job identification
    job_type VARCHAR(100) NOT NULL, -- 'ai_citation_scan', 'kb_push', 'audio_tts'
    job_name TEXT,
    idempotency_key TEXT UNIQUE,
    
    -- Job context
    event_id UUID REFERENCES events(id),
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- Processing
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'retrying'
    priority INTEGER DEFAULT 5, -- 1 (highest) to 10 (lowest)
    
    -- Retry logic
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    retry_after TIMESTAMP WITH TIME ZONE,
    
    -- Execution timing
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Data and results
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_data JSONB DEFAULT '{}',
    
    -- Cost tracking
    meta JSONB DEFAULT '{}', -- For storing cost, tokens, execution time, etc.
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CiteMind job artifacts: File storage tracking
CREATE TABLE IF NOT EXISTS cm_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES cm_jobs(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Artifact details
    artifact_type VARCHAR(50) NOT NULL, -- 'audio_file', 'processed_data', 'report'
    file_name TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- Storage
    storage_provider VARCHAR(50) DEFAULT 'supabase', -- 'supabase', 's3', 'cloudflare'
    storage_path TEXT NOT NULL,
    storage_url TEXT,
    
    -- Metadata
    processing_metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDEXES FOR PERFORMANCE =====

-- CiteMind jobs performance indexes
CREATE INDEX IF NOT EXISTS idx_cm_jobs_status_priority_created 
    ON cm_jobs(status, priority, created_at);

CREATE INDEX IF NOT EXISTS idx_cm_jobs_tenant_status 
    ON cm_jobs(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_cm_jobs_retry_after 
    ON cm_jobs(retry_after) WHERE retry_after IS NOT NULL;

-- Citation results performance indexes
CREATE INDEX IF NOT EXISTS idx_ai_citation_results_query_platform 
    ON ai_citation_results(query_id, platform);

CREATE INDEX IF NOT EXISTS idx_ai_citation_results_tenant_platform 
    ON ai_citation_results(tenant_id, platform);

CREATE INDEX IF NOT EXISTS idx_ai_citation_results_search_timestamp 
    ON ai_citation_results(search_timestamp);

-- Wallet transactions indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_created 
    ON wallet_transactions(wallet_id, created_at);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_tenant_type 
    ON wallet_transactions(tenant_id, transaction_type);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_tenant_type_created 
    ON events(tenant_id, event_type, created_at);

CREATE INDEX IF NOT EXISTS idx_events_processing_status 
    ON events(processing_status, created_at);

-- Press releases indexes
CREATE INDEX IF NOT EXISTS idx_press_releases_tenant_status 
    ON press_releases(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_press_releases_submitted_at 
    ON press_releases(submitted_at) WHERE submitted_at IS NOT NULL;

-- Visibility score indexes
CREATE INDEX IF NOT EXISTS idx_visibility_scores_tenant_date 
    ON visibility_score_snapshots(tenant_id, snapshot_date);

-- Citation queries indexes
CREATE INDEX IF NOT EXISTS idx_citation_queries_tenant_status 
    ON ai_citation_queries(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_citation_queries_last_scanned 
    ON ai_citation_queries(last_scanned_at) WHERE status = 'active';

-- Platform citations indexes
CREATE INDEX IF NOT EXISTS idx_platform_citations_tenant_entity 
    ON ai_platform_citations(tenant_id, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_platform_citations_platform_updated 
    ON ai_platform_citations(platform, updated_at);

-- ===== TRIGGERS FOR AUTOMATIC UPDATES =====

-- Update updated_at timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_wallets_updated_at 
    BEFORE UPDATE ON wallets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_press_releases_updated_at 
    BEFORE UPDATE ON press_releases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_citation_queries_updated_at 
    BEFORE UPDATE ON ai_citation_queries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_citations_updated_at 
    BEFORE UPDATE ON ai_platform_citations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cm_jobs_updated_at 
    BEFORE UPDATE ON cm_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
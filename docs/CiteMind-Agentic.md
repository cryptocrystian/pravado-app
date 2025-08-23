# CiteMind Agentic Architecture

## Overview

The CiteMind Agentic Architecture provides comprehensive observability and control for AI-powered job execution in the PRAVADO platform. It implements agent runs with step-by-step tracking, cost monitoring, and quality assurance through Governor and Critic layers.

## Architecture Components

### 1. Agent Runner
The core orchestration engine that manages job execution with full observability.

**Key Features:**
- Agent run lifecycle management
- Step-by-step execution tracking
- Token and cost monitoring
- Artifact storage and retrieval

**Environment Configuration:**
```bash
CITEMIND_ENABLED=true
AGENT_MAX_STEPS=12
AGENT_COST_CAP_USD=0.35
MODEL_PRIMARY=anthropic/claude-3.7-sonnet
MODEL_FALLBACK=anthropic/haiku-latest
```

### 2. Governor Layer
Budget enforcement and execution control that ensures agents operate within defined limits.

**Budget Controls:**
- **Step Limit**: Maximum number of tool invocations per run
- **Cost Cap**: Maximum USD spend per agent run
- **Emergency Stop**: Immediate termination for violations

**Failure Semantics:**
- Fail closed on budget violations
- Proactive cost estimation before step execution
- Automatic cleanup on emergency stops

### 3. Critic Layer
Result validation and confidence assessment before persisting outputs.

**Validation Levels:**
- **Schema Validation**: Structure and type checking
- **Quality Checks**: Completeness and consistency analysis
- **Confidence Assessment**: Statistical confidence scoring

**Minimum Confidence Threshold**: 0.7 (configurable)

## Data Model

### Agent Runs
Tracks each job execution as a complete agent run with metadata.

```sql
CREATE TABLE agent_runs (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES tenants(id),
    job_id UUID REFERENCES cm_jobs(id),
    planner VARCHAR(100), -- orchestrator name
    status VARCHAR(50), -- running, completed, failed, budget_exceeded
    cost_usd DECIMAL(10, 6),
    tokens_in INTEGER,
    tokens_out INTEGER,
    steps INTEGER,
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    meta_json JSONB
);
```

### Agent Steps
Individual tool invocations within an agent run.

```sql
CREATE TABLE agent_steps (
    id UUID PRIMARY KEY,
    run_id UUID REFERENCES agent_runs(id),
    step_no INTEGER,
    tool VARCHAR(100), -- llm_call, web_search, db_query, etc.
    input_hash VARCHAR(64), -- SHA256 for deduplication
    tokens_in INTEGER,
    tokens_out INTEGER,
    cost_usd DECIMAL(10, 6),
    duration_ms INTEGER,
    status VARCHAR(50),
    output_ref VARCHAR(255),
    error_message TEXT
);
```

### Tool Artifacts
Storage for step outputs and intermediate results.

```sql
CREATE TABLE tool_artifacts (
    id UUID PRIMARY KEY,
    step_id UUID REFERENCES agent_steps(id),
    kind VARCHAR(50), -- llm_response, search_results, analysis
    ref VARCHAR(255), -- storage reference or inline data
    meta_json JSONB,
    size_bytes INTEGER
);
```

## Metrics Tracked

### Per-Run Metrics
- **Total Cost**: Cumulative USD spend for the run
- **Token Usage**: Input and output tokens across all steps
- **Execution Time**: Start to finish duration
- **Step Count**: Number of tool invocations
- **Status**: Final outcome (completed, failed, budget_exceeded)

### Per-Step Metrics
- **Tool Performance**: Duration and cost per tool type
- **Token Efficiency**: Input/output ratio per step
- **Error Rates**: Failure percentage by tool
- **Latency Distribution**: P50, P95, P99 response times

### Budget Metrics
- **Budget Utilization**: Percentage of limits used
- **Cost Efficiency**: Output value per dollar spent
- **Violation Frequency**: Rate of budget breaches
- **Emergency Stops**: Critical failure count

## Usage Examples

### Basic Agent Execution
```typescript
const agenticOrchestrator = new AgenticOrchestrator(supabase, env)

const result = await agenticOrchestrator.processJobWithAgent(job)

if (result.success) {
  console.log('Job completed successfully:', result.result)
} else {
  console.error('Job failed:', result.error)
}
```

### Custom Agent Run
```typescript
const agentRunner = new AgentRunner(supabase, telemetry, config)

const result = await agentRunner.executeJob(
  orgId,
  jobId,
  'custom-planner',
  async (runner) => {
    // Step 1: Fetch data
    const data = await runner.executeStep(runId, {
      tool: 'db_query',
      input: { query: 'SELECT * FROM content' }
    })

    // Step 2: Analyze with AI
    const analysis = await runner.executeStep(runId, {
      tool: 'llm_call',
      input: { 
        model: 'claude-3.7-sonnet',
        prompt: 'Analyze this content',
        content: data.output
      }
    })

    return analysis.output
  }
)
```

### Budget Monitoring
```typescript
const governor = new Governor(config)

await governor.executeWithBudget(runId, async () => {
  // Check budget before expensive operation
  if (!governor.canProceed(runId, 0.25)) {
    throw new Error('Insufficient budget for operation')
  }

  // Execute steps with automatic budget enforcement
  await governor.validateStep(runId, stepNo, invocation)
  
  const status = governor.getBudgetStatus(runId)
  console.log(`Budget remaining: $${status.cost.remaining}`)
})
```

### Result Validation
```typescript
const critic = new Critic({ minConfidence: 0.8 })

const validation = await critic.validateCitationResult(result)

if (!validation.valid) {
  console.error('Validation failed:', validation.errors)
  return
}

if (validation.confidence < 0.9) {
  console.warn('Low confidence result:', validation.warnings)
}

console.log('Validated result with confidence:', validation.confidence)
```

## Tool Types

### Available Tools
- **llm_call**: Language model inference
- **web_search**: Internet search queries
- **db_query**: Database operations
- **citation_check**: AI platform citation verification
- **content_analysis**: Text analysis and scoring
- **file_read/write**: File system operations
- **http_request**: External API calls

### Cost Estimates (USD)
- **llm_call**: $0.05 (varies by model and tokens)
- **web_search**: $0.01
- **db_query**: $0.001
- **citation_check**: $0.02
- **content_analysis**: $0.03
- **file_operations**: $0.001-0.002
- **http_request**: $0.005

## Monitoring and Alerts

### Telemetry Events
- `agent_run_completed`: Successful execution
- `agent_budget_exceeded`: Budget violation
- `citemind_job_enqueued`: Job queued for processing
- `analytics_export`: Data export operations

### Error Tracking
- Automatic Sentry integration for failures
- PII-safe error context
- Proper org_id/run_id tagging
- Redacted sensitive payloads

### Performance Metrics
- Run duration percentiles
- Cost per job type analysis
- Step-level performance breakdown
- Budget utilization trends

## Configuration

### Required Environment Variables
```bash
# Core Configuration
CITEMIND_ENABLED=true
AGENT_MAX_STEPS=12
AGENT_COST_CAP_USD=0.35

# AI Models
MODEL_PRIMARY=anthropic/claude-3.7-sonnet
MODEL_FALLBACK=anthropic/haiku-latest

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Telemetry (Optional)
POSTHOG_API_KEY=your-posthog-key
SENTRY_DSN=your-sentry-dsn
```

### Development Configuration
```bash
# Disable telemetry in development
NODE_ENV=development
DISABLE_TELEMETRY=true

# Lower limits for testing
AGENT_MAX_STEPS=5
AGENT_COST_CAP_USD=0.10
```

## Troubleshooting

### Common Issues

**Budget Exceeded Errors**
- Check `AGENT_COST_CAP_USD` setting
- Review cost estimation accuracy
- Monitor token usage patterns

**High Latency**
- Optimize database queries
- Implement step result caching
- Use faster fallback models

**Validation Failures**
- Review Critic configuration
- Check result schema compliance
- Validate confidence thresholds

**Memory Issues**
- Monitor artifact storage size
- Implement artifact cleanup
- Use R2 for large outputs

### Debug Mode
```typescript
const agentRunner = new AgentRunner(supabase, telemetry, {
  ...config,
  DEBUG: true
})
```

### Monitoring Queries
```sql
-- Recent agent runs performance
SELECT 
  planner,
  status,
  AVG(cost_usd) as avg_cost,
  AVG(steps) as avg_steps,
  AVG(EXTRACT(EPOCH FROM (finished_at - started_at))) as avg_duration_sec
FROM agent_runs 
WHERE started_at > NOW() - INTERVAL '24 hours'
GROUP BY planner, status;

-- Budget utilization trends
SELECT 
  DATE(started_at) as date,
  COUNT(*) as total_runs,
  COUNT(*) FILTER (WHERE status = 'budget_exceeded') as budget_violations,
  AVG(cost_usd) as avg_cost
FROM agent_runs
WHERE started_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(started_at)
ORDER BY date;
```

## Best Practices

1. **Budget Management**
   - Set conservative initial limits
   - Monitor utilization patterns
   - Implement cost alerts

2. **Error Handling**
   - Always handle budget exceptions
   - Implement retry with backoff
   - Log failures with context

3. **Performance**
   - Cache frequently accessed data
   - Use appropriate model sizes
   - Optimize step sequences

4. **Security**
   - Never log sensitive inputs
   - Sanitize artifact content
   - Use least-privilege access

5. **Observability**
   - Track all key metrics
   - Set up monitoring dashboards
   - Alert on anomalies
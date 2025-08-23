# DevOps Scripts

This directory contains scripts for CI/CD pipeline automation and observability.

## PostHog Delivery Telemetry

### `ph-event.ts`

Sends structured delivery pipeline events to PostHog for observability and analytics.

#### Usage

```bash
# Send PR opened event
npx tsx scripts/devops/ph-event.ts dev_pr_opened --baseSha main --headSha feature-branch

# Send CI completion events
npx tsx scripts/devops/ph-event.ts dev_ci_passed --previewUrl https://preview.app.dev
npx tsx scripts/devops/ph-event.ts dev_ci_failed --failingJobs "test,build,security"

# Send integration queue events
npx tsx scripts/devops/ph-event.ts dev_integration_queue_entered --integrationBranch integ/batch-12345
npx tsx scripts/devops/ph-event.ts dev_integration_ci_passed
```

#### Event Types

| Event | Description | Trigger |
|-------|-------------|---------|
| `dev_pr_opened` | PR created or updated | PR opened/synchronized |
| `dev_ci_started` | CI pipeline started | Workflow run started |
| `dev_ci_passed` | CI pipeline passed | All checks green |
| `dev_ci_failed` | CI pipeline failed | Any check failed |
| `dev_pr_merged` | PR merged to main | PR merged |
| `dev_integration_queue_entered` | PR entered integration queue | Label added |
| `dev_integration_ci_passed` | Integration CI passed | Integration checks green |
| `dev_integration_ci_failed` | Integration CI failed | Integration checks failed |

#### Event Schema

```typescript
interface DeliveryEvent {
  event: 'dev_pr_opened' | 'dev_ci_started' | // ... other events
  properties: {
    pr: number                    // PR number
    sha: string                   // Commit SHA
    branch: string               // Branch name
    actor: string                // GitHub username
    size: 'XS|S|M|L|XL'         // PR size by lines changed
    contracts_touched: boolean    // API/contract files changed
    endpoints_touched: boolean    // API endpoint files changed
    ci_duration_s?: number       // CI runtime in seconds
    est_cost_usd?: number        // Estimated CI cost
    preview_url?: string         // Cloudflare Pages preview
    worker_preview_url?: string  // Worker preview
    integration_branch?: string  // Integration branch name
    failing_jobs?: string[]      // Failed job names
  }
}
```

#### Size Classification

- **XS**: < 50 lines changed
- **S**: 50-199 lines changed
- **M**: 200-499 lines changed  
- **L**: 500-999 lines changed
- **XL**: ≥ 1000 lines changed

#### Contract Detection

Files that trigger `contracts_touched: true`:
- `packages/contracts/**`
- `packages/types/**`
- `/api/**/routes/`

Files that trigger `endpoints_touched: true`:
- `/routes/**`
- `/api/**`
- Files containing `openapi` or `schema`

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTHOG_API_KEY` | Yes | PostHog project API key |
| `POSTHOG_HOST` | No | PostHog host (default: app.posthog.com) |
| `GITHUB_*` | Auto | GitHub Actions context variables |

#### GitHub Actions Integration

Set `CI_START_TIME` at workflow start for duration tracking:

```yaml
- name: Set CI Start Time
  run: echo "CI_START_TIME=$(date +%s000)" >> $GITHUB_ENV

- name: Send telemetry
  run: npx tsx scripts/devops/ph-event.ts dev_ci_started
  env:
    POSTHOG_API_KEY: ${{ secrets.POSTHOG_API_KEY }}
```

#### Cost Estimation

Base costs by PR size:
- **XS**: $0.05
- **S**: $0.10  
- **M**: $0.15
- **L**: $0.20
- **XL**: $0.25

Additional costs:
- Contract changes: +$0.05
- Endpoint changes: +$0.03

#### Error Handling

The script never fails CI on telemetry errors. If PostHog is unavailable:
- Logs the event data locally
- Continues with success exit code
- Warns about telemetry being disabled

#### Local Testing

```bash
# Test without sending (when POSTHOG_API_KEY not set)
export GITHUB_ACTOR=testuser
export GITHUB_SHA=abc123
export GITHUB_HEAD_REF=feature-branch
export GITHUB_PR_NUMBER=42

npx tsx scripts/devops/ph-event.ts dev_pr_opened
```

This will output the event data without sending to PostHog.
/**
 * Governor Tests - Budget enforcement and execution control
 */

import { Governor } from '../governor'
import type { AgentConfig } from '../agent-runner'

describe('Governor', () => {
  let governor: Governor
  let config: AgentConfig

  beforeEach(() => {
    config = {
      CITEMIND_ENABLED: true,
      AGENT_MAX_STEPS: 5,
      AGENT_COST_CAP_USD: 0.50,
      MODEL_PRIMARY: 'anthropic/claude-3.7-sonnet',
      MODEL_FALLBACK: 'anthropic/haiku-latest'
    }
    governor = new Governor(config)
  })

  describe('Budget Enforcement', () => {
    it('should allow execution within budget limits', async () => {
      const runId = 'test-run-1'
      
      let executorCalled = false
      const result = await governor.executeWithBudget(runId, async () => {
        executorCalled = true
        return 'success'
      })

      expect(result).toBe('success')
      expect(executorCalled).toBe(true)
    })

    it('should track step budget correctly', async () => {
      const runId = 'test-run-2'
      
      await governor.executeWithBudget(runId, async () => {
        // Step 1 - should pass
        await governor.validateStep(runId, 1, {
          tool: 'db_query',
          input: { query: 'SELECT * FROM test' }
        })

        // Step 2 - should pass
        await governor.validateStep(runId, 2, {
          tool: 'llm_call',
          input: { prompt: 'Test prompt' }
        })

        const budgetStatus = governor.getBudgetStatus(runId)
        expect(budgetStatus?.steps.used).toBe(2)
        expect(budgetStatus?.steps.remaining).toBe(3)

        return 'completed'
      })
    })

    it('should reject steps exceeding step limit', async () => {
      const runId = 'test-run-3'
      
      await expect(
        governor.executeWithBudget(runId, async () => {
          // Try to execute step beyond limit
          await governor.validateStep(runId, config.AGENT_MAX_STEPS + 1, {
            tool: 'db_query',
            input: { query: 'SELECT * FROM test' }
          })
        })
      ).rejects.toThrow('Budget exceeded')
    })

    it('should reject steps exceeding cost limit', async () => {
      const runId = 'test-run-4'
      
      await expect(
        governor.executeWithBudget(runId, async () => {
          // Execute a high-cost step that exceeds budget
          await governor.validateStep(runId, 1, {
            tool: 'llm_call',
            input: { 
              prompt: 'A'.repeat(10000), // Large input to trigger high cost
              model: 'expensive-model'
            }
          })
        })
      ).rejects.toThrow('Budget exceeded')
    })
  })

  describe('Cost Estimation', () => {
    it('should estimate different costs for different tools', async () => {
      const runId = 'test-run-5'
      
      await governor.executeWithBudget(runId, async () => {
        // DB query should be cheap
        await governor.validateStep(runId, 1, {
          tool: 'db_query',
          input: { query: 'SELECT 1' }
        })

        // LLM call should be more expensive
        await governor.validateStep(runId, 2, {
          tool: 'llm_call',
          input: { prompt: 'Analyze this text' }
        })

        const budgetStatus = governor.getBudgetStatus(runId)
        expect(budgetStatus?.cost.used).toBeGreaterThan(0)
        expect(budgetStatus?.cost.remaining).toBeLessThan(config.AGENT_COST_CAP_USD)

        return 'success'
      })
    })

    it('should scale cost with input size', async () => {
      const runId = 'test-run-6'
      let smallInputCost = 0
      let largeInputCost = 0
      
      await governor.executeWithBudget(runId, async () => {
        // Small input
        await governor.validateStep(runId, 1, {
          tool: 'llm_call',
          input: { prompt: 'Hi' }
        })
        smallInputCost = governor.getBudgetStatus(runId)?.cost.used || 0

        // Large input
        await governor.validateStep(runId, 2, {
          tool: 'llm_call',
          input: { prompt: 'A'.repeat(5000) }
        })
        largeInputCost = (governor.getBudgetStatus(runId)?.cost.used || 0) - smallInputCost

        return 'success'
      })

      expect(largeInputCost).toBeGreaterThan(smallInputCost)
    })
  })

  describe('Budget Status', () => {
    it('should return null for non-existent run', () => {
      const status = governor.getBudgetStatus('non-existent')
      expect(status).toBeNull()
    })

    it('should track remaining budget correctly', async () => {
      const runId = 'test-run-7'
      
      await governor.executeWithBudget(runId, async () => {
        await governor.validateStep(runId, 1, {
          tool: 'db_query',
          input: { query: 'SELECT 1' }
        })

        const status = governor.getBudgetStatus(runId)
        expect(status?.steps.remaining).toBe(config.AGENT_MAX_STEPS - 1)
        expect(status?.cost.remaining).toBeLessThan(config.AGENT_COST_CAP_USD)
        expect(status?.cost.remaining).toBeGreaterThan(0)

        return 'success'
      })
    })
  })

  describe('Emergency Stop', () => {
    it('should handle emergency stop correctly', async () => {
      const runId = 'test-run-8'
      
      await expect(
        governor.emergencyStop(runId, 'Test emergency')
      ).rejects.toThrow('Emergency stop: Test emergency')
    })
  })

  describe('Proceed Check', () => {
    it('should allow proceeding with small additional cost', async () => {
      const runId = 'test-run-9'
      
      await governor.executeWithBudget(runId, async () => {
        await governor.validateStep(runId, 1, {
          tool: 'db_query',
          input: { query: 'SELECT 1' }
        })

        const canProceed = governor.canProceed(runId, 0.01)
        expect(canProceed).toBe(true)

        return 'success'
      })
    })

    it('should reject proceeding with excessive additional cost', async () => {
      const runId = 'test-run-10'
      
      await governor.executeWithBudget(runId, async () => {
        await governor.validateStep(runId, 1, {
          tool: 'db_query',
          input: { query: 'SELECT 1' }
        })

        const canProceed = governor.canProceed(runId, 1.0) // Way over budget
        expect(canProceed).toBe(false)

        return 'success'
      })
    })
  })
})
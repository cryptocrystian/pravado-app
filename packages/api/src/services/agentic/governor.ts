/**
 * Governor - Budget enforcement and execution control
 * Ensures agent runs stay within configured limits and fail closed on violations
 */

import type { AgentConfig, ToolInvocation } from './agent-runner'

export interface BudgetViolation {
  type: 'steps' | 'cost'
  limit: number
  current: number
  message: string
}

export class Governor {
  private config: AgentConfig
  private runBudgets: Map<string, { steps: number; cost: number }>

  constructor(config: AgentConfig) {
    this.config = config
    this.runBudgets = new Map()
  }

  /**
   * Execute function with budget enforcement
   */
  async executeWithBudget<T>(
    runId: string,
    executor: () => Promise<T>
  ): Promise<T> {
    // Initialize budget tracking for this run
    this.runBudgets.set(runId, { steps: 0, cost: 0 })
    
    try {
      const result = await executor()
      return result
    } finally {
      // Clean up budget tracking
      this.runBudgets.delete(runId)
    }
  }

  /**
   * Validate step before execution
   */
  async validateStep(
    runId: string,
    stepNo: number,
    invocation: ToolInvocation
  ): Promise<void> {
    const budget = this.runBudgets.get(runId)
    if (!budget) {
      throw new Error(`No budget tracking for run ${runId}`)
    }

    // Check step limit
    if (stepNo > this.config.AGENT_MAX_STEPS) {
      const violation: BudgetViolation = {
        type: 'steps',
        limit: this.config.AGENT_MAX_STEPS,
        current: stepNo,
        message: `Step limit exceeded: ${stepNo} > ${this.config.AGENT_MAX_STEPS}`
      }
      
      await this.handleBudgetViolation(runId, violation)
      throw new Error(`Budget exceeded: ${violation.message}`)
    }

    // Estimate cost for this step
    const estimatedCost = this.estimateStepCost(invocation)
    const projectedTotal = budget.cost + estimatedCost

    if (projectedTotal > this.config.AGENT_COST_CAP_USD) {
      const violation: BudgetViolation = {
        type: 'cost',
        limit: this.config.AGENT_COST_CAP_USD,
        current: projectedTotal,
        message: `Cost limit would be exceeded: $${projectedTotal.toFixed(4)} > $${this.config.AGENT_COST_CAP_USD}`
      }
      
      await this.handleBudgetViolation(runId, violation)
      throw new Error(`Budget exceeded: ${violation.message}`)
    }

    // Update budget tracking
    budget.steps = stepNo
    budget.cost += estimatedCost
  }

  /**
   * Update actual cost after step completion
   */
  async updateActualCost(runId: string, actualCost: number): Promise<void> {
    const budget = this.runBudgets.get(runId)
    if (budget) {
      budget.cost = actualCost
      
      // Final cost check
      if (actualCost > this.config.AGENT_COST_CAP_USD) {
        const violation: BudgetViolation = {
          type: 'cost',
          limit: this.config.AGENT_COST_CAP_USD,
          current: actualCost,
          message: `Final cost exceeded limit: $${actualCost.toFixed(4)} > $${this.config.AGENT_COST_CAP_USD}`
        }
        
        await this.handleBudgetViolation(runId, violation)
      }
    }
  }

  /**
   * Handle budget violations
   */
  private async handleBudgetViolation(
    runId: string,
    violation: BudgetViolation
  ): Promise<void> {
    console.error(`Budget violation for run ${runId}:`, violation)
    
    // Log violation for observability
    // In production, would also send to monitoring systems
  }

  /**
   * Estimate cost for a tool invocation
   */
  private estimateStepCost(invocation: ToolInvocation): number {
    // Cost estimation based on tool type
    const costEstimates: Record<string, number> = {
      'llm_call': 0.05, // High for LLM calls
      'web_search': 0.01, // Medium for API calls
      'db_query': 0.001, // Low for DB operations
      'file_read': 0.001,
      'file_write': 0.002,
      'http_request': 0.005,
      'citation_check': 0.02,
      'content_analysis': 0.03
    }

    const baseCost = costEstimates[invocation.tool] || 0.01
    
    // Adjust based on input size
    const inputSize = JSON.stringify(invocation.input).length
    const sizeMultiplier = Math.max(1, inputSize / 1000) // Scale with input size
    
    return baseCost * sizeMultiplier
  }

  /**
   * Get current budget status for a run
   */
  getBudgetStatus(runId: string): {
    steps: { used: number; limit: number; remaining: number }
    cost: { used: number; limit: number; remaining: number }
  } | null {
    const budget = this.runBudgets.get(runId)
    if (!budget) return null

    return {
      steps: {
        used: budget.steps,
        limit: this.config.AGENT_MAX_STEPS,
        remaining: this.config.AGENT_MAX_STEPS - budget.steps
      },
      cost: {
        used: budget.cost,
        limit: this.config.AGENT_COST_CAP_USD,
        remaining: this.config.AGENT_COST_CAP_USD - budget.cost
      }
    }
  }

  /**
   * Check if run can proceed with additional cost
   */
  canProceed(runId: string, additionalCost: number = 0): boolean {
    const budget = this.runBudgets.get(runId)
    if (!budget) return false

    const projectedCost = budget.cost + additionalCost
    return projectedCost <= this.config.AGENT_COST_CAP_USD
  }

  /**
   * Emergency stop for a run
   */
  async emergencyStop(runId: string, reason: string): Promise<void> {
    console.error(`Emergency stop for run ${runId}: ${reason}`)
    
    // Clean up budget tracking
    this.runBudgets.delete(runId)
    
    // In production, would notify monitoring systems
    throw new Error(`Emergency stop: ${reason}`)
  }
}
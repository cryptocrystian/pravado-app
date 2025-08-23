/**
 * Critic - Result validation and confidence assessment
 * Validates outputs before persistence and provides quality gates
 */

export interface ValidationResult {
  valid: boolean
  confidence: number // 0.0 to 1.0
  errors: string[]
  warnings: string[]
  metadata?: Record<string, unknown>
}

export interface CriticConfig {
  minConfidence: number
  requireSchema: boolean
  enableQualityChecks: boolean
}

export class Critic {
  private config: CriticConfig

  constructor(config?: Partial<CriticConfig>) {
    this.config = {
      minConfidence: 0.7,
      requireSchema: true,
      enableQualityChecks: true,
      ...config
    }
  }

  /**
   * Validate agent execution result
   */
  async validateResult(result: unknown): Promise<ValidationResult> {
    const validation: ValidationResult = {
      valid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      metadata: {}
    }

    // Basic structure validation
    if (!this.validateBasicStructure(result, validation)) {
      return validation
    }

    // Schema validation
    if (this.config.requireSchema && !this.validateSchema(result, validation)) {
      return validation
    }

    // Quality checks
    if (this.config.enableQualityChecks) {
      await this.performQualityChecks(result, validation)
    }

    // Confidence assessment
    validation.confidence = this.assessConfidence(result, validation)

    // Final validation based on confidence threshold
    if (validation.confidence < this.config.minConfidence) {
      validation.valid = false
      validation.errors.push(`Confidence ${validation.confidence.toFixed(2)} below threshold ${this.config.minConfidence}`)
    }

    return validation
  }

  /**
   * Validate citation analysis results
   */
  async validateCitationResult(result: unknown): Promise<ValidationResult> {
    const validation: ValidationResult = {
      valid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      metadata: { result_type: 'citation_analysis' }
    }

    if (!result || typeof result !== 'object') {
      validation.valid = false
      validation.errors.push('Citation result must be an object')
      return validation
    }

    const citationResult = result as Record<string, unknown>

    // Required fields for citation results
    const requiredFields = ['platform', 'query', 'citation_found', 'timestamp']
    for (const field of requiredFields) {
      if (!(field in citationResult)) {
        validation.errors.push(`Missing required field: ${field}`)
      }
    }

    // Validate citation probability if present
    if ('citation_probability' in citationResult) {
      const prob = citationResult.citation_probability as number
      if (typeof prob !== 'number' || prob < 0 || prob > 1) {
        validation.errors.push('citation_probability must be a number between 0 and 1')
      }
    }

    // Validate platform
    if ('platform' in citationResult) {
      const validPlatforms = ['chatgpt', 'claude', 'perplexity', 'gemini']
      if (!validPlatforms.includes(citationResult.platform as string)) {
        validation.warnings.push(`Unknown platform: ${citationResult.platform}`)
      }
    }

    validation.valid = validation.errors.length === 0
    validation.confidence = this.assessCitationConfidence(citationResult, validation)

    return validation
  }

  /**
   * Validate content analysis results
   */
  async validateContentAnalysis(result: unknown): Promise<ValidationResult> {
    const validation: ValidationResult = {
      valid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      metadata: { result_type: 'content_analysis' }
    }

    if (!result || typeof result !== 'object') {
      validation.valid = false
      validation.errors.push('Content analysis result must be an object')
      return validation
    }

    const analysisResult = result as Record<string, unknown>

    // Check for analysis metrics
    const expectedMetrics = ['readability_score', 'sentiment', 'key_topics', 'word_count']
    for (const metric of expectedMetrics) {
      if (!(metric in analysisResult)) {
        validation.warnings.push(`Missing analysis metric: ${metric}`)
      }
    }

    // Validate readability score
    if ('readability_score' in analysisResult) {
      const score = analysisResult.readability_score as number
      if (typeof score !== 'number' || score < 0 || score > 100) {
        validation.errors.push('readability_score must be a number between 0 and 100')
      }
    }

    // Validate sentiment
    if ('sentiment' in analysisResult) {
      const sentiment = analysisResult.sentiment as Record<string, unknown>
      if (!sentiment || typeof sentiment !== 'object') {
        validation.errors.push('sentiment must be an object')
      } else if (!('polarity' in sentiment) || !('confidence' in sentiment)) {
        validation.errors.push('sentiment must have polarity and confidence fields')
      }
    }

    validation.valid = validation.errors.length === 0
    validation.confidence = this.assessAnalysisConfidence(analysisResult, validation)

    return validation
  }

  /**
   * Basic structure validation
   */
  private validateBasicStructure(result: unknown, validation: ValidationResult): boolean {
    if (result === null || result === undefined) {
      validation.valid = false
      validation.errors.push('Result cannot be null or undefined')
      return false
    }

    if (typeof result === 'object' && Array.isArray(result) && result.length === 0) {
      validation.warnings.push('Result is an empty array')
    }

    return true
  }

  /**
   * Schema validation
   */
  private validateSchema(result: unknown, validation: ValidationResult): boolean {
    // Basic schema validation - in production would use JSON Schema
    if (typeof result !== 'object' || result === null) {
      validation.errors.push('Result must be an object')
      return false
    }

    const resultObj = result as Record<string, unknown>
    
    // Check for basic success indicator
    if (!('success' in resultObj) && !('error' in resultObj)) {
      validation.warnings.push('Result should have success or error field')
    }

    return validation.errors.length === 0
  }

  /**
   * Quality checks
   */
  private async performQualityChecks(result: unknown, validation: ValidationResult): Promise<void> {
    if (typeof result !== 'object' || result === null) return

    const resultObj = result as Record<string, unknown>

    // Check for completeness
    const completenessScore = this.assessCompleteness(resultObj)
    if (completenessScore < 0.8) {
      validation.warnings.push(`Low completeness score: ${completenessScore.toFixed(2)}`)
    }

    // Check for consistency
    const consistencyIssues = this.checkConsistency(resultObj)
    if (consistencyIssues.length > 0) {
      validation.warnings.push(...consistencyIssues)
    }

    // Store quality metrics
    validation.metadata = {
      ...validation.metadata,
      completeness_score: completenessScore,
      consistency_issues: consistencyIssues.length
    }
  }

  /**
   * Assess overall confidence
   */
  private assessConfidence(result: unknown, validation: ValidationResult): number {
    let confidence = 1.0

    // Reduce confidence for each error
    confidence -= validation.errors.length * 0.3

    // Reduce confidence for warnings
    confidence -= validation.warnings.length * 0.1

    // Factor in completeness if available
    if (validation.metadata?.completeness_score) {
      confidence *= validation.metadata.completeness_score as number
    }

    return Math.max(0, Math.min(1, confidence))
  }

  /**
   * Assess citation result confidence
   */
  private assessCitationConfidence(result: Record<string, unknown>, validation: ValidationResult): number {
    let confidence = 0.8 // Base confidence for citation results

    // Boost confidence if citation was found
    if (result.citation_found === true) {
      confidence += 0.15
    }

    // Boost confidence if relevance score is high
    if (typeof result.relevance_score === 'number' && result.relevance_score > 0.8) {
      confidence += 0.05
    }

    // Reduce confidence for errors/warnings
    confidence -= validation.errors.length * 0.2
    confidence -= validation.warnings.length * 0.05

    return Math.max(0, Math.min(1, confidence))
  }

  /**
   * Assess content analysis confidence
   */
  private assessAnalysisConfidence(result: Record<string, unknown>, validation: ValidationResult): number {
    let confidence = 0.7 // Base confidence for analysis results

    // Count available metrics
    const expectedMetrics = ['readability_score', 'sentiment', 'key_topics', 'word_count']
    const availableMetrics = expectedMetrics.filter(metric => metric in result).length
    confidence += (availableMetrics / expectedMetrics.length) * 0.2

    // Reduce confidence for errors/warnings
    confidence -= validation.errors.length * 0.25
    confidence -= validation.warnings.length * 0.05

    return Math.max(0, Math.min(1, confidence))
  }

  /**
   * Assess completeness of result
   */
  private assessCompleteness(result: Record<string, unknown>): number {
    const expectedFields = ['timestamp', 'status']
    const totalFields = Object.keys(result).length
    const expectedCount = expectedFields.filter(field => field in result).length
    
    if (totalFields === 0) return 0
    
    return (expectedCount + (totalFields - expectedFields.length)) / (totalFields + expectedFields.length)
  }

  /**
   * Check for consistency issues
   */
  private checkConsistency(result: Record<string, unknown>): string[] {
    const issues: string[] = []

    // Check timestamp consistency
    if ('timestamp' in result && 'created_at' in result) {
      const timestamp = result.timestamp as string
      const createdAt = result.created_at as string
      
      if (Math.abs(new Date(timestamp).getTime() - new Date(createdAt).getTime()) > 60000) {
        issues.push('Timestamp and created_at differ by more than 1 minute')
      }
    }

    // Check success/error consistency
    if ('success' in result && 'error' in result) {
      if (result.success === true && result.error) {
        issues.push('Cannot have success=true with error message')
      }
      if (result.success === false && !result.error) {
        issues.push('success=false should have error message')
      }
    }

    return issues
  }
}
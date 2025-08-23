/**
 * Critic Tests - Result validation and confidence assessment
 */

import { Critic } from '../critic'

describe('Critic', () => {
  let critic: Critic

  beforeEach(() => {
    critic = new Critic({
      minConfidence: 0.7,
      requireSchema: true,
      enableQualityChecks: true
    })
  })

  describe('Basic Validation', () => {
    it('should validate valid results', async () => {
      const result = {
        success: true,
        data: { message: 'Operation completed' },
        timestamp: new Date().toISOString()
      }

      const validation = await critic.validateResult(result)
      
      expect(validation.valid).toBe(true)
      expect(validation.confidence).toBeGreaterThan(0.7)
      expect(validation.errors).toHaveLength(0)
    })

    it('should reject null or undefined results', async () => {
      const nullValidation = await critic.validateResult(null)
      expect(nullValidation.valid).toBe(false)
      expect(nullValidation.errors).toContain('Result cannot be null or undefined')

      const undefinedValidation = await critic.validateResult(undefined)
      expect(undefinedValidation.valid).toBe(false)
      expect(undefinedValidation.errors).toContain('Result cannot be null or undefined')
    })

    it('should warn about empty arrays', async () => {
      const result: any[] = []
      const validation = await critic.validateResult(result)
      
      expect(validation.warnings).toContain('Result is an empty array')
    })

    it('should reject non-object results when schema validation is enabled', async () => {
      const validation = await critic.validateResult('string result')
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('Result must be an object')
    })
  })

  describe('Citation Result Validation', () => {
    it('should validate valid citation results', async () => {
      const result = {
        platform: 'chatgpt',
        query: 'test query',
        citation_found: true,
        timestamp: new Date().toISOString(),
        citation_probability: 0.85,
        relevance_score: 0.9
      }

      const validation = await critic.validateCitationResult(result)
      
      expect(validation.valid).toBe(true)
      expect(validation.confidence).toBeGreaterThan(0.8)
      expect(validation.metadata?.result_type).toBe('citation_analysis')
    })

    it('should require essential citation fields', async () => {
      const result = {
        platform: 'chatgpt'
        // Missing required fields
      }

      const validation = await critic.validateCitationResult(result)
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('Missing required field: query')
      expect(validation.errors).toContain('Missing required field: citation_found')
      expect(validation.errors).toContain('Missing required field: timestamp')
    })

    it('should validate citation probability range', async () => {
      const invalidResult = {
        platform: 'chatgpt',
        query: 'test query',
        citation_found: true,
        timestamp: new Date().toISOString(),
        citation_probability: 1.5 // Invalid: > 1
      }

      const validation = await critic.validateCitationResult(invalidResult)
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('citation_probability must be a number between 0 and 1')
    })

    it('should warn about unknown platforms', async () => {
      const result = {
        platform: 'unknown-ai',
        query: 'test query',
        citation_found: true,
        timestamp: new Date().toISOString()
      }

      const validation = await critic.validateCitationResult(result)
      
      expect(validation.warnings).toContain('Unknown platform: unknown-ai')
    })

    it('should boost confidence for found citations with high relevance', async () => {
      const highRelevanceResult = {
        platform: 'claude',
        query: 'test query',
        citation_found: true,
        timestamp: new Date().toISOString(),
        relevance_score: 0.95
      }

      const validation = await critic.validateCitationResult(highRelevanceResult)
      expect(validation.confidence).toBeGreaterThan(0.9)
    })
  })

  describe('Content Analysis Validation', () => {
    it('should validate complete content analysis', async () => {
      const result = {
        readability_score: 85,
        sentiment: {
          polarity: 0.3,
          confidence: 0.8
        },
        key_topics: ['technology', 'innovation'],
        word_count: 500
      }

      const validation = await critic.validateContentAnalysis(result)
      
      expect(validation.valid).toBe(true)
      expect(validation.confidence).toBeGreaterThan(0.7)
      expect(validation.metadata?.result_type).toBe('content_analysis')
    })

    it('should validate readability score range', async () => {
      const invalidResult = {
        readability_score: 150, // Invalid: > 100
        sentiment: { polarity: 0, confidence: 0.5 },
        key_topics: [],
        word_count: 100
      }

      const validation = await critic.validateContentAnalysis(invalidResult)
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('readability_score must be a number between 0 and 100')
    })

    it('should validate sentiment structure', async () => {
      const invalidResult = {
        readability_score: 75,
        sentiment: 'positive', // Invalid: should be object
        key_topics: ['test'],
        word_count: 200
      }

      const validation = await critic.validateContentAnalysis(invalidResult)
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('sentiment must be an object')
    })

    it('should require sentiment fields', async () => {
      const invalidResult = {
        readability_score: 75,
        sentiment: { polarity: 0.5 }, // Missing confidence
        key_topics: ['test'],
        word_count: 200
      }

      const validation = await critic.validateContentAnalysis(invalidResult)
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('sentiment must have polarity and confidence fields')
    })

    it('should warn about missing metrics', async () => {
      const incompleteResult = {
        readability_score: 75
        // Missing other expected metrics
      }

      const validation = await critic.validateContentAnalysis(incompleteResult)
      
      expect(validation.warnings).toContain('Missing analysis metric: sentiment')
      expect(validation.warnings).toContain('Missing analysis metric: key_topics')
      expect(validation.warnings).toContain('Missing analysis metric: word_count')
    })
  })

  describe('Confidence Assessment', () => {
    it('should reduce confidence for errors', async () => {
      const result = 'invalid result' // Will cause errors

      const validation = await critic.validateResult(result)
      
      expect(validation.confidence).toBeLessThan(0.7)
      expect(validation.valid).toBe(false)
    })

    it('should reduce confidence for warnings', async () => {
      const result = {
        success: true,
        // Missing timestamp will cause warning
      }

      const validation = await critic.validateResult(result)
      
      expect(validation.confidence).toBeLessThan(1.0)
    })

    it('should reject results below minimum confidence threshold', async () => {
      const poorQualityResult = null // Will have very low confidence

      const validation = await critic.validateResult(poorQualityResult)
      
      expect(validation.valid).toBe(false)
      expect(validation.confidence).toBeLessThan(0.7)
    })
  })

  describe('Quality Checks', () => {
    it('should assess completeness correctly', async () => {
      const completeResult = {
        success: true,
        timestamp: new Date().toISOString(),
        data: { key: 'value' },
        metadata: { version: '1.0' }
      }

      const validation = await critic.validateResult(completeResult)
      
      expect(validation.metadata?.completeness_score).toBeGreaterThan(0.8)
    })

    it('should detect consistency issues', async () => {
      const inconsistentResult = {
        success: true,
        error: 'This should not exist when success is true',
        timestamp: new Date().toISOString()
      }

      const validation = await critic.validateResult(inconsistentResult)
      
      expect(validation.warnings).toContain('Cannot have success=true with error message')
    })

    it('should detect timestamp inconsistencies', async () => {
      const now = new Date()
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      
      const inconsistentResult = {
        timestamp: now.toISOString(),
        created_at: hourAgo.toISOString()
      }

      const validation = await critic.validateResult(inconsistentResult)
      
      expect(validation.warnings).toContain('Timestamp and created_at differ by more than 1 minute')
    })
  })

  describe('Configuration', () => {
    it('should respect custom minimum confidence', async () => {
      const strictCritic = new Critic({ minConfidence: 0.9 })
      
      const borderlineResult = {
        success: true
        // Minimal result that would normally pass
      }

      const validation = await strictCritic.validateResult(borderlineResult)
      
      // Should fail with high confidence requirement
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain(expect.stringContaining('Confidence'))
    })

    it('should allow disabling schema validation', async () => {
      const lenientCritic = new Critic({ requireSchema: false })
      
      const stringResult = 'just a string'
      const validation = await lenientCritic.validateResult(stringResult)
      
      // Should pass without schema validation
      expect(validation.valid).toBe(true)
    })

    it('should allow disabling quality checks', async () => {
      const basicCritic = new Critic({ enableQualityChecks: false })
      
      const result = {
        success: true,
        error: 'inconsistent but quality checks disabled'
      }

      const validation = await basicCritic.validateResult(result)
      
      // Should not have consistency warnings
      expect(validation.warnings).not.toContain(expect.stringContaining('Cannot have success=true'))
    })
  })
})
import { Context, Next } from 'hono'
import { z } from 'zod'

/**
 * Request validation middleware using Zod schemas
 */
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      let data: unknown

      const contentType = c.req.header('content-type')
      
      if (contentType?.includes('application/json')) {
        data = await c.req.json()
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        data = await c.req.parseBody()
      } else {
        // Try to parse as JSON for GET requests with query params
        const url = new URL(c.req.url)
        const params: Record<string, string> = {}
        url.searchParams.forEach((value, key) => {
          params[key] = value
        })
        data = Object.keys(params).length > 0 ? params : {}
      }

      const validatedData = schema.parse(data)
      c.set('validatedData', validatedData)
      
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        }, 400)
      }

      console.error('Validation middleware error:', error)
      return c.json({ error: 'Request validation failed' }, 400)
    }
  }
}

/**
 * Get validated data from context
 */
export function getValidatedData<T>(c: Context): T {
  const data = c.get('validatedData')
  if (!data) {
    throw new Error('No validated data available')
  }
  return data as T
}

/**
 * Common validation schemas
 */
export const schemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  }),

  // UUID validation
  uuid: z.string().uuid(),

  // Event emission
  eventEmission: z.object({
    eventType: z.string().min(1).max(100),
    entityType: z.string().min(1).max(50).optional(),
    entityId: z.string().uuid().optional(),
    payload: z.record(z.unknown()).default({})
  }),

  // Press release submission
  pressReleaseSubmission: z.object({
    title: z.string().min(10).max(200),
    content: z.string().min(100),
    summary: z.string().max(500).optional(),
    target_audience: z.string().max(500).optional(),
    keywords: z.array(z.string()).max(20).default([]),
    submission_tier: z.enum(['basic', 'premium']).default('basic'),
    distribution_channels: z.array(z.string()).default([])
  }),

  // Wallet credit consumption
  creditConsumption: z.object({
    credit_type: z.enum(['press_release_credits', 'ai_operations_credits', 'premium_credits']),
    amount: z.number().min(1).max(100),
    reference_type: z.string().optional(),
    reference_id: z.string().uuid().optional(),
    description: z.string().optional()
  })
}
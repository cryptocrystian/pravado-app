import { Context, Next } from 'hono'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Global error handling middleware
 */
export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle APIError instances
    if (error instanceof APIError) {
      return c.json({
        error: error.message,
        code: error.code,
        details: error.details
      }, error.statusCode as any)
    }

    // Handle validation errors from other sources
    if (error && typeof error === 'object' && 'name' in error) {
      if (error.name === 'ZodError') {
        return c.json({
          error: 'Validation failed',
          details: (error as any).errors
        }, 400)
      }
    }

    // Handle generic errors
    return c.json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, 500)
  }
}

/**
 * Common error factories
 */
export const errors = {
  notFound: (resource: string, id?: string) => 
    new APIError(`${resource}${id ? ` with id ${id}` : ''} not found`, 404, 'NOT_FOUND'),
  
  unauthorized: (message = 'Unauthorized') =>
    new APIError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message = 'Forbidden') =>
    new APIError(message, 403, 'FORBIDDEN'),
  
  badRequest: (message: string, details?: unknown) =>
    new APIError(message, 400, 'BAD_REQUEST', details),
  
  conflict: (message: string) =>
    new APIError(message, 409, 'CONFLICT'),
  
  insufficientCredits: (creditType: string, required: number, available: number) =>
    new APIError(
      `Insufficient ${creditType}. Required: ${required}, Available: ${available}`,
      402,
      'INSUFFICIENT_CREDITS',
      { creditType, required, available }
    ),
  
  rateLimited: (message = 'Rate limit exceeded') =>
    new APIError(message, 429, 'RATE_LIMITED'),
  
  serviceUnavailable: (service: string) =>
    new APIError(`${service} is currently unavailable`, 503, 'SERVICE_UNAVAILABLE')
}
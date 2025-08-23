import { Context, Next } from 'hono'

/**
 * CORS middleware with configurable origins
 */
export function corsMiddleware(c: Context, next: Next) {
  return cors({
    origin: getAllowedOrigins(c.env.ALLOWED_ORIGINS),
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  })(c, next)
}

/**
 * Manual CORS implementation for Cloudflare Workers
 */
function cors(options: {
  origin: string[] | string | boolean
  allowMethods?: string[]
  allowHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}) {
  return async (c: Context, next: Next) => {
    const origin = c.req.header('origin')
    const requestMethod = c.req.header('access-control-request-method')

    // Handle preflight requests
    if (c.req.method === 'OPTIONS') {
      const response = new Response(null, { status: 204 })
      
      // Set CORS headers
      if (isOriginAllowed(origin, options.origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin || '*')
      }
      
      if (options.allowMethods) {
        response.headers.set('Access-Control-Allow-Methods', options.allowMethods.join(', '))
      }
      
      if (options.allowHeaders) {
        response.headers.set('Access-Control-Allow-Headers', options.allowHeaders.join(', '))
      }
      
      if (options.credentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true')
      }
      
      if (options.maxAge) {
        response.headers.set('Access-Control-Max-Age', options.maxAge.toString())
      }
      
      return response
    }

    await next()

    // Set CORS headers on actual requests
    if (isOriginAllowed(origin, options.origin)) {
      c.res.headers.set('Access-Control-Allow-Origin', origin || '*')
    }
    
    if (options.credentials) {
      c.res.headers.set('Access-Control-Allow-Credentials', 'true')
    }
  }
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(
  origin: string | undefined, 
  allowedOrigins: string[] | string | boolean
): boolean {
  if (allowedOrigins === true) return true
  if (allowedOrigins === false) return false
  if (!origin) return false
  
  if (typeof allowedOrigins === 'string') {
    return origin === allowedOrigins || allowedOrigins === '*'
  }
  
  if (Array.isArray(allowedOrigins)) {
    return allowedOrigins.includes(origin) || allowedOrigins.includes('*')
  }
  
  return false
}

/**
 * Parse allowed origins from environment variable
 */
function getAllowedOrigins(originsEnv?: string): string[] {
  if (!originsEnv) {
    return ['http://localhost:3000', 'http://localhost:5173', 'https://pravado-app.pages.dev']
  }
  
  return originsEnv.split(',').map(origin => origin.trim()).filter(Boolean)
}
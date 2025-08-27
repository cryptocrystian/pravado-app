/**
 * Security Middleware for PRAVADO API Worker
 * Implements comprehensive security headers, rate limiting, and authentication
 */

import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env } from '../index'

/**
 * Security Headers Middleware
 * Adds comprehensive security headers to all responses
 */
export const securityHeaders = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    // Set security headers
    c.res.headers.set('X-Content-Type-Options', 'nosniff')
    c.res.headers.set('X-Frame-Options', 'DENY')
    c.res.headers.set('X-XSS-Protection', '1; mode=block')
    c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Strict Transport Security (HSTS)
    c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    
    // Content Security Policy (CSP) - API responses only
    const csp = [
      "default-src 'none'",
      "script-src 'none'",
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'"
    ].join('; ')
    c.res.headers.set('Content-Security-Policy', csp)
    
    // Remove potentially revealing headers
    c.res.headers.delete('Server')
    c.res.headers.delete('X-Powered-By')
    
    await next()
  }
}

/**
 * Rate Limiting Middleware
 * Implements sliding window rate limiting per IP/endpoint
 */
export const rateLimiter = (options: {
  maxRequests?: number
  windowMs?: number
  skipSuccessfulRequests?: boolean
  keyGenerator?: (c: Context) => string
} = {}) => {
  const {
    maxRequests = 100,
    windowMs = 60 * 60 * 1000, // 1 hour
    skipSuccessfulRequests = false,
    keyGenerator = (c: Context) => c.req.header('CF-Connecting-IP') || 'unknown'
  } = options

  // In-memory store for rate limiting (in production, use KV store)
  const store = new Map<string, { count: number; resetTime: number }>()

  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const key = `${keyGenerator(c)}:${c.req.path}`
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [k, v] of store.entries()) {
      if (v.resetTime <= windowStart) {
        store.delete(k)
      }
    }

    // Get or create entry
    let entry = store.get(key)
    if (!entry || entry.resetTime <= windowStart) {
      entry = { count: 0, resetTime: now + windowMs }
      store.set(key, entry)
    }

    // Check rate limit before processing
    if (entry.count >= maxRequests) {
      // Log rate limit violation
      console.warn(`Rate limit exceeded for ${key}`, {
        ip: c.req.header('CF-Connecting-IP'),
        path: c.req.path,
        method: c.req.method,
        count: entry.count,
        maxRequests
      })

      // Set rate limit headers
      c.res.headers.set('X-RateLimit-Limit', maxRequests.toString())
      c.res.headers.set('X-RateLimit-Remaining', '0')
      c.res.headers.set('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())
      c.res.headers.set('Retry-After', Math.ceil((entry.resetTime - now) / 1000).toString())

      throw new HTTPException(429, { message: 'Too Many Requests' })
    }

    // Increment counter
    entry.count++

    await next()

    // Only count successful requests if skipSuccessfulRequests is false
    if (skipSuccessfulRequests && c.res.status >= 400) {
      entry.count--
    }

    // Set rate limit headers for successful requests
    c.res.headers.set('X-RateLimit-Limit', maxRequests.toString())
    c.res.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString())
    c.res.headers.set('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000).toString())
  }
}

/**
 * Authentication Middleware
 * Validates JWT tokens and sets organization context
 */
export const authenticateJWT = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Missing or invalid authorization header' })
    }

    const token = authHeader.slice(7) // Remove 'Bearer ' prefix

    try {
      // In production, verify JWT token with c.env.JWT_SECRET
      // For now, mock validation
      const decoded = await verifyJWT(token, c.env.JWT_SECRET)
      
      // Set user context
      c.set('user', decoded)
      c.set('orgId', decoded.org_id)
      
      await next()
    } catch (error) {
      console.error('JWT verification failed:', error)
      throw new HTTPException(401, { message: 'Invalid or expired token' })
    }
  }
}

/**
 * Organization Context Middleware
 * Sets organization context for database operations and RLS
 */
export const setOrgContext = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const orgId = c.get('orgId')
    
    if (orgId) {
      // In production, set database session variable for RLS
      // This would integrate with your database connection
      c.set('dbContext', { org_id: orgId })
    }
    
    await next()
  }
}

/**
 * Request Logging Middleware
 * Logs all requests for security monitoring
 */
export const requestLogger = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const start = Date.now()
    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const userAgent = c.req.header('User-Agent') || 'unknown'
    const orgId = c.get('orgId')
    const user = c.get('user')

    await next()

    const duration = Date.now() - start
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration_ms: duration,
      ip,
      user_agent: userAgent,
      org_id: orgId,
      user_id: user?.sub,
      cf_ray: c.req.header('CF-Ray'),
      cf_country: c.req.header('CF-IPCountry')
    }

    // Log security-relevant events
    if (c.res.status >= 400) {
      console.warn('API Error', logEntry)
    } else if (c.req.path.includes('auth') || c.req.path.includes('login')) {
      console.info('Auth Request', logEntry)
    } else {
      console.info('API Request', logEntry)
    }

    // In production, send to security monitoring system
    // await sendToSecurityMonitoring(logEntry)
  }
}

/**
 * Input Sanitization Middleware
 * Sanitizes request inputs to prevent injection attacks
 */
export const sanitizeInput = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    // Sanitize query parameters
    const query = c.req.query()
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'string') {
        // Basic sanitization - remove potentially dangerous characters
        const sanitized = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=\s*["\'][^"\']*["\']/, '') // Remove event handlers
          .trim()
        
        if (sanitized !== value) {
          console.warn(`Sanitized query parameter ${key}:`, { original: value, sanitized })
        }
        
        // Replace in request context (this is middleware-specific implementation)
        c.req = {
          ...c.req,
          query: (key?: string) => key === undefined ? { ...query, [key]: sanitized } : query[key]
        } as any
      }
    }

    await next()
  }
}

/**
 * Mock JWT verification function
 * In production, use a proper JWT library
 */
async function verifyJWT(token: string, secret: string): Promise<any> {
  // This is a mock implementation
  // In production, use jose, jsonwebtoken, or similar library
  
  if (token === 'mock-valid-token') {
    return {
      sub: 'user-123',
      org_id: '550e8400-e29b-41d4-a716-446655440000',
      exp: Math.floor(Date.now() / 1000) + 3600
    }
  }
  
  throw new Error('Invalid token')
}

/**
 * CORS Security Enhancement
 * Stricter CORS configuration for production
 */
export const secureCORS = (env: Env) => {
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
  
  return (origin: string | undefined, c: Context) => {
    // Allow same-origin requests
    if (!origin) return true
    
    // Check against whitelist
    const isAllowed = allowedOrigins.some(allowed => {
      // Exact match
      if (allowed === origin) return true
      
      // Wildcard subdomain matching (*.example.com)
      if (allowed.startsWith('*.')) {
        const domain = allowed.slice(2)
        return origin.endsWith('.' + domain) || origin === domain
      }
      
      return false
    })
    
    if (!isAllowed) {
      console.warn('CORS: Blocked origin', { origin, allowedOrigins })
    }
    
    return isAllowed
  }
}

/**
 * Error Sanitization Middleware
 * Prevents information leakage in error responses
 */
export const sanitizeErrors = () => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    try {
      await next()
    } catch (error) {
      console.error('Sanitized error:', error)
      
      if (error instanceof HTTPException) {
        // Allow HTTP exceptions to pass through (they're controlled)
        throw error
      }
      
      // Sanitize unexpected errors to prevent information leakage
      throw new HTTPException(500, { 
        message: 'Internal server error' 
      })
    }
  }
}

/**
 * Content Type Validation Middleware
 * Validates content types for POST/PUT requests
 */
export const validateContentType = (allowedTypes: string[] = ['application/json']) => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    if (['POST', 'PUT', 'PATCH'].includes(c.req.method)) {
      const contentType = c.req.header('Content-Type')
      
      if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
        throw new HTTPException(415, { 
          message: `Unsupported content type. Allowed: ${allowedTypes.join(', ')}` 
        })
      }
    }
    
    await next()
  }
}
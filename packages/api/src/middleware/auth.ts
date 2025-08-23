import { Context, Next } from 'hono'
import { jwtVerify, importSPKI } from 'jose'
import { createClient } from '@supabase/supabase-js'
import { errors } from './errors'

export interface AuthUser {
  id: string
  email: string
  tenant_id: string
  role: string
}

/**
 * JWT Authentication Middleware
 */
export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw errors.unauthorized('Missing or invalid authorization header')
    }

    const token = authHeader.substring(7)
    
    // Get Supabase JWT secret from environment
    const jwtSecret = c.env.SUPABASE_JWT_SECRET
    if (!jwtSecret) {
      console.error('SUPABASE_JWT_SECRET not configured')
      throw errors.unauthorized('Authentication configuration error')
    }

    // Verify JWT token
    const secretKey = new TextEncoder().encode(jwtSecret)
    const { payload } = await jwtVerify(token, secretKey)
    
    if (!payload.sub || !payload.email) {
      throw errors.unauthorized('Invalid token payload')
    }

    // Create Supabase client for database queries
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get user details from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        tenants!inner (
          id,
          name,
          status
        ),
        user_tenant_roles!inner (
          role
        )
      `)
      .eq('id', payload.sub)
      .eq('tenants.status', 'active')
      .single()

    if (userError || !userData) {
      console.error('User lookup failed:', userError)
      throw errors.unauthorized('User not found or inactive')
    }

    const user: AuthUser = {
      id: userData.id,
      email: userData.email,
      tenant_id: (userData.tenants as any).id,
      role: (userData.user_tenant_roles as any).role
    }

    // Store user and supabase client in context
    c.set('user', user)
    c.set('supabase', supabase)
    
    await next()

  } catch (error) {
    console.error('Authentication failed:', error)
    
    if (error instanceof Error && error.name === 'JWTExpired') {
      throw errors.unauthorized('Token expired')
    }
    
    if (error instanceof Error && error.name === 'JWTInvalid') {
      throw errors.unauthorized('Invalid token')
    }
    
    throw error instanceof Error ? error : errors.unauthorized('Authentication failed')
  }
}

/**
 * Get authenticated user from context
 */
export function getAuthUser(c: Context): AuthUser {
  const user = c.get('user')
  if (!user) {
    throw errors.unauthorized('No authenticated user found')
  }
  return user
}

/**
 * Get Supabase client from context
 */
export function getSupabase(c: Context) {
  const supabase = c.get('supabase')
  if (!supabase) {
    throw new Error('Supabase client not available')
  }
  return supabase
}

/**
 * Role-based authorization middleware
 */
export function requireRole(allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = getAuthUser(c)
    
    if (!allowedRoles.includes(user.role)) {
      throw errors.forbidden(`Access denied. Required role: ${allowedRoles.join(' or ')}`)
    }
    
    await next()
  }
}

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole(['admin', 'super_admin'])

/**
 * Editor or higher middleware
 */
export const requireEditor = requireRole(['editor', 'admin', 'super_admin'])
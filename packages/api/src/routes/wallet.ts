import { Hono } from 'hono'
import { getAuthUser, getSupabase } from '../middleware/auth'
import { validateRequest, getValidatedData, schemas } from '../middleware/validation'
import { errors } from '../middleware/errors'

const wallet = new Hono()

/**
 * GET /wallet
 * Get wallet balance for the current tenant
 */
wallet.get('/', async (c) => {
  const user = getAuthUser(c)
  const supabase = getSupabase(c)

  try {
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('tenant_id', user.tenant_id)
      .single()

    if (walletError || !walletData) {
      throw errors.notFound('Wallet', user.tenant_id)
    }

    // Get recent transactions for context
    const { data: recentTransactions, error: transactionError } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletData.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (transactionError) {
      console.error('Failed to fetch recent transactions:', transactionError)
    }

    return c.json({
      success: true,
      data: {
        wallet_id: walletData.id,
        tenant_id: walletData.tenant_id,
        press_release_credits: walletData.press_release_credits,
        ai_operations_credits: walletData.ai_operations_credits,
        premium_credits: walletData.premium_credits,
        last_updated: walletData.updated_at,
        recent_transactions: recentTransactions || []
      }
    })

  } catch (error) {
    console.error('Wallet retrieval failed:', error)
    throw error instanceof Error ? error : errors.badRequest('Failed to retrieve wallet')
  }
})

/**
 * POST /wallet/consume-credits
 * Manually consume credits (for testing/admin purposes)
 */
wallet.post('/consume-credits',
  validateRequest(schemas.creditConsumption),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { credit_type, amount, reference_type, reference_id, description } = getValidatedData<{
      credit_type: 'press_release_credits' | 'ai_operations_credits' | 'premium_credits'
      amount: number
      reference_type?: string
      reference_id?: string
      description?: string
    }>(c)

    try {
      // Get current wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('tenant_id', user.tenant_id)
        .single()

      if (walletError || !walletData) {
        throw errors.notFound('Wallet', user.tenant_id)
      }

      const currentCredits = walletData[credit_type]
      
      if (currentCredits < amount) {
        throw errors.insufficientCredits(credit_type, amount, currentCredits)
      }

      // Consume credits in a transaction
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallets')
        .update({
          [credit_type]: currentCredits - amount,
          updated_at: new Date().toISOString()
        })
        .eq('tenant_id', user.tenant_id)
        .select('*')
        .single()

      if (updateError) {
        console.error('Wallet update failed:', updateError)
        throw errors.badRequest('Failed to consume credits')
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: walletData.id,
          user_id: user.id,
          transaction_type: 'consume',
          credit_type,
          amount: -amount,
          balance_before: currentCredits,
          balance_after: currentCredits - amount,
          reference_type: reference_type || 'manual',
          reference_id,
          description: description || `Manual credit consumption: ${amount} ${credit_type}`
        })

      if (transactionError) {
        console.error('Transaction record failed:', transactionError)
        // Don't fail the request, just log the error
      }

      return c.json({
        success: true,
        data: {
          credits_consumed: amount,
          credit_type,
          new_balance: updatedWallet[credit_type],
          wallet: {
            press_release_credits: updatedWallet.press_release_credits,
            ai_operations_credits: updatedWallet.ai_operations_credits,
            premium_credits: updatedWallet.premium_credits
          }
        }
      })

    } catch (error) {
      console.error('Credit consumption failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to consume credits')
    }
  }
)

/**
 * POST /wallet/add-credits
 * Add credits to wallet (for testing/admin purposes)
 */
wallet.post('/add-credits',
  validateRequest(schemas.creditConsumption),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { credit_type, amount, description } = getValidatedData<{
      credit_type: 'press_release_credits' | 'ai_operations_credits' | 'premium_credits'
      amount: number
      description?: string
    }>(c)

    try {
      // Get current wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('tenant_id', user.tenant_id)
        .single()

      if (walletError || !walletData) {
        throw errors.notFound('Wallet', user.tenant_id)
      }

      const currentCredits = walletData[credit_type]
      const newBalance = currentCredits + amount

      // Add credits
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallets')
        .update({
          [credit_type]: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('tenant_id', user.tenant_id)
        .select('*')
        .single()

      if (updateError) {
        console.error('Wallet update failed:', updateError)
        throw errors.badRequest('Failed to add credits')
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: walletData.id,
          user_id: user.id,
          transaction_type: 'add',
          credit_type,
          amount,
          balance_before: currentCredits,
          balance_after: newBalance,
          reference_type: 'manual',
          description: description || `Manual credit addition: ${amount} ${credit_type}`
        })

      if (transactionError) {
        console.error('Transaction record failed:', transactionError)
      }

      return c.json({
        success: true,
        data: {
          credits_added: amount,
          credit_type,
          new_balance: newBalance,
          wallet: {
            press_release_credits: updatedWallet.press_release_credits,
            ai_operations_credits: updatedWallet.ai_operations_credits,
            premium_credits: updatedWallet.premium_credits
          }
        }
      })

    } catch (error) {
      console.error('Credit addition failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to add credits')
    }
  }
)

/**
 * GET /wallet/transactions
 * Get wallet transaction history with pagination
 */
wallet.get('/transactions',
  validateRequest(schemas.pagination),
  async (c) => {
    const user = getAuthUser(c)
    const supabase = getSupabase(c)
    const { page, limit } = getValidatedData<{ page: number; limit: number }>(c)

    const offset = (page - 1) * limit

    try {
      // Get wallet first
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('id')
        .eq('tenant_id', user.tenant_id)
        .single()

      if (walletError || !walletData) {
        throw errors.notFound('Wallet', user.tenant_id)
      }

      // Get transactions
      const { data: transactions, error: transactionError, count } = await supabase
        .from('wallet_transactions')
        .select('*', { count: 'exact' })
        .eq('wallet_id', walletData.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (transactionError) {
        console.error('Transactions retrieval failed:', transactionError)
        throw errors.badRequest('Failed to retrieve transactions')
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return c.json({
        success: true,
        data: transactions || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      })

    } catch (error) {
      console.error('Transaction history failed:', error)
      throw error instanceof Error ? error : errors.badRequest('Failed to retrieve transaction history')
    }
  }
)

export { wallet }
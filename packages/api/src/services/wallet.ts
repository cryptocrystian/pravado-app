import { SupabaseClient } from '@supabase/supabase-js'
import { errors } from '../middleware/errors'

/**
 * Consume wallet credits with transaction tracking
 */
export async function consumeWalletCredits(
  supabase: SupabaseClient,
  tenantId: string,
  userId: string,
  creditType: 'press_release_credits' | 'ai_operations_credits' | 'premium_credits',
  amount: number,
  referenceType: string,
  referenceId?: string,
  description?: string
): Promise<{
  wallet_id: string
  balance_before: number
  balance_after: number
  transaction_id: string
}> {
  try {
    // Get current wallet state
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('tenant_id', tenantId)
      .single()

    if (walletError || !walletData) {
      throw errors.notFound('Wallet', tenantId)
    }

    const currentCredits = walletData[creditType]
    
    if (currentCredits < amount) {
      throw errors.insufficientCredits(creditType, amount, currentCredits)
    }

    const newBalance = currentCredits - amount

    // Update wallet balance
    const { data: updatedWallet, error: updateError } = await supabase
      .from('wallets')
      .update({
        [creditType]: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Wallet update failed:', updateError)
      throw errors.badRequest('Failed to update wallet balance')
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: walletData.id,
        user_id: userId,
        transaction_type: 'consume',
        credit_type: creditType,
        amount: -amount,
        balance_before: currentCredits,
        balance_after: newBalance,
        reference_type: referenceType,
        reference_id: referenceId,
        description: description || `${creditType} consumed for ${referenceType}`
      })
      .select('*')
      .single()

    if (transactionError) {
      console.error('Transaction record failed:', transactionError)
      // Try to rollback wallet update
      await supabase
        .from('wallets')
        .update({
          [creditType]: currentCredits,
          updated_at: new Date().toISOString()
        })
        .eq('tenant_id', tenantId)
      
      throw errors.badRequest('Failed to record transaction')
    }

    return {
      wallet_id: walletData.id,
      balance_before: currentCredits,
      balance_after: newBalance,
      transaction_id: transaction.id
    }

  } catch (error) {
    console.error('Credit consumption failed:', error)
    throw error instanceof Error ? error : errors.badRequest('Failed to consume credits')
  }
}

/**
 * Add credits to wallet with transaction tracking
 */
export async function addWalletCredits(
  supabase: SupabaseClient,
  tenantId: string,
  userId: string,
  creditType: 'press_release_credits' | 'ai_operations_credits' | 'premium_credits',
  amount: number,
  referenceType: string,
  referenceId?: string,
  description?: string
): Promise<{
  wallet_id: string
  balance_before: number
  balance_after: number
  transaction_id: string
}> {
  try {
    // Get current wallet state
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('tenant_id', tenantId)
      .single()

    if (walletError || !walletData) {
      throw errors.notFound('Wallet', tenantId)
    }

    const currentCredits = walletData[creditType]
    const newBalance = currentCredits + amount

    // Update wallet balance
    const { data: updatedWallet, error: updateError } = await supabase
      .from('wallets')
      .update({
        [creditType]: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Wallet update failed:', updateError)
      throw errors.badRequest('Failed to update wallet balance')
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: walletData.id,
        user_id: userId,
        transaction_type: 'add',
        credit_type: creditType,
        amount: amount,
        balance_before: currentCredits,
        balance_after: newBalance,
        reference_type: referenceType,
        reference_id: referenceId,
        description: description || `${creditType} added for ${referenceType}`
      })
      .select('*')
      .single()

    if (transactionError) {
      console.error('Transaction record failed:', transactionError)
      // Don't rollback for add operations, just log
    }

    return {
      wallet_id: walletData.id,
      balance_before: currentCredits,
      balance_after: newBalance,
      transaction_id: transaction?.id || 'unknown'
    }

  } catch (error) {
    console.error('Credit addition failed:', error)
    throw error instanceof Error ? error : errors.badRequest('Failed to add credits')
  }
}

/**
 * Get wallet balance for a tenant
 */
export async function getWalletBalance(
  supabase: SupabaseClient,
  tenantId: string
): Promise<{
  press_release_credits: number
  ai_operations_credits: number
  premium_credits: number
}> {
  try {
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('press_release_credits, ai_operations_credits, premium_credits')
      .eq('tenant_id', tenantId)
      .single()

    if (walletError || !walletData) {
      throw errors.notFound('Wallet', tenantId)
    }

    return {
      press_release_credits: walletData.press_release_credits,
      ai_operations_credits: walletData.ai_operations_credits,
      premium_credits: walletData.premium_credits
    }

  } catch (error) {
    console.error('Wallet balance retrieval failed:', error)
    throw error instanceof Error ? error : errors.badRequest('Failed to get wallet balance')
  }
}
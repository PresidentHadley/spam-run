import { createServiceClient } from './supabase/server'
import { PLAN_LIMITS } from './stripe'

export async function checkUsageLimit(
  userId: string
): Promise<{ allowed: boolean; current: number; limit: number; percentUsed: number }> {
  const supabase = createServiceClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('checks_used_this_month, monthly_check_limit, plan_tier')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    throw new Error('Failed to fetch user profile')
  }

  const current = profile.checks_used_this_month
  const limit = profile.monthly_check_limit
  const percentUsed = (current / limit) * 100

  return {
    allowed: current < limit,
    current,
    limit,
    percentUsed,
  }
}

export async function incrementUsage(
  userId: string,
  source: 'web' | 'api' = 'web'
): Promise<void> {
  const supabase = createServiceClient()

  // Fetch current value first
  const { data: profile } = await supabase
    .from('profiles')
    .select('checks_used_this_month')
    .eq('id', userId)
    .single()

  if (profile) {
    // Increment manually
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        checks_used_this_month: profile.checks_used_this_month + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (profileError) {
      console.error('Error incrementing profile usage:', profileError)
    }
  }

  // Update daily analytics
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('usage_analytics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (existing) {
    // Update existing record
    await supabase
      .from('usage_analytics')
      .update({
        checks_web: source === 'web' ? existing.checks_web + 1 : existing.checks_web,
        checks_api: source === 'api' ? existing.checks_api + 1 : existing.checks_api,
        total_checks: existing.total_checks + 1,
      })
      .eq('id', existing.id)
  } else {
    // Create new record
    await supabase
      .from('usage_analytics')
      .insert({
        user_id: userId,
        date: today,
        checks_web: source === 'web' ? 1 : 0,
        checks_api: source === 'api' ? 1 : 0,
        total_checks: 1,
      })
  }
}

export async function resetMonthlyUsage(userId: string): Promise<void> {
  const supabase = createServiceClient()

  await supabase
    .from('profiles')
    .update({
      checks_used_this_month: 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
}

export async function getUsageHistory(userId: string, months: number = 6) {
  const supabase = createServiceClient()

  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const { data, error } = await supabase
    .from('usage_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    throw new Error('Failed to fetch usage history')
  }

  return data
}


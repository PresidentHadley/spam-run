import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUsageLimit, getUsageHistory } from '@/lib/usage-tracker'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current month usage
    const usageCheck = await checkUsageLimit(user.id)

    // Get usage history
    const history = await getUsageHistory(user.id, 6)

    return NextResponse.json({
      currentMonth: {
        checksUsed: usageCheck.current,
        checksLimit: usageCheck.limit,
        percentUsed: usageCheck.percentUsed,
      },
      history: history.map(item => ({
        date: item.date,
        checksWeb: item.checks_web,
        checksApi: item.checks_api,
        totalChecks: item.total_checks,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage data', message: error.message },
      { status: 500 }
    )
  }
}

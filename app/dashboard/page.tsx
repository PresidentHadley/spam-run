'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart3, CheckCircle, TrendingUp, Zap } from 'lucide-react'

export default function DashboardHomePage() {
  const [profile, setProfile] = useState<any>(null)
  const [recentChecks, setRecentChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)

      // Fetch recent checks
      const { data: checks } = await supabase
        .from('email_checks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentChecks(checks || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  const usagePercent = (profile?.checks_used_this_month / profile?.monthly_check_limit) * 100

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your email deliverability overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Checks This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.checks_used_this_month || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {profile?.monthly_check_limit} limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.plan_tier || 'Free'}</div>
            <p className="text-xs text-muted-foreground">
              Current subscription
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentChecks.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentChecks.length > 0
                ? Math.round(
                    recentChecks.reduce((acc, check) => acc + (check.deliverability_score || 0), 0) /
                      recentChecks.length
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Deliverability score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>
            You've used {profile?.checks_used_this_month || 0} of {profile?.monthly_check_limit} checks this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={usagePercent} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.round(usagePercent)}% of your monthly limit
          </p>
        </CardContent>
      </Card>

      {/* Recent Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Checks</CardTitle>
          <CardDescription>Your latest email deliverability checks</CardDescription>
        </CardHeader>
        <CardContent>
          {recentChecks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No checks yet. Start by checking your first email!
            </p>
          ) : (
            <div className="space-y-4">
              {recentChecks.map((check) => (
                <div key={check.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-medium truncate">{check.subject_line || 'No subject'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(check.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Score: {check.spam_score}</p>
                      <Badge
                        variant={
                          check.verdict === 'INBOX_READY'
                            ? 'default'
                            : check.verdict === 'NEEDS_IMPROVEMENT'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {check.verdict?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


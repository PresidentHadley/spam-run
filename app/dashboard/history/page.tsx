'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateTime } from '@/lib/utils'

export default function HistoryPage() {
  const [checks, setChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchChecks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('email_checks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      setChecks(data || [])
      setLoading(false)
    }

    fetchChecks()
  }, [supabase])

  const getVerdictVariant = (verdict: string) => {
    switch (verdict) {
      case 'INBOX_READY':
        return 'default'
      case 'NEEDS_IMPROVEMENT':
        return 'secondary'
      default:
        return 'destructive'
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Check History</h1>
        <p className="text-muted-foreground mt-1">
          View all your previous email checks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Checks</CardTitle>
          <CardDescription>
            Your most recent email deliverability checks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No checks yet. Start by checking your first email!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Spam Score</TableHead>
                  <TableHead className="text-right">Deliverability</TableHead>
                  <TableHead>Verdict</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium max-w-md truncate">
                      {check.subject_line || '(No subject)'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDateTime(check.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {check.check_source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {check.spam_score}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {check.deliverability_score}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getVerdictVariant(check.verdict)}>
                        {check.verdict?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

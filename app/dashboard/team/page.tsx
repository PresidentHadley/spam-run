'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">
          Manage your team members and collaboration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Team collaboration features will be available in the next update
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Invite team members and collaborate on email optimization.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

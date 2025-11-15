'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Save and manage email templates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Template management feature will be available in the next update
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Save your frequently used email templates for quick access and reuse.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

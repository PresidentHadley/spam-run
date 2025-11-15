'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground mt-1">
          Manage your API keys for programmatic access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            API key management will be available in the next update
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Generate and manage API keys for programmatic access to SPAMRUN.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

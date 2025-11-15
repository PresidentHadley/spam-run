'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>
            Get more features with a paid plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Upgrade to Pro or Team plans to unlock unlimited checks, API access, and more.
          </p>
          <Link href="/pricing">
            <Button>View Pricing</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

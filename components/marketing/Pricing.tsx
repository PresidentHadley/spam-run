'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Try before you commit',
    features: [
      '3 email checks per month',
      'Web interface only',
      'Basic spam analysis',
      '7-day history',
      'Community support',
    ],
    cta: 'Get Started Free',
    plan: 'free',
    popular: false,
    priceId: null,
  },
  {
    name: 'Starter',
    price: '$9.99',
    description: 'For sales reps & individual marketers',
    features: [
      'Unlimited email checks',
      'Web interface only',
      'Advanced AI analysis',
      'Unlimited history',
      'Saved templates',
      'Perfect for checking every email you send',
    ],
    cta: 'Upgrade to Starter',
    plan: 'starter',
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For developers & automation',
    features: [
      'Everything in Starter',
      'API access (10,000 requests/month)',
      'Webhooks',
      'Bulk checking',
      'Priority support',
      'Integrate with your tools',
    ],
    cta: 'Upgrade to Pro',
    plan: 'pro',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
  {
    name: 'Enterprise',
    price: '$99',
    description: 'For teams & high-volume senders',
    features: [
      'Everything in Pro',
      'API access (50,000 requests/month)',
      'Team collaboration (10 users)',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    cta: 'Upgrade to Enterprise',
    plan: 'enterprise',
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
]

export function Pricing() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  async function handlePlanClick(plan: any) {
    // If free plan or not logged in, go to signup
    if (plan.plan === 'free' || !user) {
      router.push(plan.plan === 'free' ? '/signup' : `/signup?plan=${plan.plan}`)
      return
    }

    // If logged in and paid plan, create Stripe checkout
    if (plan.priceId) {
      setCheckoutLoading(plan.plan)
      try {
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId: plan.priceId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to create checkout session')
        }

        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error('No checkout URL returned')
        }
      } catch (error: any) {
        console.error('Checkout error:', error)
        alert(`Failed to start checkout: ${error.message}\n\nPlease try again or contact support.`)
        setCheckoutLoading(null)
      }
    }
  }

  return (
    <section className="container py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${
              plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/50' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {plan.popular && <Badge>Popular</Badge>}
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handlePlanClick(plan)}
                disabled={loading || checkoutLoading === plan.plan}
              >
                {checkoutLoading === plan.plan ? 'Loading...' : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

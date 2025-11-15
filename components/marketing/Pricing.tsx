import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out SPAMRUN',
    features: [
      '5 email checks per month',
      'Web interface only',
      'Basic analysis',
      '7-day history',
      'Community support',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professionals who send regularly',
    features: [
      'Unlimited email checks',
      'API access (1,000 requests/month)',
      'Advanced analysis',
      'Unlimited history',
      'Saved templates (25)',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$99',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'API access (10,000 requests/month)',
      'Team collaboration (up to 10 users)',
      'Unlimited saved templates',
      'Team analytics',
      'Webhooks',
      'Dedicated support',
    ],
    cta: 'Start Team Trial',
    href: '/signup?plan=team',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Team',
      'Unlimited API requests',
      'Unlimited users',
      'Custom integrations',
      'SLA guarantee',
      'SSO (SAML)',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
]

export function Pricing() {
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
                {plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
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
              <Link href={plan.href} className="w-full">
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}


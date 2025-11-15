import { Zap, TrendingUp, CheckCircle, Code, Users, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get comprehensive spam analysis in under 3 seconds. No waiting, no hassle.',
  },
  {
    icon: TrendingUp,
    title: 'Deliverability Score',
    description: 'See your exact inbox placement rate and understand what affects it.',
  },
  {
    icon: CheckCircle,
    title: 'Fix Recommendations',
    description: 'Get actionable steps to improve your email and boost deliverability.',
  },
  {
    icon: Code,
    title: 'API Access',
    description: 'Integrate spam checking into your workflow with our RESTful API.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share templates and insights with your team. Perfect for agencies.',
  },
  {
    icon: Database,
    title: 'Bulk Checking',
    description: 'Check hundreds of emails at once with our bulk API endpoint.',
  },
]

export function Features() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything You Need for Email Deliverability
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Powerful tools to ensure your emails reach the inbox, not the spam folder.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="border-2 transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}


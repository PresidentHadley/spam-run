import { Features } from '@/components/marketing/Features'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, BarChart3, Shield, Webhook, FileText, Clock } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <>
      <section className="container py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Powerful Features for Email Deliverability
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Everything you need to ensure your emails reach the inbox.
          </p>
        </div>
      </section>

      <Features />

      {/* Detailed Features */}
      <section className="container py-24 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Email Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes subject lines, body content, links, formatting, and technical elements to identify spam triggers and deliverability issues.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Scoring</h3>
                <p className="text-muted-foreground">
                  Get instant spam scores, deliverability ratings, and estimated inbox rates. Track improvements over time with detailed analytics.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Security</h3>
                <p className="text-muted-foreground">
                  Your emails are encrypted in transit and at rest. We never share your data with third parties. SOC 2 Type II compliant.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Webhook className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Webhook Support</h3>
                <p className="text-muted-foreground">
                  Receive real-time notifications when bulk checks complete. Integrate seamlessly with your existing workflows and tools.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Template Management</h3>
                <p className="text-muted-foreground">
                  Save and organize email templates. Track performance over time. Share templates with your team for collaboration.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Analysis completes in under 3 seconds. Our API is optimized for speed with 99.9% uptime SLA on Enterprise plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


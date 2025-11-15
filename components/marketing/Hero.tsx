import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-8 py-24 text-center">
      <div className="flex max-w-4xl flex-col items-center gap-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 border-purple-200">
          AI-Powered Email Analysis
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Beat the Spam Filter.
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Reach the Inbox.
          </span>
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          AI-powered email analysis that tells you exactly why your emails land in spam—and how to fix it.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/signup">
            <Button size="lg" className="group">
              Try Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          No credit card required. 5 free checks per month.
        </p>
      </div>

      {/* Demo Preview */}
      <div className="w-full max-w-5xl rounded-lg border bg-card shadow-2xl">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject Line</label>
              <div className="mt-1 rounded-md border bg-background p-3 text-sm text-muted-foreground">
                Free offer - Act now and save 50%!
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email Body</label>
              <div className="mt-1 rounded-md border bg-background p-3 text-sm text-muted-foreground">
                Hi there! We have an AMAZING offer just for you...
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-3xl font-bold text-red-600">72</div>
                <div className="text-xs text-muted-foreground">Spam Score</div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">28</div>
                <div className="text-xs text-muted-foreground">Deliverability</div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">18%</div>
                <div className="text-xs text-muted-foreground">Inbox Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


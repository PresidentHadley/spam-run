import { Pricing } from '@/components/marketing/Pricing'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <>
      <Pricing />
      
      {/* FAQ Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">What counts as an email check?</h3>
              <p className="text-muted-foreground">
                Each time you analyze an email (either through the web interface or API), it counts as one check against your monthly limit.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What happens if I exceed my API limit?</h3>
              <p className="text-muted-foreground">
                We'll charge $0.01 per additional check beyond your plan's API limit. You can also upgrade to a higher plan for better rates.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Is there a contract or commitment?</h3>
              <p className="text-muted-foreground">
                No contracts! All plans are month-to-month. Cancel anytime with no penalties.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button>Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


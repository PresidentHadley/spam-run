import { Hero } from '@/components/marketing/Hero'
import { Features } from '@/components/marketing/Features'
import { Pricing } from '@/components/marketing/Pricing'
import { Testimonials } from '@/components/marketing/Testimonials'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      
      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-12 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Improve Your Email Deliverability?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Join thousands of marketers and sales professionals using SPAMRUN.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                View API Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


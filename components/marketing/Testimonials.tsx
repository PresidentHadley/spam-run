import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    quote: "SPAMRUN helped us improve our cold email deliverability by 40%. It's a game-changer for our sales team.",
    author: "Sarah Johnson",
    role: "Head of Sales at TechCorp",
  },
  {
    quote: "The API is incredibly easy to integrate. We now check every email before it goes out. Our inbox rate has never been better.",
    author: "Michael Chen",
    role: "CTO at EmailPro",
  },
  {
    quote: "Finally, a tool that actually tells you WHY your emails are flagged as spam. The recommendations are spot-on.",
    author: "Emma Williams",
    role: "Marketing Director at GrowthLabs",
  },
]

export function Testimonials() {
  return (
    <section className="border-y bg-muted/50 py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Marketing and Sales Teams
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our customers have to say about SPAMRUN.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed">{testimonial.quote}</p>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    const supabase = createServiceClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.customer) {
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get the price ID to determine the plan
        const priceId = subscription.items.data[0].price.id
        let planTier = 'free'
        let monthlyLimit = 5

        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          planTier = 'pro'
          monthlyLimit = 999999
        } else if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
          planTier = 'team'
          monthlyLimit = 999999
        }

        await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            plan_tier: planTier,
            monthly_check_limit: monthlyLimit,
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            plan_tier: 'free',
            monthly_check_limit: 5,
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'invoice.payment_succeeded': {
        // Handle successful payment
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment succeeded:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        // Handle failed payment
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed:', invoice.id)
        
        if (invoice.customer) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
            })
            .eq('stripe_customer_id', invoice.customer as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed', message: error.message },
      { status: 400 }
    )
  }
}


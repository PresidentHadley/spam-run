import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  })
}

async function createOrGetCustomer(email: string, userId: string) {
  const stripe = getStripeClient()
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })

  return customer
}

async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  baseUrl: string
) {
  const stripe = getStripeClient()
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: {
      userId,
    },
  })

  return session
}

export async function POST(request: Request) {
  try {
    // Check required env vars
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await createOrGetCustomer(profile.email, user.id)
      customerId = customer.id

      // Update profile with customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create checkout session with dynamic URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://spamrun.com'
    const session = await createCheckoutSession(customerId, priceId, user.id, baseUrl)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', message: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}


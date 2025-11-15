import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const PLAN_LIMITS = {
  free: {
    checksPerMonth: 5,
    apiRequestsPerMonth: 0,
    teamMembers: 1,
    savedTemplates: 5,
    historyDays: 7,
  },
  pro: {
    checksPerMonth: 999999,
    apiRequestsPerMonth: 1000,
    teamMembers: 1,
    savedTemplates: 25,
    historyDays: 999999,
  },
  team: {
    checksPerMonth: 999999,
    apiRequestsPerMonth: 10000,
    teamMembers: 10,
    savedTemplates: 999999,
    historyDays: 999999,
  },
  enterprise: {
    checksPerMonth: 999999,
    apiRequestsPerMonth: 999999,
    teamMembers: 999999,
    savedTemplates: 999999,
    historyDays: 999999,
  },
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing`,
  })

  return session
}

export async function createOrGetCustomer(email: string, userId: string) {
  // Check if customer exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  return customer
}


import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
})

export const STRIPE_PRICES: Record<'monthly' | 'yearly', string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  yearly: process.env.STRIPE_PRICE_YEARLY!,
}

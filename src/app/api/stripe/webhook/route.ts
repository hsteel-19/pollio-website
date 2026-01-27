import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role client to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string

        // Update subscription status to pro
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'pro',
            subscription_ends_at: null,
          })
          .eq('stripe_customer_id', customerId)

        if (error) {
          console.error('Error updating profile after checkout:', error)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription & { current_period_end: number }
        const customerId = subscription.customer as string

        if (subscription.cancel_at_period_end) {
          // Subscription cancelled but still active until period end
          const periodEnd = new Date(subscription.current_period_end * 1000)
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'cancelled',
              subscription_ends_at: periodEnd.toISOString(),
            })
            .eq('stripe_customer_id', customerId)
        } else if (subscription.status === 'active') {
          // Subscription reactivated or renewed
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'pro',
              subscription_ends_at: null,
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Subscription fully ended
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'free',
            subscription_ends_at: null,
          })
          .eq('stripe_customer_id', customerId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceType } = await request.json() as { priceType: string }

    if (priceType !== 'monthly' && priceType !== 'yearly') {
      return NextResponse.json({ error: 'Invalid price type' }, { status: 400 })
    }

    const validPriceType = priceType as 'monthly' | 'yearly'

    // Fetch or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Store customer ID in profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const priceId = STRIPE_PRICES[validPriceType]

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/presentations`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        supabase_user_id: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

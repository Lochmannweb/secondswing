import Stripe from 'stripe'
import { buffer } from 'micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil',
})

type WebhookResponse = { received: boolean }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<WebhookResponse>
) {
    if (req.method !== 'POST') return res.status(405).json({ received: false })

    const sig = req.headers['stripe-signature']
    if (!sig) return res.status(400).json({ received: false })

    let event: Stripe.Event

    try {
        const buf = await buffer(req)
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch {
        return res.status(400).json({ received: false })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId ?? null

    await supabase.from('orders').insert([
        {
            user_id: userId,
            amount: session.amount_total! / 100,
            status: 'paid',
            stripe_session_id: session.id,
            currency: session.currency,
        },
        ])
    }

    res.status(200).json({ received: true })
}

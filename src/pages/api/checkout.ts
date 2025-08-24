import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

// Brug den nyeste Stripe API-version, som passer til dine typer
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil',
})  

type CheckoutRequestBody = {
    productId: string
    price: number
    sellerStripeId: string
}

type CheckoutResponse = {
    url: string | null
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CheckoutResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ url: null })
    }

    const { productId, price, sellerStripeId } = req.body as CheckoutRequestBody

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
            {
            price_data: {
                currency: 'dkk',
                product_data: { name: `Produkt ${productId}` },
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
            },
        ],
        mode: 'payment',
        payment_intent_data: {
          application_fee_amount: Math.round(price * 0.1 * 100), // 10% fee
            transfer_data: { destination: sellerStripeId },
        },
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
        })

        res.status(200).json({ url: session.url ?? null })
    } catch (error) {
        console.error('Stripe checkout error:', error)
        res.status(500).json({ url: null })
    }
}

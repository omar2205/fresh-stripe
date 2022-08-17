import { Handlers, PageProps } from '$fresh/server.ts'
import Stripe from 'stripe'
import { config as Config } from 'dotenv'

const IS_PROD = Deno.env.get('DENO_ENV') === 'prod'
if (!IS_PROD) {
  Config({ export: true })
}

const SEC_KEY = Deno.env.get('SEC_KEY') || ''

const stripe = new Stripe(SEC_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2022-08-01'
})

export const handler: Handlers = {
  async POST(req, ctx) {
    const { id, price } = await req.json()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: false,
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  },
}

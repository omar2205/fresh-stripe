import { Handlers, PageProps } from '$fresh/server.ts'
import Stripe from 'https://esm.sh/stripe@10.2.0?target=deno'
import { config as Config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'

const config = Config({ export: true })
const stripe = Stripe(config.SEC_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
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

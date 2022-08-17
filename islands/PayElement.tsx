/** @jsx h */
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { tw } from '@twind'
import { IS_BROWSER } from '$fresh/runtime.ts'

// This is just to disable loading stripe on the server
// as it uses the document
import {
  type Stripe,
  type StripeElements,
  type loadStripe as LoadStripe,
} from '@stripe/stripe-js'

let loadStripe: typeof LoadStripe

if (IS_BROWSER) {
  loadStripe = (await import('@stripe/stripe-js'))
    .loadStripe
}

declare global {
  interface Window {
    elements: StripeElements
    stripe: Stripe
  }
}

export default ({ pub_key }: { pub_key: string }) => {
  const PUB_KEY_ID = pub_key
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<null | string>(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsLoading(true)
    const { error } = await window.stripe.confirmPayment({
      elements: window.elements,
      confirmParams: {
        return_url: `${location.origin}/success`,
      },
    })

    console.log('pay_err', error)
    if (
      error.type === 'card_error' ||
      error.type === 'validation_error' ||
      error.code === 'payment_intent_authentication_failure'
    ) {
      setMessage(error.message!)
    } else {
      setMessage('An unexpected error occurred.')
    }

    setIsLoading(false)
  }

  const init = async () => {
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'alpha-02', price: 1500 }),
    })
    const { clientSecret } = await response.json()

    if (IS_BROWSER) {
      const stripe = await loadStripe(PUB_KEY_ID)

      if (stripe) {
        window.stripe = stripe
      }

      const elements = stripe?.elements({
        clientSecret,
        appearance: {
          theme: 'flat',
        },
      })

      if (elements) {
        window.elements = elements
      }

      const paymentEl = elements?.create('payment')
      paymentEl?.mount('#payment-element')
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div>
      <form id="payment-form" onSubmit={handleSubmit}>
        <div id="payment-element" />
        <div id="cc"></div>
        <button
          class={tw`bg-blue-200 h-10`}
          id="submit"
          disabled={isLoading ? true : false}
        >
          <div class="spinner hidden" id="spinner"></div>
          <span id="button-text">Pay now</span>
        </button>
        <div id="payment-message" class="hidden"></div>
      </form>
      <p class={tw`mt-4 mx-auto text-center max-w-md`}>{message}</p>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const currentBaseUrl = `${window.location.protocol}//${window.location.host}`
    const returnUrl = `${currentBaseUrl}/createpoems?action=fiat-mint-pack&status=success`

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message.toString())
    } else {
      setMessage('An unexpected error occurred.')
      toast(message, { type: 'error' })
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: 'tabs',
  }

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <LinkAuthenticationElement id='link-authentication-element' />
      <PaymentElement id='payment-element' options={paymentElementOptions} />
      <button
        disabled={isLoading || !stripe || !elements}
        id='submit'
        className='submitBtn my-2 p-8 px-0 flex flex-col justify-between items-center'
      >
        <span id='button-text'>
          {isLoading ? <div className='spinner' id='spinner'></div> : 'Pay now'}
        </span>
      </button>
      <div className='items-center'>
        <p className='term-message text-center text-xs text-gray-500 '>
          By continuing, you agree to our{' '}
          <span style={{ fontWeight: 'bold' }}> Terms and Service </span>and acknolwledge you have
          read our <span style={{ fontWeight: 'bold' }}>Privacy Policy</span>
        </p>
      </div>
      {/* Show any error or success messages */}
      {message && <div id='payment-message'>{message}</div>}
    </form>
  )
}

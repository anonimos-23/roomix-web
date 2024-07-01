import { api } from '@/lib/axios'
import type Stripe from 'stripe'

interface GetStripeAccountProps {
  storeId: string
}

interface GetStripeAccountResponse {
  isConnected: boolean
  account: Stripe.Response<Stripe.Account> | null
  payment: {
    stripeAccountId: string
    detailsSubmitted: boolean
  } | null
}

export async function getStripeAccount({ storeId }: GetStripeAccountProps) {
  const response = await api.get<GetStripeAccountResponse>(
    `/stripe/account?storeId=${storeId}`
  )

  return response.data
}

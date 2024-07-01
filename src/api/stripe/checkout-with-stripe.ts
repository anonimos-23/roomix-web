import { api } from '@/lib/axios'

interface products {
  images: string[]
  name: string
  price: number
  quantity: number
}

interface ProcessCheckoutProps {
  products: products[]
  stripeAccountId: string
}

export async function processCheckoutWithStripe({
  products,
  stripeAccountId,
}: ProcessCheckoutProps) {
  const response = await api.post<{ id: string }>('/stripe/checkout', {
    products,
    stripeAccountId,
  })

  return response
}

import { api } from '@/lib/axios'

interface ProcessCheckoutProps {
  storeId: string
  products: {
    productId: string
    quantity: number
  }[]
  address: string
  country: string
  city: string
  province: string
  zipCode: string
  notes: string | undefined
  name: string
  email: string
  totalAmount: number
}

export async function processCheckout({
  storeId,
  products,
  address,
  city,
  country,
  province,
  zipCode,
  notes,
  totalAmount,
  name,
  email,
}: ProcessCheckoutProps) {
  const response = await api.post('/checkout', {
    storeId,
    products,
    address,
    city,
    country,
    province,
    zipCode,
    notes: notes === undefined ? null : notes,
    totalAmount,
    name,
    email,
  })

  console.log(response)

  return response
}

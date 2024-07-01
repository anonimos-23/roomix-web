import { api } from '@/lib/axios'

interface AddProductToCartRequest {
  productId: string
  quantity: number
}

export async function addItemToCart({
  productId,
  quantity,
}: AddProductToCartRequest) {
  const response = await api.post(
    '/cart/item',
    { productId, quantity },
    {
      validateStatus(status) {
        return status !== 500
      },
    }
  )

  return response.status
}

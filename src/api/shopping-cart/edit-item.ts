import { api } from '@/lib/axios'

interface EditProductToCartRequest {
  productId: string
  quantity: number
}

export async function editItemFromCart({
  productId,
  quantity,
}: EditProductToCartRequest) {
  const response = await api.patch(
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

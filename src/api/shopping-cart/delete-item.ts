import { api } from '@/lib/axios'

interface DeleteProductToCartRequest {
  productId: string
}

export async function deleteItemFromCart({
  productId,
}: DeleteProductToCartRequest) {
  const response = await api.delete(`/cart/item/${productId}`, {
    validateStatus(status) {
      return status !== 500
    },
  })

  return response.status
}

import { api } from '@/lib/axios'

interface ApplyDiscountToProductRequest {
  productId: string
  discount: number
}

export async function applyDiscountToProduct({
  productId,
  discount,
}: ApplyDiscountToProductRequest) {
  const response = await api.patch(
    `/products/${productId}/discount`,
    { discount },
    {
      validateStatus: (status) => {
        return status !== 500
      },
    }
  )

  return response
}

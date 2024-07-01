import { api } from '@/lib/axios'
import { TOrder } from '@/types/entities'

interface ApplyDiscountToProductRequest {
  orderId: string
  status: TOrder['status']
}

export async function editOrderStatus({
  orderId,
  status,
}: ApplyDiscountToProductRequest) {
  const response = await api.patch(
    `/order/${orderId}/status`,
    { status },
    {
      validateStatus: (status) => {
        return status !== 500
      },
    }
  )

  return response
}

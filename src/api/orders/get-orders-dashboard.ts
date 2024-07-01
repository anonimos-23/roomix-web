import { api } from '@/lib/axios'
import { TOrder } from '@/types/entities'

export async function getOrders() {
  const response = await api.get<TOrder[]>('/orders', {
    validateStatus(status) {
      return status !== 500
    },
  })

  return { orders: response.data }
}

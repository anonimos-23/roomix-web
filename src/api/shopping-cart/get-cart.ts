import { api } from '@/lib/axios'
import { TCartItem } from '@/types/entities'

export async function getCart() {
  const response = await api.get<TCartItem[]>('/cart', {
    validateStatus(status) {
      return status !== 500
    },
  })

  return response.data
}

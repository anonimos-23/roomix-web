import { api } from '@/lib/axios'
import { TProduct } from '@/types/entities'

export async function getProduct(productId: string) {
  const response = await api.get<TProduct>(`/product/${productId}`, {
    validateStatus(status) {
      return status !== 500
    },
  })

  return response
}

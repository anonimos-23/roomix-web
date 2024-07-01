import { api } from '@/lib/axios'
import { TProduct } from '@/types/entities'

export async function getProducts() {
  const response = await api.get<TProduct[]>('/products', {
    validateStatus(status) {
      return status !== 500
    },
  })

  return { products: response.data }
}

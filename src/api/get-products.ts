import { api } from '@/lib/axios'
import { Product } from '@/types/entities'

export async function getProducts() {
  const response = await api.get<Product[]>('/products', {
    validateStatus(status) {
      return status !== 500
    },
  })

  return { products: response.data }
}

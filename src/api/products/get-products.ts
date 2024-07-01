import { api } from '@/lib/axios'
import { TProduct } from '@/types/entities'

export async function getProducts(slug: string) {
  const response = await api.get<TProduct[]>(`/store/${slug}/products`, {
    validateStatus(status) {
      return status !== 500
    },
  })

  return { products: response.data }
}

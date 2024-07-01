import { api } from '@/lib/axios'
import { TProduct } from '@/types/entities'

export async function getAllProducts() {
  const response = await api.get<TProduct[]>(`/products/all`)

  return response.data
}

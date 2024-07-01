import { api } from '@/lib/axios'

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`, {
    validateStatus(status) {
      return status !== 500
    },
  })

  return response
}

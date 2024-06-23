import { api } from '@/lib/axios'

export async function deleteImage(fileId: string) {
  const response = await api.delete(`/uploads/${fileId}`, {
    validateStatus(status) {
      return status !== 500
    },
  })

  return response
}

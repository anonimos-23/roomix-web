import { api } from '@/lib/axios'
import { TUserProfile } from '@/types/entities'

export async function getProfile() {
  const response = await api.get<TUserProfile>('/me', {
    validateStatus(status) {
      return status !== 500
    },
  })

  return { user: response.data }
}

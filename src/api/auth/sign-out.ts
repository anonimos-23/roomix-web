import { api } from '@/lib/axios'

export async function signOut() {
  const response = await api.get('/auth/logout')

  return response
}

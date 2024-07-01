import { api } from '@/lib/axios'
import { TStore } from '@/types/entities'

export async function getStores() {
  const response = await api.get<TStore[]>(`/stores/all`)

  return response.data
}

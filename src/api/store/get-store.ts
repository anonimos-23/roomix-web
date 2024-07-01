import { api } from '@/lib/axios'
import { TStore } from '@/types/entities'

export async function getStore(slug?: string) {
  if (slug) {
    const response = await api.get<TStore>(`/store/${slug}`)

    return response.data
  }

  const response = await api.get<TStore>('/store')

  return response.data
}

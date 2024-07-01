import { api } from '@/lib/axios'
import { TFAQ } from '@/types/entities'

export async function getFaqs() {
  const response = await api.get<TFAQ[]>(`/store/faqs`)

  return response.data
}

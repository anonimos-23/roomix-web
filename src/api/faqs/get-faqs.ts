import { api } from '@/lib/axios'
import { TFAQ } from '@/types/entities'

interface GetFaqsProps {
  slug: string
}

export async function getFaqs({ slug }: GetFaqsProps) {
  const response = await api.get<TFAQ[]>(`/store/faqs/${slug}`)

  return response.data
}

import { api } from '@/lib/axios'

interface DeleteFaqProps {
  faqId: number
}

export async function deleteFaq({ faqId }: DeleteFaqProps) {
  const response = await api.delete(`/store/faq/${faqId}`)

  return response
}

import { api } from '@/lib/axios'
import { TFAQ } from '@/types/entities'

interface EditFaqProps {
  faqId: TFAQ['id']
  question: string
  answer: string
}

export async function editFaq({ faqId, question, answer }: EditFaqProps) {
  const response = await api.patch(`/store/faq/${faqId}`, { question, answer })

  return response
}

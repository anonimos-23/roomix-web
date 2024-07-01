import { api } from '@/lib/axios'

interface CreateFaqProps {
  question: string
  answer: string
}

export async function createFaq({ question, answer }: CreateFaqProps) {
  const response = await api.post('/store/faq', { question, answer })

  return response
}

import { api } from '@/lib/axios'

export async function sendPasswordReset(email: string) {
  await api.post('/reset-password/send', { email })
}

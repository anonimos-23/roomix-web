import { api } from '@/lib/axios'

interface ResetPasswordRequest {
  code: string
  newPassword: string
}

export async function resetPassword({
  code,
  newPassword,
}: ResetPasswordRequest) {
  const response = await api.post(`/reset-password?code=${code}`, {
    newPassword,
  })

  return response
}

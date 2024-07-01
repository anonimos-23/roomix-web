import { api } from '@/lib/axios'

interface CreateAccountLinkProps {
  storeId: string
  retrieveAccount?: boolean | undefined
}

interface Response {
  data: {
    url: string
  } | null
  error: string | null
}

export async function createAccountLink({
  storeId,
  retrieveAccount,
}: CreateAccountLinkProps) {
  const response = await api.post<Response>(
    `/stripe/account-link`,
    {
      storeId,
      retrieveAccount,
    },
    {
      validateStatus(status) {
        return status !== 500
      },
    }
  )

  return response.data
}

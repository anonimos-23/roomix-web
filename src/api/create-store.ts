import { api } from '@/lib/axios'

interface CreateStoreRequest {
  name: string
  country: string
  email: string
  slogan: string | null
}

export interface CreateStoreResponse {
  storeId: string
}

export async function CreateStore({
  name,
  country,
  email,
  slogan,
}: CreateStoreRequest) {
  const response = await api.post<CreateStoreResponse>(
    '/store',
    {
      name,
      country,
      email,
      slogan,
    },
    {
      withCredentials: true,
      validateStatus: (status) => {
        return status !== 500
      },
    }
  )

  return response
}

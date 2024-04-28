import { RootError } from '@/errors'
import { api } from '@/lib/axios'

export interface SignInRequest {
  email: string
  password: string
}

interface ServerResponse {
  message: string | undefined
  token: string | undefined
}

export async function signIn({ email, password }: SignInRequest) {
  const response = await api
    .post<ServerResponse>(
      '/auth',
      {
        email,
        password,
      },
      {
        validateStatus: (status) => {
          return status !== 500
        },
      }
    )
    .then((response) => {
      return response
    })
    .catch(() => {
      throw new Error('Internal Server Error')
    })

  if (response.status === 400 && response.data.message) {
    throw new RootError(response.data.message)
  }

  if (response.data.token) {
    return { token: response.data.token }
  } else {
    throw new Error('Unexpected error handling login')
  }
}

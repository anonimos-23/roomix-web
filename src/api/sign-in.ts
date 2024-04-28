import { RootError } from '@/errors'
import { api } from '@/lib/axios'

export interface SignInRequest {
  email: string
  password: string
}

interface ServerResponse {
  code: string | undefined
  message: string | undefined
  token: string | undefined
}

export async function signIn({ email, password }: SignInRequest) {
  const data = await api
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
      return response.data
    })
    .catch(() => {
      throw new Error('Internal Server Error')
    })

  if (data.code === 'UNAUTHORIZED' && data.message) {
    throw new RootError(data.message)
  }

  if (data.token) {
    return { token: data.token }
  } else {
    throw new Error('Unexpected error handling login')
  }
}

import { api } from '@/lib/axios'

export interface CreateUserRequest {
  firstName: string
  lastName?: string
  email: string
  password: string
}

export async function createUser({
  firstName,
  lastName,
  email,
  password,
}: CreateUserRequest) {
  const response = await api
    .post(
      '/users',
      {
        firstName,
        lastName,
        email,
        password,
      },
      {
        validateStatus: (status) => {
          return status !== 500
        },
      }
    )
    .catch(() => {
      throw new Error('Internal Server Error')
    })

  return response
}

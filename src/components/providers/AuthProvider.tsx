import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

export interface AccessTokenPayload {
  sub: string
  storeId: string | null
}

interface AuthContextType {
  accessToken: string | null | undefined
  setAccessToken: Function
}

const AuthContext = createContext<AuthContextType | null | undefined>(undefined)

export function useAuth() {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return authContext
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(
    undefined
  )

  // Get new access token if user logged in on server
  useEffect(() => {
    async function getAccessToken() {
      try {
        const response = await api.post<{ accessToken: string }>(
          '/auth/refresh-token'
        )
        setAccessToken(response.data.accessToken)
      } catch {
        setAccessToken(null)
      }
    }

    getAccessToken()
  }, [])

  // Add access token to headers of every request
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && accessToken
          ? `Bearer ${accessToken}`
          : config.headers.Authorization
      return config
    })

    return () => {
      api.interceptors.request.eject(authInterceptor)
    }
  }, [accessToken])

  // Requests new access token in case of expiration or invalidation
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ message: string }>) => {
        const originalRequest = error.config

        if (originalRequest === undefined) {
          throw new Error('Unexpected error handling')
        }

        if (accessToken !== undefined) {
          return Promise.reject(error)
        }

        if (error.response?.status === 401) {
          setAccessToken(null)
          return Promise.reject(error)
        }

        if (error.response?.status === 403) {
          originalRequest._retry = true
          try {
            const response = await api.post<{ accessToken: string }>(
              '/auth/refresh-token'
            )
            setAccessToken(response.data.accessToken)

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            return api(originalRequest)
          } catch (e) {
            console.error(e)
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(refreshInterceptor)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

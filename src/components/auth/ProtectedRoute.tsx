import { PropsWithChildren, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useNavigate } from 'react-router-dom'

type ProtectedRouteProps = PropsWithChildren

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user === null) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  return children
}

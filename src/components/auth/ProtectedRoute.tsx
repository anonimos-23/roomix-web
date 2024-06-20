import { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'

type ProtectedRouteProps = PropsWithChildren

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken } = useAuth()
  const [isGettingAccess, setIsGettingAccess] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken === undefined) {
      setIsGettingAccess(true)
      return
    }
    if (accessToken === null) {
      navigate('/sign-in', { replace: true })
      return
    }
    setIsGettingAccess(false)
  }, [accessToken])

  if (isGettingAccess) {
    return <h1>Getting access permittions</h1>
  }

  return children
}

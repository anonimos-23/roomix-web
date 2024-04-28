import { PropsWithChildren, createContext, useContext, useState } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode, JwtPayload } from 'jwt-decode'

interface User {
  id: string
  name: string
  avatarUrl: string
}

type TokenPayload = JwtPayload & {
  sub: string
  name: string
  avatarUrl: string
}

const AuthContext = createContext<User | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const token = Cookies.get('auth')
  let [user] = useState<User | null>(null)

  if (token !== undefined) {
    const decodedToken = jwtDecode<TokenPayload>(token)

    user = {
      id: decodedToken.sub,
      name: decodedToken.name,
      avatarUrl: decodedToken.avatarUrl,
    }
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

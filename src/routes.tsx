import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SignUp } from './pages/auth/signup'
import { SignIn } from './pages/auth/signin'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <code>Landing page</code>,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
])

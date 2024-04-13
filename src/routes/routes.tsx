import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { Register } from './pages/Register'
import { Login } from './pages/Login'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <code>Root page</code>,
  },
  {
    path: '/signup',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

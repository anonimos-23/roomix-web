import { createBrowserRouter } from 'react-router-dom'
import Register from './pages/Register.tsx'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <code>Root page</code>,
  },
  {
    path: '/signup',
    element: <Register />,
  },
])

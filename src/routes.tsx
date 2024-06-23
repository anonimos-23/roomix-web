import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SignUp } from './pages/auth/signup'
import { SignIn } from './pages/auth/signin'
import { NewStore } from './pages/app/store/new'
import { ManageStoreLayout } from './pages/_layouts/ManageStoreLayout'
import { StoreOrders } from './pages/app/store/orders'
import { StoreOverview } from './pages/app/store/overview'
import { StoreProducts } from './pages/app/store/products'

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
  {
    path: '/store/new',
    element: (
      <ProtectedRoute>
        <NewStore />
      </ProtectedRoute>
    ),
  },
  {
    path: '/store/:storeId',
    element: (
      <ProtectedRoute>
        <ManageStoreLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/store/:storeId/overview',
        element: <StoreOverview />,
      },
      {
        path: '/store/:storeId/orders',
        element: <StoreOrders />,
      },
      {
        path: '/store/:storeId/products',
        element: <StoreProducts />,
      },
    ],
  },
])

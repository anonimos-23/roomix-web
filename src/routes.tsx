import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SignUp } from './pages/auth/signup'
import { SignIn } from './pages/auth/signin'
import { NewStore } from './pages/app/store/new'
import { StoreDashboardLayout } from './pages/_layouts/store-dashboard-layout'
import { StoreOverview } from './pages/app/store/dashboard/overview'
import { ManageProducts } from './pages/app/store/dashboard/products'
import { StoreLayout } from './pages/_layouts/store-layout'
import { LandingPage } from './pages/app/store/landing-page'
import { StoreProducts } from './pages/app/store/products'
import { StoreSettings } from './components/StoreSettings'
import { CheckoutPage } from './pages/app/checkout'
import { NotFound } from './pages/404'
import { ManageOrders } from './pages/app/store/dashboard/orders'
import { StoreFAQs } from './pages/app/store/faqs'
import { MarketplacePage } from '@/pages/app/marketplace/index'
import { ResetPassword } from './pages/auth/reset-password'
import { SendRecoverEmail } from './pages/auth/send-email'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <h1>Landing page</h1>,
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
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/recover-password',
    element: <SendRecoverEmail />,
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
    path: '/dashboard/:storeId',
    element: (
      <ProtectedRoute>
        <StoreDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard/:storeId/overview',
        element: <StoreOverview />,
      },
      {
        path: '/dashboard/:storeId/orders',
        element: <ManageOrders />,
      },
      {
        path: '/dashboard/:storeId/products',
        element: <ManageProducts />,
      },
      {
        path: '/dashboard/:storeId/settings',
        element: <StoreSettings />,
      },
    ],
  },
  {
    path: '/store/:slug',
    element: <StoreLayout />,
    children: [
      {
        path: '/store/:slug/',
        element: <LandingPage />,
      },
      {
        path: '/store/:slug/products',
        element: <StoreProducts />,
      },

      {
        path: '/store/:slug/faqs',
        element: <StoreFAQs />,
      },
    ],
  },
  {
    path: '/checkout/:storeId',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/marketplace',
    element: (
      <ProtectedRoute>
        <MarketplacePage />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: '*',
  //   errorElement: <NotFound />,
  // },
])

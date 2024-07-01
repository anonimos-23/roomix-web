import { useAuth } from '@/components/providers/AuthProvider'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { ManageStorePanelNavbar } from '@/components/ManagePanelNavbar'
import { ProfileCard } from '@/components/ProfileCard'
import { useMediaQuery } from '@/hooks/use-media-query'

interface AccessTokenPayload {
  userId: string
  storeId: string | null
}

export function StoreDashboardLayout() {
  const { accessToken } = useAuth()
  const { storeId } = useParams()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 950px)')

  if (!accessToken) {
    return <h1>Getting access permittions...</h1>
  }

  const payload = jwtDecode<AccessTokenPayload>(accessToken)

  if (payload.storeId === null) {
    // if gets here means user does not have a store -> redirect to a customer accessible page
    navigate('/marketplace', { replace: true })
    return
  } else if (payload.storeId !== storeId) {
    navigate(`/dashboard/${payload.storeId}/overview`)
  }

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-[10%] bg-zinc-900 px-8 flex items-center justify-between">
        {isDesktop && <img src="/logo.svg" width={'7.5%'} alt="Roomix Logo" />}
        <ManageStorePanelNavbar storeId={payload.storeId} />
        <div className="flex items-center gap-2">
          <ProfileCard />
        </div>
      </div>
      <div className="w-full h-[90%] flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}

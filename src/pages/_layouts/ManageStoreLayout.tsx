import { NavLink } from '@/components/NavLink'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import {
  Home,
  Package,
  Presentation,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react'

interface AccessTokenPayload {
  userId: string
  storeId: string | null
}

export function ManageStoreLayout() {
  const { storeId } = useParams()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  if (!accessToken) {
    return <h1>Getting access permittions...</h1>
  }

  const payload = jwtDecode<AccessTokenPayload>(accessToken)

  if (payload.storeId === null) {
    // if gets here means user does not have a store -> redirect to a customer accessible page
    navigate('/marketplace', { replace: true })
  } else if (payload.storeId !== storeId) {
    navigate(`/store/${payload.storeId}/overview`)
  }

  return (
    <div className="w-screen h-screen">
      <nav className="w-full h-[10%] bg-zinc-900 px-8 flex items-center justify-between">
        <img src="/logo.svg" width={'7.5%'} alt="Roomix Logo" />
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            <NavigationMenuItem>
              <NavLink icon={Home} href={`/store/${storeId}/overview`}>
                Resumo
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink icon={Package} href={`/store/${storeId}/orders`}>
                Encomendas
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink icon={ShoppingBag} href={`/store/${storeId}/products`}>
                Produtos
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink icon={Presentation} href={`/store/${storeId}/marketing`}>
                Marketing
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink icon={TrendingUp} href={`/store/${storeId}/analitics`}>
                Dados estatísticos
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex">
          <span className="text-white">
            Bem vindo, <b className="font-medium">Diogo</b>
          </span>
          <img src="" alt="Profile Image" />
        </div>
      </nav>
      <div className="w-full h-[90%] flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}

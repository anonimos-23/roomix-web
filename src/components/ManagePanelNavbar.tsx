import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu'
import {
  Home,
  Package,
  ShoppingBag,
  Presentation,
  TrendingUp,
} from 'lucide-react'
import { NavLink } from '@/components/NavLink'

interface ManageStorePanelNavbarProps {
  storeId: string
}

export function ManageStorePanelNavbar({
  storeId,
}: ManageStorePanelNavbarProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-2">
        <NavigationMenuItem>
          <NavLink icon={Home} href={`/dashboard/${storeId}/overview`}>
            Resumo
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink icon={Package} href={`/dashboard/${storeId}/orders`}>
            Encomendas
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink icon={ShoppingBag} href={`/dashboard/${storeId}/products`}>
            Produtos
          </NavLink>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <NavLink icon={Presentation} href={`/dashboard/${storeId}/marketing`}>
            Marketing
          </NavLink>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <NavLink icon={TrendingUp} href={`/dashboard/${storeId}/analitics`}>
            Dados estatísticos
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

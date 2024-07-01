import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import {
  LayoutDashboard,
  LogOut,
  PackageOpen,
  Plus,
  Settings2,
  SquarePen,
  Store,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getProfile } from '@/api/user/get-profile'
import { TUserProfile } from '@/types/entities'
import { getImage } from '@/api/images/get-image'
import { Separator } from './ui/separator'
import { useNavigate } from 'react-router-dom'
import { signOut } from '@/api/auth/sign-out'
import { ShoppingCart } from './ShoppingCart'

export function ProfileCard() {
  const [user, setUser] = useState<TUserProfile | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUserProfile() {
      const { user } = await getProfile()

      if (user.fileId !== null) {
        const { imagesUrls } = await getImage([user.fileId])

        setAvatarUrl(imagesUrls[0])
      }

      setUser(user)
    }

    fetchUserProfile()
  }, [])

  if (user === null) {
    return <h1>Fetching user data...</h1>
  }

  const storeId = user.storeId

  async function handleLogout() {
    const response = await signOut()

    if (response.status === 200) {
      navigate('/sign-in', { replace: true })
      return
    }

    console.log(response)
  }

  return (
    <>
      <div className="flex items-center gap-4">
        {!document.location.href.includes('/dashboard') && <ShoppingCart />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 rounded-full flex items-center">
              <Avatar className="h-full w-full">
                <AvatarImage
                  className="rounded-full"
                  src={avatarUrl !== null ? avatarUrl : ''}
                />
                <AvatarFallback>
                  {user.name.split(' ')[0].charAt(0) +
                    user.name.split(' ')[1].charAt(0)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 px-4 py-5 z-50">
            <span className="text-neutral-800">
              Olá, <b className="font-medium">{user.name}</b>
            </span>
            <DropdownMenuSeparator />
            <span className="font-semibold text-muted-foreground text-sm">
              Menu de utilizador
            </span>
            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
              <Button
                variant={'outline'}
                className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                onClick={() => {}}
              >
                <SquarePen className="h-4 w-4" />
                Editar perfil
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
              <Button
                variant={'outline'}
                className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                onClick={() => navigate('/marketplace')}
              >
                <Store className="h-4 w-4" />
                Mercado
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
              <Button
                variant={'outline'}
                className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                onClick={() => navigate('/orders')}
              >
                <PackageOpen className="h-4 w-4" />
                Encomendas
              </Button>
            </DropdownMenuItem>

            <Separator className="mt-8" />

            {storeId !== null ? (
              <>
                <span className="font-semibold text-muted-foreground text-sm">
                  Menu da loja
                </span>
                <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                  <Button
                    variant={'outline'}
                    className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                    onClick={() => navigate(`/dashboard/${storeId}/overview`)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Painel de gestor
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                  <Button
                    variant={'outline'}
                    className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                    onClick={() => navigate(`/dashboard/${storeId}/settings`)}
                  >
                    <Settings2 className="h-4 w-4" />
                    Definições da loja
                  </Button>
                </DropdownMenuItem>

                <Separator className="mt-8 mb-2" />
              </>
            ) : (
              <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                <Button
                  variant={'outline'}
                  className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                  onClick={() => navigate(`/store/new`)}
                >
                  <Plus className="h-4 w-4" />
                  Criar loja
                </Button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
              <Button
                variant={'default'}
                className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-zinc-800"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

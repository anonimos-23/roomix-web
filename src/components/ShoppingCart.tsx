import { ShoppingCartIcon } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './ui/sheet'
import { Button } from './ui/button'
import { CartItem } from './CartItem'
import { useEffect, useState } from 'react'
import { getCart } from '@/api/shopping-cart/get-cart'
import { TCartItem } from '@/types/entities'
import { LoadingSpinner } from './LoadingSpinner'
import { useNavigate } from 'react-router-dom'

export function ShoppingCart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<TCartItem[] | null>(null)
  const [itemDeleted, setItemDeleted] = useState(false)

  useEffect(() => {
    async function fetchCartItems() {
      const data = await getCart()

      setCart(data)
    }

    fetchCartItems()
  }, [itemDeleted])

  if (cart === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-transparent hover:bg-neutral-50/10">
            <ShoppingCartIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="h-screen min-w-[500px] w-1/4">
          <SheetHeader className="h-[10%]">
            <SheetTitle>Carrinho de compras</SheetTitle>
            <SheetDescription>
              Estes são todos os itens que tens adicionados ao teu carrinho
            </SheetDescription>
          </SheetHeader>
          <div className="h-[90%] overflow-auto flex flex-col">
            {cart.map((group, index) => {
              return (
                <div
                  key={index}
                  className="border border-zinc-200 rounded-sm flex flex-col p-2 mb-2"
                >
                  <span className="font-medium">{group.store.name}</span>
                  <div className="p-2 flex flex-col gap-2">
                    {group.items.map((item, index) => {
                      return (
                        <CartItem
                          setItemDeleted={setItemDeleted}
                          key={index}
                          item={item}
                        />
                      )
                    })}
                  </div>
                  <Button
                    className="flex gap-2 items-center"
                    onClick={() => navigate(`/checkout/${group.store.id}`)}
                  >
                    Checkout
                  </Button>
                </div>
              )
            })}
            <SheetFooter>
              <SheetClose>
                <Button variant={'outline'}>Continuar a comprar</Button>
              </SheetClose>
              {/* <Button onClick={handleCheckout}>Finalizar compras</Button> */}
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

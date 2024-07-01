import { getImage } from '@/api/images/get-image'
import { getCart } from '@/api/shopping-cart/get-cart'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { CheckoutCard } from '@/components/checkout-card'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckoutForm } from './_components/form'
import { ShoppingBasket } from 'lucide-react'

export interface TCheckoutProduct {
  productId: string
  image: string
  name: string
  price: number
  quantity: number
  discount: number
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { storeId } = useParams()
  const [cart, setCart] = useState<TCheckoutProduct[] | null>(null)

  if (!storeId) {
    navigate('/marketplace')
    return
  }

  useEffect(() => {
    async function fetch() {
      const cart = await getCart()

      if (!cart || cart.length === 0) {
        navigate('/marketplace')
      }

      const products = []

      const index = cart.findIndex((group) => group.store.id === storeId)

      for (let i = 0; i < cart[index].items.length; i++) {
        const { imagesUrls } = await getImage(cart[index].items[i].images)

        products.push({
          productId: cart[index].items[i].productId,
          image: imagesUrls[0],
          name: cart[index].items[i].name,
          price: cart[index].items[i].price,
          quantity: cart[index].items[i].quantity,
          discount: cart[index].items[i].discount,
        })
      }

      setCart(products)
    }

    fetch()
  }, [])

  if (!cart) {
    navigate('/marketplace')
    return
  }

  let subTotal = 0
  let discounts = 0

  cart.forEach((item) => {
    discounts += item.price * (item.discount / 100) * item.quantity
    subTotal += item.price * item.quantity
  })

  let total = subTotal - discounts

  return (
    <div className="h-screen w-screen">
      <nav className="p-4 border-b border-b-zinc-300 h-[10%] flex items-center">
        <img src="/logo-light.webp" className="w-[10%]" alt="Roomix logo" />
      </nav>
      <div className="flex h-[90%]">
        <div className="w-1/2 p-4">
          <CheckoutForm cart={cart} totalAmount={total} storeId={storeId} />
        </div>
        <div className="w-1/2 bg-neutral-100 p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-4 h-full overflow-auto">
            {cart.map((product, index) => (
              <CheckoutCard key={index} item={product} />
            ))}
          </div>
          <div className="flex flex-col items-end mr-4">
            <div className="flex flex-col gap-2">
              <span>
                Sub Total:{' '}
                {subTotal.toLocaleString('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
              <span>
                Descontos:{' '}
                {discounts.toLocaleString('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
              <span className="font-medium">
                Total:{' '}
                {total.toLocaleString('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <Button
              form="checkoutForm"
              type="submit"
              className="flex gap-2 items-center mt-4"
            >
              <ShoppingBasket className="w-4 h-4" />
              Finalizar compra
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

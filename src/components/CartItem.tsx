import { useEffect, useState } from 'react'
import { getImage } from '@/api/images/get-image'
import { LoadingSpinner } from './LoadingSpinner'
import { Input } from './ui/input'
import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { deleteItemFromCart } from '@/api/shopping-cart/delete-item'
import { toast } from 'sonner'
import { editItemFromCart } from '@/api/shopping-cart/edit-item'

export interface CartItemProps {
  setItemDeleted: (itemDeleted: boolean) => void
  item: {
    productId: string
    name: string
    price: number
    discount: number
    quantity: number
    images: string[]
  }
}

export function CartItem({ setItemDeleted, item }: CartItemProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number | null>(null)

  useEffect(() => {
    async function fetchProductData() {
      const { imagesUrls } = await getImage(item.images)

      setImagePreview(imagesUrls[0])
    }

    setQuantity(item.quantity)
    fetchProductData()
  }, [])

  if (imagePreview === null || quantity === null) {
    return <LoadingSpinner />
  }

  async function handleDeleteItem(productId: string) {
    await deleteItemFromCart({ productId }).then((status) => {
      if (status === 200) {
        toast.info('Item removido do carrinho')
        setItemDeleted(true)
      }
    })
  }

  async function handleEditItem(quantity: number, productId: string) {
    await editItemFromCart({ productId, quantity })
  }

  return (
    <>
      <div className="border rounded-sm flex">
        <div className="w-1/3 h-full">
          <img
            src={imagePreview}
            className="w-full h-full rounded-lg"
            alt="Imagem do produto"
          />
        </div>
        <div className="flex-1 flex justify-between">
          <div className="flex-1 flex flex-col justify-between p-2">
            <div className="flex flex-col gap-1">
              <span>{item.name}</span>
              <span>
                {item.price.toLocaleString('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
            <Input
              type="number"
              className="w-1/2"
              onChange={(e) => setQuantity(Number(e.target.value))}
              onBlur={() => handleEditItem(quantity, item.productId)}
              defaultValue={quantity}
            />
          </div>
          <div className="w-12 basis-12 shrink-0">
            <Button
              variant={'ghost'}
              onClick={() => handleDeleteItem(item.productId)}
              className="rounded-full w-12 h-12"
            >
              <Trash2 className="stroke-1" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

import { TProduct } from '@/types/entities'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { useEffect, useState } from 'react'
import { getImage } from '@/api/images/get-image'
import { Info } from 'lucide-react'
import { ProductDetails } from './ProductDetails'

interface ProductCardProps {
  product: TProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageCover, setImageCover] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProductImage() {
      const { imagesUrls } = await getImage(product.images)

      setImageCover(imagesUrls[0])
    }

    fetchProductImage()
  }, [])

  return (
    <>
      <ProductDetails isOpen={isOpen} setIsOpen={setIsOpen} product={product} />
      <Card className="w-1/6">
        <CardContent className="w-full h-full p-0 flex flex-col items-center">
          <img
            className="w-full"
            src={imageCover ?? ''}
            alt="Imagem do produto"
          />
          <div className="h-full w-full flex flex-col justify-between p-2">
            <div className="flex flex-col">
              <span className="font-medium">{product.name}</span>
              {product.discount !== 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="line-through">
                      {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(product.price)}
                    </span>

                    <span>
                      {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(
                        product.price - product.price * (product.discount / 100)
                      )}
                    </span>
                  </div>

                  <span className="bg-green-200 border border-green-400 rounded-sm px-1">
                    {product.discount}%
                  </span>
                </div>
              ) : (
                <span>
                  {new Intl.NumberFormat('pt-PT', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(product.price)}
                </span>
              )}
            </div>
            <Button className="gap-2 mt-2" onClick={() => setIsOpen(true)}>
              <Info className="stroke-[1.5]" />
              Ver mais
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

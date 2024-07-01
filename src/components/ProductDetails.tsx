import { getImage } from '@/api/images/get-image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TProduct } from '@/types/entities'
import { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel'
import { LoadingSpinner } from './LoadingSpinner'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { addItemToCart } from '@/api/shopping-cart/add-item'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { toast } from 'sonner'

interface ProductDetailsProps {
  product: TProduct
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const formSchema = z.object({
  quantity: z.coerce.number().positive('Valor inválido!'),
})
type FormSchema = z.infer<typeof formSchema>

export function ProductDetails({
  product,
  setIsOpen,
  isOpen,
}: ProductDetailsProps) {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      quantity: 1,
    },
  })
  const [productImages, setProductImages] = useState<string[] | null>(null)

  useEffect(() => {
    async function fetchProductImage() {
      const { imagesUrls } = await getImage(product.images)

      setProductImages(imagesUrls)
    }

    fetchProductImage()
  }, [])

  async function onSubmit({ quantity }: FormSchema) {
    await addItemToCart({ productId: product.id, quantity }).then((status) => {
      if (status === 201) {
        toast.success('Produto adicionado ao carrinho.')
        setIsOpen(false)
      } else {
        toast.error('Erro inesperado', {
          description:
            'Algo de inesperado aconteceu com os nossos servidores! Tente novamente mais tarde.',
        })
      }
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[1000px] w-[90%]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Informações detalhadas
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center">
            <Carousel className="w-full max-w-xs mx-8">
              <CarouselContent>
                {productImages === null ? (
                  <LoadingSpinner />
                ) : (
                  productImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img src={image} alt={`Imagem ${index}`} />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              {productImages !== null && productImages.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
            <div className="flex flex-col justify-between ml-8 w-full h-full">
              <div className="flex flex-col gap-4">
                <p className="font-medium">
                  Nome:
                  <br />
                  <span className="font-normal">{product.name}</span>
                </p>
                <p className="font-medium">
                  Descrição:
                  <br />
                  <span className="leading-relaxed font-normal">
                    {product.description}
                  </span>
                </p>
                <p className="font-medium flex items-center gap-1">
                  Preço:
                  {product.discount !== 0 ? (
                    <div className="inline-flex w-full items-center justify-between">
                      <div className="flex gap-1">
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
                            product.price -
                              product.price * (product.discount / 100)
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
                </p>
              </div>
              <Form handleSubmit={handleSubmit} control={control} {...form}>
                <form
                  id="addItemToCart"
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex items-center justify-between"
                >
                  <FormField
                    control={control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl className="flex items-center">
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    form="addItemToCart"
                    type="submit"
                    className="flex gap-2 items-center"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar ao carrinho
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

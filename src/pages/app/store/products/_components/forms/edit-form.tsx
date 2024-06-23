import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Product } from '@/types/entities'
import { Label } from '@radix-ui/react-label'
import { getImage } from '@/api/images/get-image'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { deleteImage } from '@/api/images/delete-image'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { EditProduct } from '@/api/edit-product'

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome precisa no mínimo 2 caractéres' })
    .max(100),
  price: z.coerce
    .number()
    .positive({ message: 'O preço precisa de ser positivo' })
    .multipleOf(0.01, {
      message: 'O preço não pode ter mais de 2 casas decimais',
    }),
  description: z
    .string()
    .max(250, {
      message: 'A descrição só pode ter no máximo 250 caractéres',
    })
    .optional(),
  stock: z.coerce.number(),
  can_sell_without_stock: z.enum(['yes', 'no']),
  images: z.instanceof(FileList).refine((fileList) => fileList.length <= 3, {
    message: 'Só podes adicionar no máximo 3 imagens por produto',
  }),
})
type FormSchema = z.infer<typeof formSchema>

interface EditProductFormProps {
  product: Product
  setIsSubmitting: (isSubmitting: boolean) => void
  onSubmissionCompleted: (type: 'edit' | 'delete') => void
}

export function EditProductForm({
  product,
  setIsSubmitting,
  onSubmissionCompleted,
}: EditProductFormProps) {
  product.images

  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: product.stock,
      can_sell_without_stock: product.can_sell_without_stock ? 'yes' : 'no',
    },
  })
  const imagesRef = form.register('images')
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    async function fetchCoverImage() {
      const { imagesUrls } = await getImage(product.images)

      setImagePreviews(imagesUrls)
    }

    fetchCoverImage()
  }, [])

  useEffect(() => {
    setIsSubmitting(isLoading)
  }, [isLoading, setIsSubmitting])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nAllowedFiles = 3 - imagePreviews.length

    if (nAllowedFiles === 0) {
      form.setError('images', {
        message: 'Este produto já tem 3 imagens associadas.',
      })
      return
    }

    const files = e.target.files

    if (files && files.length <= nAllowedFiles) {
      const fileArray = Array.from(files)
      const filePreviews = fileArray.map((file) => URL.createObjectURL(file))
      setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray])
      setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews])

      // Convert File[] into FileList
      const fileList = new DataTransfer()
      ;[...selectedFiles, ...fileArray].forEach((file) =>
        fileList.items.add(file)
      )

      // Update the form state
      form.setValue('images', fileList.files)
      return
    }

    if (files && files.length > nAllowedFiles) {
      form.setError('images', {
        message: `${imagePreviews.length} imagen(s) já estão associadas a este produto, só podes selecionar mais ${nAllowedFiles}.`,
      })
      return
    }
  }

  async function handleRemoveImage(index: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    )
    setSelectedFiles(newFiles)

    // Call api to delete product
    await deleteImage(product.images[index]).then((response) => {
      if (response.status === 204) {
        toast.success('Imagem eliminada!')
      }
    })
  }

  async function onSubmit({
    name,
    description,
    price,
    stock,
    can_sell_without_stock,
    images,
  }: FormSchema) {
    await EditProduct({
      productId: product.id,
      name,
      description: description ?? null,
      price,
      stock,
      can_sell_without_stock: can_sell_without_stock === 'yes' ? true : false,
      images,
    }).then((response) => {
      if (response.status === 204) {
        onSubmissionCompleted('edit')
        toast.success('Produto editado com sucesso!')
      }
    })
  }

  return (
    <Form handleSubmit={handleSubmit} control={control} {...form}>
      <form
        id="editProductForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        {/* Image uploader */}
        <FormField
          control={control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Imagem de capa</FormLabel>
              <div className="flex items-center gap-4 flex-wrap">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="flex w-28 h-28">
                    <img
                      key={index}
                      className="w-full h-full border-2 border-white dark:border-gray-800"
                      src={src}
                      alt={`preview-${index}`}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={'destructive'}
                          className="relative -top-5 right-3 hover:text-white bg-transparent w-2 h-8 text-zinc-900 rounded-full flex items-center justify-center text-xs"
                        >
                          X
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar imagem</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação é permanente e irá eliminar esta imagem
                            sem qualquer forma de recuperação futura. Tem a
                            certeza que pretende eliminar?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              variant={'destructive'}
                              onClick={() => handleRemoveImage(index)}
                            >
                              Confirmar
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
                {imagePreviews.length < 3 && (
                  <Label
                    htmlFor="imagesInp"
                    className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  >
                    <Plus className="h-4 w-4" />
                  </Label>
                )}
                <FormControl>
                  <Input
                    multiple
                    className="hidden"
                    id="imagesInp"
                    type="file"
                    accept="image/*"
                    {...imagesRef}
                    onChange={handleImageChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name field */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description field */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price field */}
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input type="number" step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sell without stock condition field */}
        <FormField
          control={control}
          name="can_sell_without_stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autorizar vendas sem stock</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={product.can_sell_without_stock ? 'yes' : 'no'}
                  className="flex space-x-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">Não</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Sim</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateProduct } from '@/api/create-product'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-label'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Form schema type declaration
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
  images: z.instanceof(FileList).refine((fileList) => fileList.length <= 3, {
    message: 'Só podes adicionar no máximo 3 imagens por produto',
  }),
})
type FormSchema = z.infer<typeof formSchema>

interface AddProductFormProps {
  setIsSubmitting: (isSubmitting: boolean) => void
  onSubmissionCompleted: () => void
}

export function AddProductForm({
  setIsSubmitting,
  onSubmissionCompleted,
}: AddProductFormProps) {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  })
  const imagesRef = form.register('images')
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    setIsSubmitting(form.formState.isSubmitting)
  }, [form.formState.isSubmitting, setIsSubmitting])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files) {
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
    }
  }

  function handleRemoveImage(index: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    )
    setSelectedFiles(newFiles)

    // Convert File[] into FileList
    const fileList = new DataTransfer()
    newFiles.forEach((file) => fileList.items.add(file))

    // Update the form state
    form.setValue('images', fileList.files)
  }

  async function onSubmit({ name, price, description, images }: FormSchema) {
    await CreateProduct({
      name,
      price,
      description: description ?? null,
      images,
    }).then((response) => {
      if (response.status === 201) {
        onSubmissionCompleted()
        toast.success('Produto adicionado com sucesso!')
      }
    })
  }

  return (
    <Form control={control} handleSubmit={handleSubmit} {...form}>
      <form
        id="addProductForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
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
                    <Button
                      variant={'destructive'}
                      className="relative -top-5 right-3 hover:text-white bg-transparent w-2 h-8 text-zinc-900 rounded-full flex items-center justify-center text-xs"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Label
                  htmlFor="imagesInp"
                  className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </Label>
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
      </form>
    </Form>
  )
}

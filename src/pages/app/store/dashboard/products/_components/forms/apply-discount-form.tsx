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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'
import { TProduct } from '@/types/entities'
import { applyDiscountToProduct } from '@/api/products/apply-discount'
import { toast } from 'sonner'

const formSchema = z.object({
  discount: z.coerce
    .number()
    .min(0, 'Como o valor é uma percentagem precisa de estar entre 0 e 100.')
    .max(100, 'Como o valor é uma percentagem precisa de estar entre 0 e 100.'),
})
type FormSchema = z.infer<typeof formSchema>

interface EditProductFormProps {
  product: TProduct
  setIsSubmitting: (isSubmitting: boolean) => void
  onSubmissionCompleted: (type: 'edit' | 'delete' | 'apply_discount') => void
}

export function ApplyDiscountToProductForm({
  product,
  setIsSubmitting,
  onSubmissionCompleted,
}: EditProductFormProps) {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      discount: product.discount,
    },
  })

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    setIsSubmitting(isLoading)
  }, [isLoading, setIsSubmitting])

  async function onSubmit({ discount }: FormSchema) {
    const response = await applyDiscountToProduct({
      productId: product.id,
      discount,
    })

    if (response.status === 200) {
      onSubmissionCompleted('apply_discount')
      toast.success('Desconto aplicado com sucesso!')
    }
  }

  return (
    <Form handleSubmit={handleSubmit} control={control} {...form}>
      <form
        id="applyDiscountToProductForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <FormField
          control={control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desconto (%)</FormLabel>
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

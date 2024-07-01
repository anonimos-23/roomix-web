import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'
import { TOrder } from '@/types/entities'
import { toast } from 'sonner'
import { editOrderStatus } from '@/api/orders/edit-status'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'

const formSchema = z.object({
  status: z.enum(['Canceled', 'Preparing', 'Delivering', 'Delivered']),
})
type FormSchema = z.infer<typeof formSchema>

interface EditOrderStatusFormProps {
  order: TOrder
  setIsSubmitting: (isSubmitting: boolean) => void
  onSubmissionCompleted: (type: 'status' | 'details') => void
}

export function EditOrderStatusForm({
  order,
  setIsSubmitting,
  onSubmissionCompleted,
}: EditOrderStatusFormProps) {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      status: order.status,
    },
  })

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    setIsSubmitting(isLoading)
  }, [isLoading, setIsSubmitting])

  async function onSubmit({ status }: FormSchema) {
    const response = await editOrderStatus({ orderId: order.id, status })

    if (response.status === 200) {
      onSubmissionCompleted('status')
      toast.success('Estado atualizado com sucesso!')
    }
  }

  return (
    <Form handleSubmit={handleSubmit} control={control} {...form}>
      <form
        id="editOrderStatusForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado da encomenda</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleciona o estado desta encomenda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        value="Canceled"
                        className="border-2 border-red-300 bg-red-100"
                      >
                        Cancelar
                      </SelectItem>
                      <SelectItem value="Preparing">Em preparo</SelectItem>
                      <SelectItem value="Delivering">Em entrega</SelectItem>
                      <SelectItem value="Delivered">Entregue</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

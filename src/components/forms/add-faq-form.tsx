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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { createFaq } from '@/api/faqs/create-faq'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '../ui/dialog'

const formSchema = z.object({
  question: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, { message: 'Campo obrigatório' }),
  answer: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, { message: 'Campo obrigatório' }),
})
type FormSchema = z.infer<typeof formSchema>

export function AddFaqButton() {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  })
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function onSubmit({ question, answer }: FormSchema) {
    const response = await createFaq({ question, answer })

    if (response.status === 201) {
      toast.success('FAQ criada com sucesso.')
      setIsFormOpen(false)
    }

    if (response.status === 409) {
      toast.warning('Já tens o limite máximo de 5 FAQs por loja.')
      setIsFormOpen(false)
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <Plus />
            Adicionar FAQ
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Nova FAQ</DialogTitle>
          </DialogHeader>
          <div>
            <Form handleSubmit={handleSubmit} control={control} {...form}>
              <form
                id="addFaqForm"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-between space-y-2 sm:px-0 px-4 h-full"
              >
                <FormField
                  control={control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pergunta</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resposta</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DialogFooter>
            <DialogClose className="border-2 border-zinc-900 px-4 rounded-md font-medium">
              Cancelar
            </DialogClose>
            <Button type="submit" form="addFaqForm" className="flex gap-2">
              {isSubmitting ? (
                <img src="/loading.gif" alt="Loading ..." width={'15%'} />
              ) : (
                <>
                  Criar
                  <Plus />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

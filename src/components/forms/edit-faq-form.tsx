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
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { TFAQ } from '@/types/entities'
import { toast } from 'sonner'
import { editFaq } from '@/api/faqs/edit-faq'
import { Save, SquarePen } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger,
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

interface EditProductFormProps {
  faq: TFAQ
}

export function EditFaqButton({ faq }: EditProductFormProps) {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      question: faq.question,
      answer: faq.answer,
    },
  })
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function onSubmit({ question, answer }: FormSchema) {
    await editFaq({
      faqId: faq.id,
      question,
      answer,
    }).then((response) => {
      if (response.status === 200) {
        toast.success('FAQ editada com sucesso!')
        setIsFormOpen(false)
      }
    })
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button variant={'outline'} className="flex gap-2">
            <SquarePen />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Editar FAQ</DialogTitle>
          </DialogHeader>
          <div>
            <Form handleSubmit={handleSubmit} control={control} {...form}>
              <form
                id="editFaqForm"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-2 sm:px-0 px-4"
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
            <Button type="submit" form="editFaqForm" className="flex gap-2">
              {isSubmitting ? (
                <img src="/loading.gif" alt="Loading ..." width={'15%'} />
              ) : (
                <>
                  Guardar
                  <Save />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

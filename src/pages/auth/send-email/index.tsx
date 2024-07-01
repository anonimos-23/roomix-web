import { sendPasswordReset } from '@/api/auth/send-password-reset'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email({ message: 'Email inválido!' }),
})
type FormSchema = z.infer<typeof formSchema>

export function SendRecoverEmail() {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  })

  async function onSubmit({ email }: FormSchema) {
    await sendPasswordReset(email)
    toast.info('Email de recuperação', {
      description:
        'Se encontrarmos alguma conta com este email, será enviado um email para redefinir a sua palavra-passe.',
    })
  }
  return (
    <div className="w-screen h-screen">
      <nav className="h-[10%] flex items-center justify-center px-8">
        <img src="/logo-light.webp" width={'10%'} alt="Roomix logo" />
      </nav>
      <div className="h-[90%] flex items-center justify-center">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Recuperar palavra-passe</CardTitle>
            <CardDescription>
              Digite o email da conta que pretende tentar recuperar a
              palavra-passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form handleSubmit={handleSubmit} control={control} {...form}>
              <form
                id="sendPasswordRecoverForm"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-between space-y-2 sm:px-0 px-4 h-full"
              >
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button form="sendPasswordRecoverForm">Enviar email</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

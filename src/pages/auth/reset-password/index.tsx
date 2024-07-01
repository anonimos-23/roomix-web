import { resetPassword } from '@/api/auth/reset-password'
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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  newPassword: z
    .string({ required_error: 'Campo obrigatório' })
    .min(8, { message: 'Mínimo de 8 caractéres' }),
  confirmNewPassword: z
    .string({ required_error: 'Campo obrigatório' })
    .min(8, { message: 'Mínimo de 8 caractéres' }),
})
type FormSchema = z.infer<typeof formSchema>

export function ResetPassword() {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  if (!code) {
    navigate('/sign-in', { replace: true })
    return
  }

  async function onSubmit({ newPassword, confirmNewPassword }: FormSchema) {
    if (code === null) {
      navigate('/sign-in', { replace: true })
      return
    }

    if (newPassword !== confirmNewPassword) {
      form.setError('confirmNewPassword', {
        message: 'As palavras passe não coincidem',
      })
    }

    const response = await resetPassword({ code, newPassword })

    if (response.status === 404) {
      toast.error('Nenhum pedido de recuperação foi feito.')
    }

    if (response.status === 201) {
      toast.success('Palavra-passe alterada com sucesso!', {
        duration: 2000,
        onAutoClose: () => navigate('/sign-in'),
      })
    }
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
          </CardHeader>
          <CardContent>
            <Form handleSubmit={handleSubmit} control={control} {...form}>
              <form
                id="resetPasswordForm"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-between space-y-2 sm:px-0 px-4 h-full"
              >
                <FormField
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova palavra-passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova palavra-passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button form="resetPasswordForm">Recuperar palavra-passe</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

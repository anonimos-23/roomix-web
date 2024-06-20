import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, AtSign } from 'lucide-react'
import { useState, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { SignInRequest, signIn } from '@/api/sign-in'
import { RootError } from '@/errors'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/AuthProvider'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormFields = z.infer<typeof schema>

export function LoginForm() {
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const emailByParams = searchParams.get('email')
  const { setAccessToken } = useAuth()

  const [formState, setFormState] = useState<FormFields>({
    email: '',
    password: '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }))
  }

  const canSubmit = !(formState.email && formState.password)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) })

  async function onSubmit({ email, password }: SignInRequest) {
    await signIn({ email, password })
      .then((response) => {
        setAccessToken(response.accessToken)
        navigate('/')
      })
      .catch((error) => {
        if (error instanceof RootError) {
          toast.warning(error.message)
        } else {
          toast.error('Erro inesperado.', {
            description:
              'Ocorreu um erro com os nossos servidores! Por favor, tente novamente mais tarde.',
            closeButton: true,
          })
        }
      })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="signupForm"
        className="mt-8 mb-6 flex flex-col items-center gap-8"
      >
        <div className="flex items-center flex-col w-full">
          <div className="flex items-center pl-4 rounded-full w-1/2 border border-input">
            <Label htmlFor="email">
              <AtSign className="text-zinc-400" />
            </Label>
            <Input
              {...register('email')}
              type="text"
              placeholder="Email"
              className="w-full border-none text-zinc-400"
              defaultValue={emailByParams !== null ? emailByParams : ''}
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        </div>
        <div className="flex items-center flex-col w-full">
          <div className="flex items-center pl-4 rounded-full w-1/2 border border-input">
            <Label htmlFor="password">
              <Lock className="text-zinc-400" />
            </Label>
            <Input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full border-none text-zinc-400"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>
      <div className="flex flex-col items-center justify-center">
        <Button
          type="submit"
          form="signupForm"
          className="bg-zinc-800 text-white hover:bg-zinc-700 font-bold tracking-wider rounded-full pr-8 pl-8 w-1/4"
          disabled={canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <img src="/loading.gif" alt="Loading ..." width={'15%'} />
          ) : (
            'Iniciar sessão'
          )}
        </Button>
      </div>
    </>
  )
}

import { createUser } from '@/api/create-user'
import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, CaseSensitive, AtSign } from 'lucide-react'
import Cookies from 'js-cookie'
import { useState, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const signUpSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
})

type SignUpSchema = z.infer<typeof signUpSchema>

interface FormState {
  email: string
  firstName: string
  password: string
  confirmPassword: string
}

export function SignUpForm() {
  let navigate = useNavigate()

  const [formState, setFormState] = useState<FormState>({
    email: '',
    firstName: '',
    password: '',
    confirmPassword: '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }))
  }

  const canSubmit = !(
    formState.firstName &&
    formState.email &&
    formState.password &&
    formState.confirmPassword
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpSchema>({ resolver: zodResolver(signUpSchema) })

  async function onSubmit({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }: SignUpSchema) {
    if (password !== confirmPassword) {
      toast.info('As palavras-passe não coincidem')
      return
    }

    await createUser({
      firstName,
      lastName,
      email,
      password,
    })
      .then(async (response) => {
        if (response.status === 201) {
          await signIn({ email, password })
            .then((response) => {
              var inHalfADay = 0.5

              Cookies.set('auth', response.token, {
                expires: inHalfADay,
              })

              toast.success('Conta criada', {
                description:
                  'Será brevemente redirecionado para a página da sua loja!',
                duration: 3000,
                onAutoClose: () => {
                  navigate(`/store/new`)
                },
                classNames: {
                  description: 'text-muted-foreground',
                },
              })
            })
            .catch((error: any) => {
              console.log('Error: ', error)

              toast.error('Erro inesperado.', {
                description:
                  'Algo correu de forma inesperado com os nossos servidores! A sua conta foi criada mas não conseguimos redirecioná-lo, por favor inicie sessão manualmente.',
                action: {
                  label: 'Iniciar sessão',
                  onClick: () => {
                    navigate(`/sign-in?email=${email}`)
                  },
                },
                closeButton: true,
              })
            })
        }

        if (response.status === 409) {
          toast.warning('Email em uso', {
            description: 'Já existe uma conta com este email associado.',
            duration: 5000,
          })
        }
      })
      .catch((_error) => {
        toast.error('Erro inesperado.', {
          description:
            'Ocorreu um erro com os nossos servidores! Por favor, tente novamente mais tarde.',
          duration: 5000,
        })
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
            <Label htmlFor="firstName">
              <CaseSensitive className="text-zinc-400" />
            </Label>
            <Input
              {...register('firstName')}
              type="text"
              placeholder="Nome"
              className="w-full border-none text-zinc-400"
              onChange={handleInputChange}
              id="firstName"
              autoFocus
            />
          </div>
        </div>
        <div className="flex items-center pl-4 rounded-full w-1/2 border border-input">
          <Label htmlFor="lastName">
            <CaseSensitive className="text-zinc-400" />
          </Label>
          <Input
            {...register('lastName', { required: false })}
            type="text"
            placeholder="Apelido"
            className="w-full border-none text-zinc-400"
            id="lastName"
          />
        </div>
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
              onChange={handleInputChange}
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
        <div className="flex items-center flex-col w-full">
          <div className="flex items-center pl-4 rounded-full w-1/2 border border-input">
            <Label htmlFor="confirmPassword">
              <Lock className="text-zinc-400" />
            </Label>
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirme a password"
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
            <img src="/loading.gif" alt="Loading ..." width={'20%'} />
          ) : (
            'Criar'
          )}
        </Button>
      </div>
    </>
  )
}

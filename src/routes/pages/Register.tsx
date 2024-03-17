import { Card, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AtSign, CaseSensitive, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { api } from '@/lib/api'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ConfirmPasswordDismatchError,
  EmailAlreadyTakenError,
} from '@/errors.ts'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
})

type FormFields = z.infer<typeof schema>

interface FormState {
  email: string
  firstName: string
  password: string
  confirmPassword: string
}

export default function Register() {
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        throw new ConfirmPasswordDismatchError(
          'As palavras-passe não coincidem.'
        )
      }

      const userToCreate = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
      }

      await api
        .post('/users', userToCreate)
        .then((response) => {
          if (response.status === 201) {
            navigate('/login')
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            throw new EmailAlreadyTakenError(error.response.data.message)
          }
        })
    } catch (error: any) {
      if (error instanceof ConfirmPasswordDismatchError) {
        setError('confirmPassword', {
          message: error.message,
        })
      } else if (error instanceof EmailAlreadyTakenError) {
        setError('email', {
          message: error.message,
        })
      }
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex bg-zinc-900 items-center justify-center h-full w-1/2">
        <img src="/logo.svg" alt="Roomix Logo" className="w-1/2" />
      </div>
      <Card className="p-8 h-full w-1/2 bg-white bg-opacity-20 flex flex-col justify-evenly">
        <CardTitle className=" text-center text-4xl font-bold">
          Criar conta
        </CardTitle>
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
            <div className="flex items-start justify-start text-start">
              {errors.firstName && (
                <span className="text-red-500">{errors.firstName.message}</span>
              )}
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
            <div className="flex items-start justify-start text-start">
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
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
            <div className="flex items-start justify-start text-start">
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
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
            <div className="flex items-start justify-start text-start">
              {errors.confirmPassword && (
                <span className="text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
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
        <CardFooter className="mt-2 flex justify-center">
          <div>
            <span className="text-muted-foreground">
              Já tem uma conta criada?&nbsp;
            </span>
            <Link className="font-medium" to={'/'}>
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

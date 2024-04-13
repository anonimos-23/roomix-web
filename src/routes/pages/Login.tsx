import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, AtSign } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { RootError } from '@/errors'
import Cookies from 'js-cookie'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormFields = z.infer<typeof schema>

interface FormState {
  email: string
  password: string
}

export function Login() {
  const navigate = useNavigate()

  const [formState, setFormState] = useState<FormState>({
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const userToAuthenticate = {
        email: data.email,
        password: data.password,
      }

      await api
        .post('/auth', userToAuthenticate)
        .then((response) => {
          if (response.status === 200) {
            var inHalfADay = 0.5
            Cookies.set('auth', response.data.token, {
              expires: inHalfADay,
            })
            navigate('/')
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            throw new RootError(error.response.data.message)
          }
        })
    } catch (error: any) {
      setError('root', {
        message: error.message,
      })
    }
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="p-8 h-full w-1/2 bg-white bg-opacity-20 flex flex-col justify-evenly">
        <CardTitle className=" text-center text-4xl font-bold">
          Iniciar Sessão
        </CardTitle>
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
              'Iniciar sessão'
            )}
          </Button>
        </div>
        <CardFooter className="mt-2 flex justify-center">
          <div>
            <span className="text-muted-foreground">
              Não tem conta criada?&nbsp;
            </span>
            <Link className="font-medium" to={'/register'}>
              Criar conta
            </Link>
          </div>
        </CardFooter>
      </Card>
      <div className="flex bg-zinc-900 items-center justify-center h-full w-1/2">
        <img src="/logo.svg" alt="Roomix Logo" className="w-1/2" />
      </div>
    </div>
  )
}

import { Card, CardTitle, CardFooter } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { LoginForm } from './form'

export function SignIn() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="p-8 h-full w-1/2 bg-white bg-opacity-20 flex flex-col justify-evenly">
        <CardTitle className=" text-center text-4xl font-bold">
          Iniciar Sessão
        </CardTitle>
        <LoginForm />
        <CardFooter className="mt-2 flex flex-col justify-center">
          <div>
            <Link className="hover:underline" to={'/recover-password'}>
              Recuperar palavra-passe
            </Link>
          </div>
          <div>
            <span className="text-muted-foreground">
              Não tem conta criada?&nbsp;
            </span>
            <Link className="font-medium hover:underline" to={'/sign-up'}>
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

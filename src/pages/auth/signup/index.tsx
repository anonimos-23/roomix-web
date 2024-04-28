import { Card, CardTitle, CardFooter } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { SignUpForm } from './signup-form'

export function SignUp() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex bg-zinc-900 items-center justify-center h-full w-1/2">
        <img src="/logo.svg" alt="Roomix Logo" className="w-1/2" />
      </div>
      <Card className="p-8 h-full w-1/2 bg-white bg-opacity-20 flex flex-col justify-evenly">
        <CardTitle className=" text-center text-4xl font-bold">
          Criar conta
        </CardTitle>
        <SignUpForm />
        <CardFooter className="mt-2 flex justify-center">
          <div>
            <span className="text-muted-foreground">
              Já tem uma conta criada?&nbsp;
            </span>
            <Link className="font-medium" to={'/sign-in'}>
              Iniciar sessão
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

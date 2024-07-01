import { createAccountLink } from '@/api/stripe/create-account-link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { LoadingSpinner } from './LoadingSpinner'
import { useParams } from 'react-router-dom'

export function ManageStoreIntegrations() {
  const { storeId } = useParams()
  const [loading, setLoading] = useState(false)

  if (storeId === undefined) {
    return
  }

  return (
    <div>
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Integração com o Stripe</CardTitle>
          <CardDescription>
            Integra a tua loja com o Stripe para começares a receber pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="flex gap-2"
            onClick={async () => {
              setLoading(true)

              try {
                const { data, error } = await createAccountLink({ storeId })

                if (error) {
                  console.log(error)
                  toast.error('Algo de inesperado aconteceu', {
                    description: error,
                  })
                  return
                }

                if (data) {
                  window.location.href = data.url
                }
              } finally {
                setLoading(false)
              }
            }}
          >
            {loading && <LoadingSpinner />}
            Conectar ao Stripe
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

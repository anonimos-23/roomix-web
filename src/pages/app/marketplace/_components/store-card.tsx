import { getImage } from '@/api/images/get-image'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TStore } from '@/types/entities'
import { Globe, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface StoreCartProps {
  store: TStore
}

export function StoreCard({ store }: StoreCartProps) {
  const navigate = useNavigate()
  const [logo, setLogo] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    async function fetch() {
      if (store.images.logoId === undefined) {
        setLogo(null)
        return
      }

      const { imagesUrls } = await getImage([store.images.logoId])

      setLogo(imagesUrls[0])
      return
    }

    fetch()
  }, [])

  if (logo === undefined) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Card className="w-1/6">
        <CardContent className="w-full h-full p-0 flex flex-col items-center">
          <img
            className="w-full"
            src={logo ?? '/no-image.png'}
            alt="Imagem da loja"
          />
          <div className="h-full w-full flex flex-col justify-between p-2">
            <div className="flex flex-col">
              <span className="font-medium">{store.name}</span>
              <span className="italic">{store.slogan}</span>
            </div>
            <Button
              className="gap-2 mt-2"
              onClick={() => navigate(`/store/${store.slug}`)}
            >
              <Globe className="stroke-[1.5]" />
              Explorar
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

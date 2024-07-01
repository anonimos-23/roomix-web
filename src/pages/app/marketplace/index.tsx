import { ProfileCard } from '@/components/ProfileCard'
import { useState } from 'react'
import { MarketProducts } from './_components/market-products'
import { MarketStores } from './_components/market-stores'
import { Button } from '@/components/ui/button'

export function MarketplacePage() {
  const [actualPage, setActualPage] = useState<'stores' | 'products'>(
    'products'
  )

  return (
    <div className="h-screen">
      <nav className="h-[10%] bg-neutral-800 flex items-center justify-between px-12">
        <img src="/logo-dark.webp" width={'10%'} alt="Roomix logo" />
        <h1 className="text-neutral-50 font-medium text-3xl">Mercado</h1>
        <ProfileCard slug="2948440978" />
      </nav>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-center">
          <div>
            <Button variant={'link'} onClick={() => setActualPage('stores')}>
              Lojas
            </Button>
            <Button variant={'link'} onClick={() => setActualPage('products')}>
              Produtos
            </Button>
          </div>
        </div>
        <div>
          {actualPage === 'products' && <MarketProducts />}
          {actualPage === 'stores' && <MarketStores />}
        </div>
      </div>
    </div>
  )
}

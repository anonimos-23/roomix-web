import { TStore } from '@/types/entities'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getStores } from '@/api/store/get-stores'
import { StoreCard } from './store-card'

export function MarketStores() {
  const [stores, setStores] = useState<TStore[] | null>(null)

  useEffect(() => {
    async function fetch() {
      const stores = await getStores()

      setStores(stores)
    }

    fetch()
  }, [])

  if (!stores) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-evenly gap-4 p-8">
      {stores.map((store, index) => (
        <StoreCard key={index} store={store} />
      ))}
    </div>
  )
}

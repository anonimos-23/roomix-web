import { TProduct } from '@/types/entities'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProductCard } from '@/components/ProductCard'
import { getAllProducts } from '@/api/products/get-all-products'

export function MarketProducts() {
  const [products, setProducts] = useState<TProduct[] | null>(null)

  useEffect(() => {
    async function fetch() {
      const products = await getAllProducts()

      setProducts(products)
    }

    fetch()
  }, [])

  if (!products) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }
  return (
    <div>
      <div className="flex flex-wrap justify-evenly gap-4 p-8">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  )
}

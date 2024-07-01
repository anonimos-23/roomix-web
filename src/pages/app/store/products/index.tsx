import { getProducts } from '@/api/products/get-products'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProductCard } from '@/components/ProductCard'
import { TProduct } from '@/types/entities'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// import { useParams } from 'react-router-dom'

export function StoreProducts() {
  const { slug } = useParams()

  const [products, setProducts] = useState<TProduct[] | null>(null)

  // const isDesktop = useMediaQuery('(min-width: 950px)')

  useEffect(() => {
    async function fetchProducts() {
      if (slug === undefined) {
        return
      }

      const { products } = await getProducts(slug)

      setProducts(products)
    }

    fetchProducts()
  }, [])

  if (products === null) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <div>
        <h1 className="text-center my-4 font-semibold text-2xl">Produtos</h1>
      </div>
      <div className="flex flex-wrap justify-evenly gap-4 p-8">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  )
}

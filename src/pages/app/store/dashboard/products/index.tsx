import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { TProduct } from '@/types/entities'
import { useEffect, useState } from 'react'
import { getProducts } from '@/api/products/get-products-dashboard'

export function ManageProducts() {
  const [products, setProducts] = useState<TProduct[] | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      const { products } = await getProducts()

      setProducts(products)
    }

    fetchProducts()
  }, [])

  if (products === null) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="mt-4 font-bold text-2xl">Produtos</h1>
      <div className="w-full h-full p-8 flex flex-col justify-between">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  )
}

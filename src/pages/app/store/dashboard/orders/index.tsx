import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { TOrder } from '@/types/entities'
import { useEffect, useState } from 'react'
import { getOrders } from '@/api/orders/get-orders-dashboard'

export function ManageOrders() {
  const [orders, setOrders] = useState<TOrder[] | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      const { orders } = await getOrders()

      setOrders(orders)
    }

    fetchProducts()
  }, [])

  if (orders === null) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="mt-4 font-bold text-2xl">Encomendas</h1>
      <div className="w-full h-full p-8 flex flex-col justify-between">
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  )
}

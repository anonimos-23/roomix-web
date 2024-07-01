'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableRowActions } from './data-table-row-actions'
import { TOrder } from '@/types/entities'

export const columns: ColumnDef<TOrder>[] = [
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue<string>('status')

      if (status === 'Canceled') {
        return <div>Cancelado</div>
      }
      if (status === 'Preparing') {
        return <div>Em preparo</div>
      }
      if (status === 'Delivering') {
        return <div>Em entrega</div>
      }
      if (status === 'Delivered') {
        return <div>Entregue</div>
      }

      return <div>valor (status) inesperado</div>
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Nome do cliente',
  },
  {
    accessorKey: 'country',
    header: 'País',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ row }) => {
      const totalAmount = parseFloat(row.getValue('totalAmount'))
      const formatted = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }).format(totalAmount)

      return <div>{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

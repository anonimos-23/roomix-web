'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableRowActions } from './data-table-row-actions'
import { TProduct } from '@/types/entities'

export const columns: ColumnDef<TProduct>[] = [
  {
    accessorKey: 'slug',
    header: '#',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'price',
    header: () => <div className="font-medium">Preço</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
      }).format(price)

      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: 'discount',
    header: 'Desconto',
    cell: ({ row }) => {
      const discount = parseFloat(row.getValue('discount'))

      return <div>{discount} %</div>
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

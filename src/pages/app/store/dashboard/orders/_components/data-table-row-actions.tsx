import { Row } from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  MoreHorizontal,
  Save,
  SlidersHorizontal,
  SquarePen,
} from 'lucide-react'
import { TOrder } from '@/types/entities'
import { EditOrderStatusForm } from './forms/edit-status-form'
import { OrderDetails } from '@/components/OrderDetails'

interface DataTableRowActionsProps {
  row: Row<TOrder>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleFormSubmissionCompleted(type: 'status' | 'details') {
    if (type === 'details') {
      setIsDetailsOpen(false)
      return
    }
    if (type === 'status') {
      setIsEditStatusOpen(false)
      return
    }
  }

  return (
    <>
      {/* Order details dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[50%]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Detalhes da encomenda
            </DialogTitle>
          </DialogHeader>
          <>
            <OrderDetails order={row.original} />
          </>
          <DialogFooter>
            <DialogClose className="flex gap-2 items-center border-2 border-zinc-900 px-4 rounded-md font-medium">
              Fechar
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit order status dialog */}
      <Dialog open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Alterar estado da encomenda
            </DialogTitle>
          </DialogHeader>
          <div>
            <EditOrderStatusForm
              order={row.original}
              setIsSubmitting={setIsSubmitting}
              onSubmissionCompleted={handleFormSubmissionCompleted}
            />
          </div>
          <DialogFooter>
            <DialogClose className="flex gap-2 items-center border-2 border-zinc-900 px-4 rounded-md font-medium">
              Fechar
            </DialogClose>
            <Button
              type="submit"
              form="editOrderStatusForm"
              className="flex gap-2"
            >
              {isSubmitting ? (
                <img src="/loading.gif" alt="Loading ..." width={'15%'} />
              ) : (
                <>
                  Guardar
                  <Save className="h-6 w-6" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[160px] flex flex-col gap-1 z-50"
        >
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <Button
              variant={'outline'}
              onClick={() => {
                setIsDetailsOpen(true)
              }}
              className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <SquarePen className="h-4 w-4" />
              Ver detalhes
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <Button
              variant={'outline'}
              onClick={() => {
                setIsEditStatusOpen(true)
              }}
              className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Atualizar estado
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

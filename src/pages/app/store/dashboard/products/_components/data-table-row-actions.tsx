import { Row } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  BadgePercent,
  MoreHorizontal,
  Save,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react'
import { EditProductForm } from './forms/edit-form'
import { DeleteProductForm } from './forms/delete-form'
import { TProduct } from '@/types/entities'
import { ApplyDiscountToProductForm } from './forms/apply-discount-form'

interface DataTableRowActionsProps {
  row: Row<TProduct>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isApplyDiscountOpen, setIsApplyDiscountOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Clean body element style 'pointerEvents' that when is none blocks all events, e.g. button clicks, ...
  useEffect(() => {
    if (isEditOpen || isDeleteOpen) {
      document.body.style.pointerEvents = 'none'
    } else {
      document.body.style.pointerEvents = 'auto'
    }

    return () => {
      document.body.style.pointerEvents = 'auto'
    }
  }, [isEditOpen, isDeleteOpen])
  //

  function handleFormSubmissionCompleted(
    type: 'edit' | 'delete' | 'apply_discount'
  ) {
    if (type === 'edit') {
      setIsEditOpen(false)
      return
    }
    if (type === 'delete') {
      setIsDeleteOpen(false)
      return
    }
    if (type === 'apply_discount') {
      setIsApplyDiscountOpen(false)
      return
    }
  }

  return (
    <>
      {/* Edit product dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Editar produto</DialogTitle>
          </DialogHeader>
          <div>
            <EditProductForm
              setIsSubmitting={setIsSubmitting}
              onSubmissionCompleted={handleFormSubmissionCompleted}
              product={row.original}
            />
          </div>
          <DialogFooter>
            <DialogClose className="flex gap-2 items-center border-2 border-zinc-900 px-4 rounded-md font-medium">
              Cancelar
            </DialogClose>
            <Button type="submit" form="editProductForm" className="flex gap-2">
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

      {/* Apply discount */}
      <Dialog open={isApplyDiscountOpen} onOpenChange={setIsApplyDiscountOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Aplicar desconto</DialogTitle>
          </DialogHeader>
          <div>
            <ApplyDiscountToProductForm
              setIsSubmitting={setIsSubmitting}
              onSubmissionCompleted={handleFormSubmissionCompleted}
              product={row.original}
            />
          </div>
          <DialogFooter>
            <DialogClose className="flex gap-2 items-center border-2 border-zinc-900 px-4 rounded-md font-medium">
              Cancelar
            </DialogClose>
            <Button
              type="submit"
              form="applyDiscountToProductForm"
              className="flex gap-2"
            >
              {isSubmitting ? (
                <img src="/loading.gif" alt="Loading ..." width={'15%'} />
              ) : (
                <>
                  Aplicar
                  <Save className="h-6 w-6" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete product dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Eliminar produto</DialogTitle>
            <DialogDescription>
              Se continuar todas as informações relacionadas a este produto
              serão <b>permanentemente</b> eliminadas!
            </DialogDescription>
          </DialogHeader>
          <div>
            <DeleteProductForm
              onSubmissionCompleted={handleFormSubmissionCompleted}
              product={row.original}
            />
          </div>
          <DialogFooter className="flex justify-center sm:justify-between">
            <DialogClose className="flex gap-2 items-center border-2 border-zinc-900 px-4 rounded-md font-medium">
              <X />
              Cancelar
            </DialogClose>
            <Button
              variant={'destructive'}
              type="submit"
              form="deleteProductForm"
              className="flex gap-2"
            >
              {isSubmitting ? (
                <img src="/loading.gif" alt="Loading ..." width={'15%'} />
              ) : (
                <>
                  Eliminar
                  <Trash2 className="h-6 w-6" />
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
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <Button
              variant={'outline'}
              onClick={() => {
                setIsEditOpen(true)
              }}
              className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <SquarePen className="h-4 w-4" />
              Ver detalhes
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <Button
              variant={'outline'}
              onClick={() => {
                setIsApplyDiscountOpen(true)
              }}
              className="w-full justify-start flex gap-2 items-center rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <BadgePercent className="h-4 w-4" />
              Aplicar desconto
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <Button
              variant={'outline'}
              onClick={() => {
                setIsDeleteOpen(true)
              }}
              className="w-full justify-start flex gap-2 items-center text-red-500 border-red-400 rounded-md p-2 transition-all duration-75 hover:text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

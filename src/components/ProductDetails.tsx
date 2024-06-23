import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from './ui/dialog'
import { Plus, Save } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import { Product } from '@/pages/app/store/products/_components/columns'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  console.log(product)
  return (
    <Dialog open={true} defaultOpen={true}>
      {/* <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus />
          Adicionar produto
        </Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-medium">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            Aqui podes editar qualquer informação sobre este produto.
          </DialogDescription>
        </DialogHeader>
        <div>
          <h2>formulario</h2>
        </div>
        <DialogFooter className="flex justify-center sm:justify-between">
          <DialogClose className="border-2 border-zinc-900 px-4 rounded-md font-medium">
            Cancelar
          </DialogClose>
          <Button type="submit" form="addProductForm" className="flex gap-2">
            Guardar
            <Save />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

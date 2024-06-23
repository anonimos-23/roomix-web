import { Plus } from 'lucide-react'
import { Button } from './ui/button'
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
import { AddProductForm } from '@/pages/app/store/products/_components/forms/add-form'
import { useState } from 'react'

export function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  function handleFormSubmissionCompleted() {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus />
          Adicionar produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Novo produto</DialogTitle>
          <DialogDescription>
            Depois de criado poderás alterar qualquer informação sobre este
            produto.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AddProductForm
            setIsSubmitting={setIsSubmitting}
            onSubmissionCompleted={handleFormSubmissionCompleted}
          />
        </div>
        <DialogFooter>
          <DialogClose className="border-2 border-zinc-900 px-4 rounded-md font-medium">
            Cancelar
          </DialogClose>
          <Button type="submit" form="addProductForm" className="flex gap-2">
            {isSubmitting ? (
              <img src="/loading.gif" alt="Loading ..." width={'15%'} />
            ) : (
              <>
                Criar
                <Plus />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

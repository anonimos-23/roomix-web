import { Trash2 } from 'lucide-react'
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { TFAQ } from '@/types/entities'
import { deleteFaq } from '@/api/faqs/delete-faq'
import { toast } from 'sonner'

interface DeleteFaqButtonProps {
  faqId: TFAQ['id']
}

export function DeleteFaqButton({ faqId }: DeleteFaqButtonProps) {
  async function handleDeleteFaq(faqId: number) {
    const response = await deleteFaq({ faqId })

    if (response.status === 200) {
      toast.success('FAQ eliminada com sucesso!')
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={'destructive'} className="w-14">
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente e sem nenhuma forma de recuperação futura.
              Tem a certeza que pretende eliminar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={'destructive'}
                onClick={() => handleDeleteFaq(faqId)}
              >
                Confirmar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

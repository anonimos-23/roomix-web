import { useEffect, useState } from 'react'
import { AddFaqButton } from './forms/add-faq-form'
import { getFaqs } from '@/api/faqs/get-faqs-dashboard'
import { TFAQ } from '@/types/entities'
import { LoadingSpinner } from './LoadingSpinner'
import { EditFaqButton } from './forms/edit-faq-form'
import { DeleteFaqButton } from './forms/delete-faq-form'

export function ManageStorePages() {
  const [faqs, setFaqs] = useState<TFAQ[] | null>(null)

  useEffect(() => {
    async function fetch() {
      const faqs = await getFaqs()

      console.log(faqs)

      setFaqs(faqs)
    }

    fetch()
  }, [])

  if (!faqs) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-medium text-2xl">Gerir conteúdo das páginas</h2>
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="font-medium text-xl">Conteúdo da página FAQ's</h3>
          <p className="leading-relaxed text-sm">
            As FAQ (Frequently Asked Questions) têm uma página dedicada no teu
            site e servem para responder a perguntas que são feitas
            regularmente. Só podes adicionar um máximo de 5 FAQ's
          </p>
        </div>
        <div>
          <div className="flex justify-end">
            <AddFaqButton />
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {faqs.length !== 0 ? (
              faqs.map((faq, index) => {
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <DeleteFaqButton faqId={faq.id} />
                      <EditFaqButton faq={faq} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{faq.question}</span>
                      <span>{faq.answer}</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <span>Nenhuma FAQ foi adicionada</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { getFaqs } from '@/api/faqs/get-faqs'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TFAQ } from '@/types/entities'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export function StoreFAQs() {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState<TFAQ[] | null>(null)
  const { slug } = useParams()

  if (!slug) {
    navigate('/marketplace')
    return
  }

  useEffect(() => {
    async function fetch() {
      if (!slug) {
        navigate('/marketplace')
        return
      }
      const faqs = await getFaqs({ slug })

      setFaqs(faqs)
    }

    fetch()
  }, [])

  if (!faqs) {
    return (
      <div className="h-11/12 w-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="h-[90%]">
      <div className="">
        <h1 className="text-center my-4 font-semibold text-2xl">
          Frequently Asked Questions
        </h1>
      </div>
      <div className="flex justify-center mt-8">
        <Accordion type="multiple" className="w-1/2">
          {faqs.length !== 0 ? (
            faqs.map((faq, index) => {
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              )
            })
          ) : (
            <span>
              O dono desta loja não adicionou nenhuma FAQ por enquanto
            </span>
          )}
        </Accordion>
      </div>
    </div>
  )
}

import { TCheckoutProduct } from '@/pages/app/checkout'

interface CheckoutCardProps {
  item: TCheckoutProduct
}

export function CheckoutCard({ item }: CheckoutCardProps) {
  return (
    <div className="flex border border-neutral-200 rounded-sm items-center w-3/4">
      <div>
        <img src={item.image} className="w-24" alt={`${item.name} image`} />
      </div>
      <div className="flex flex-col gap-1 p-2">
        <span className="font-medium">{item.name}</span>
        <span>
          {item.price.toLocaleString('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          })}
        </span>
        <span>
          Qtd: <b className="font-medium">{item.quantity}</b>
        </span>
      </div>
    </div>
  )
}

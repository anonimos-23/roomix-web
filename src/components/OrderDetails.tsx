import { TOrder } from '@/types/entities'

interface OrderDetailsProps {
  order: TOrder
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="flex h-[70%]">
      <div className="w-1/2 p-4 space-y-4">
        <div className="w-full">
          <h2 className="font-medium text-xl mb-2">Informações da entrega</h2>
          <div className="flex flex-col">
            <span className="font-medium">Morada:</span>
            <span>{order.address}</span>
          </div>
        </div>
        <div className="flex justify-between w-2/3">
          <div className="flex flex-col">
            <span className="font-medium">País:</span>
            <span>{order.country}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Cidade:</span>
            <span>{order.city}</span>
          </div>
        </div>
        <div className="flex justify-between w-2/3">
          <div className="flex flex-col">
            <span className="font-medium">Localidade:</span>
            <span>{order.province}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Código postal:</span>
            <span>{order.postal}</span>
          </div>
        </div>
        <div className="flex  w-full">
          <div className="flex flex-col">
            <span className="font-medium">Notas do cliente:</span>
            <span>{order.customerNotes}</span>
          </div>
        </div>
        <div>
          <h2 className="font-medium text-xl mb-2 mt-8">
            Informações de contacto
          </h2>
          <div className="flex flex-col">
            <span className="font-medium">Nome do cliente:</span>
            <span>{order.customerName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Email do cliente:</span>
            <span>{order.customerEmail}</span>
          </div>
        </div>
      </div>
      <div className="w-1/2 bg-neutral-100 p-4 flex flex-col justify-between">
        <div className="flex flex-col gap-4 h-full overflow-auto">
          {order.products.map((product, index) => (
            <>
              <div key={index} className="flex justify-between">
                <span className="font-medium">{product.name}</span>
                <span>
                  Qtd: <b className="font-medium">{product.quantity}</b>
                </span>
              </div>
            </>
          ))}
        </div>
        <div className="flex flex-col items-end mr-4">
          <span className="font-medium">
            Total:{' '}
            {parseFloat(order.totalAmount).toLocaleString('pt-PT', {
              style: 'currency',
              currency: 'EUR',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

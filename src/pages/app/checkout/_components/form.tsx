import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { CommandList } from 'cmdk'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CountryProps, getCountries } from '@/api/get-countries'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TCheckoutProduct } from '..'
import { processCheckout } from '@/api/checkout'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  address: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, { message: 'Campo obrigatório' }),
  country: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, { message: 'Campo obrigatório' }),
  city: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, { message: 'Campo obrigatório' }),
  province: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, { message: 'Campo obrigatório' }),
  zipCode: z
    .string({ required_error: 'Campo obrigatório' })
    .regex(/^\d{4}-\d{3}?$/, {
      message: 'O código postal deve segir o formato: 1234-567',
    }),
  name: z
    .string({ required_error: 'Campo obrigatório' })
    .min(2, { message: 'Campo obrigatório' }),
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email({ message: 'Email inválido' }),
  notes: z.string().optional(),
})
type FormSchema = z.infer<typeof formSchema>

interface CheckoutFormProps {
  cart: TCheckoutProduct[]
  totalAmount: number
  storeId: string
}

export function CheckoutForm({
  cart,
  totalAmount,
  storeId,
}: CheckoutFormProps) {
  const navigate = useNavigate()
  const [countries, setCountries] = useState<CountryProps[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  })

  useEffect(() => {
    async function fetchCountries() {
      try {
        setIsFetching(true)
        const { countries } = await getCountries()

        setCountries(countries)
      } finally {
        setIsFetching(false)
      }
    }

    fetchCountries()
  }, [])

  if (isFetching) {
    return <LoadingSpinner />
  }

  async function onSubmit({
    address,
    country,
    city,
    province,
    zipCode,
    notes,
    name,
    email,
  }: FormSchema) {
    let products = []

    for (let i = 0; i < cart.length; i++) {
      products.push({
        productId: cart[i].productId,
        quantity: cart[i].quantity,
      })
    }

    const response = await processCheckout({
      storeId,
      products,
      address,
      country,
      city,
      province,
      zipCode,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      name,
      email,
      notes,
    })

    if (
      response.status === 200 &&
      response.data.caneceledProductIds.length === 0
    ) {
      toast.success('Compra efetuada com sucesso.', {
        onAutoClose: () => navigate('/orders'),
      })
    } else if (
      response.status === 200 &&
      response.data.caneceledProductIds.length !== 0
    ) {
      toast.warning('Compra efetuada mas alguns itens foram cancelados.', {
        description: `${response.data.caneceledProductIds.length} items foram cancelados da encomenda por falta de stock, mas os restantes foram registados`,
      })
    } else {
      console.log(response)
      toast.error(
        'Algo de inesperado ocorreu enquanto processava-mos o checkout.'
      )
    }
  }

  return (
    <Form handleSubmit={handleSubmit} control={control} {...form}>
      <form
        id="checkoutForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4 h-full"
      >
        <div className="w-full">
          <h2 className="font-medium text-xl mb-2">Informações da entrega</h2>
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Morada</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 w-full">
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>País</FormLabel>
                <br />
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? countries.find(
                              (country) => country.name === field.value
                            )?.name
                          : 'Seleciona um país'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList className="overflow-scroll h-96">
                          <CommandInput placeholder="Procurar país..." />
                          <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => (
                              <CommandItem
                                key={country.key}
                                value={country.name}
                                onSelect={() => {
                                  form.setValue('country', country.name)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === country.name
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {country.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 w-full">
          <FormField
            control={control}
            name="province"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Localidade</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2 w-full">
          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Notas de encomenda{' '}
                  <span className="text-neutral-400">(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    rows={5}
                    placeholder="Coloque aqui qualquer informação que considere útil para o vendedor."
                    {...field}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <h2 className="font-medium text-xl mb-2 mt-8">
            Informações de contacto
          </h2>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}

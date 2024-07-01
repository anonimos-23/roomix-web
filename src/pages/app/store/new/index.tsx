'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'
import { CommandList } from 'cmdk'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { ChevronsUpDown, Check, ArrowRight } from 'lucide-react'
import { CountryProps, getCountries } from '@/api/get-countries'
import { toast } from 'sonner'
import { CreateStore } from '@/api/store/create-store'
import { useNavigate } from 'react-router-dom'

// Form schema type declaration
const formSchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  slogan: z.string().optional(),
  email: z.string().email(),
})
type FormSchema = z.infer<typeof formSchema>

export function NewStore() {
  const navigate = useNavigate()
  const [cardPage, setCardPage] = useState(1)
  const [countries, setCountries] = useState<CountryProps[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      country: undefined,
      slogan: undefined,
      email: '',
    },
    mode: 'onTouched',
  })

  useEffect(() => {
    async function fetchCountries() {
      try {
        const { countries } = await getCountries()
        setCountries(countries)
      } catch (error) {
        console.log(`Error fetching countries: ${error}`)
      } finally {
        setIsFetching(false)
      }
    }

    fetchCountries()
  }, [])

  if (isFetching) {
    // Make a better loading screen
    return <h1>Loading...</h1>
  }

  async function onSubmit({ name, country, email, slogan }: FormSchema) {
    await CreateStore({
      name,
      country,
      email,
      slogan: slogan === undefined ? null : slogan,
    })
      .then((response) => {
        if (response.status === 409) {
          toast.warning('Já existe uma loja associada a esta conta!')
        }
        if (response.status === 201) {
          const storeId = response.data.storeId
          navigate(`/dashboard/${storeId}/overview`)
        }
      })
      .catch((error) => {
        console.log('Error: ', error)
        toast.error('Erro inesperado.', {
          description:
            'Ocorreu um erro com os nossos servidores! Por favor, tente novamente mais tarde.',
          duration: 5000,
        })
      })
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-2/4 h-1/2">
        <CardHeader>
          <CardTitle className="place-self-center font-bold text-3xl">
            Cria a tua loja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form control={control} handleSubmit={handleSubmit} {...form}>
            <form id="newStoreForm" onSubmit={handleSubmit(onSubmit)}>
              {/* Store Name Field */}
              <div className={cardPage === 1 ? 'block' : 'hidden'}>
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. Nome da loja</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    let fieldValue = form.getValues('name')
                    if (fieldValue.length >= 2) {
                      setCardPage(cardPage + 1)
                      return
                    }
                    if (fieldValue.length === 0) {
                      toast.warning('Campo obrigatório', {
                        description:
                          'Este campo não é opcional e tem de ser preenchido!',
                      })
                      return
                    }
                    toast.info('Tamanho mínimo obrigatório', {
                      description:
                        'O nome da sua loja precisa de ter pelo menos 2 caracteres.',
                    })
                  }}
                  className="bg-zinc-950 text-white rounded-full flex items-center gap-1 hover:bg-zinc-800"
                >
                  Seguinte
                  <ArrowRight />
                </Button>
              </div>

              {/* Store Base Country Field */}
              <div className={cardPage === 2 ? 'block' : 'hidden'}>
                <FormField
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. País de expedição</FormLabel>
                      <br />
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-[200px] justify-between"
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
                                <CommandEmpty>
                                  Nenhum país encontrado.
                                </CommandEmpty>
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
                <Button
                  type="button"
                  onClick={() => {
                    let fieldValue = form.getValues('country')

                    if (fieldValue === undefined) {
                      toast.warning('Campo obrigatório', {
                        description:
                          'Este campo não é opcional e tem de ser preenchido!',
                      })
                      return
                    }
                    setCardPage(cardPage + 1)
                  }}
                  className="bg-zinc-950 text-white rounded-full flex items-center gap-1 hover:bg-zinc-800"
                >
                  Seguinte
                  <ArrowRight />
                </Button>
              </div>

              {/* Store Slogan Field (optional) */}
              <div className={cardPage === 3 ? 'block' : 'hidden'}>
                <FormField
                  control={control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        3. Slogan{' '}
                        <span className="text-zinc-400">(opcional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => setCardPage(cardPage + 1)}
                  className="bg-zinc-950 text-white rounded-full flex items-center gap-1 hover:bg-zinc-800"
                >
                  Seguinte
                  <ArrowRight />
                </Button>
              </div>

              {/* Store Contact Method Field */}
              <div className={cardPage === 4 ? 'block' : 'hidden'}>
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>4. Método de contacto</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Endereço de email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Email validation toasts */}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            className={cardPage === 4 ? 'block' : 'hidden'}
            type="submit"
            form="newStoreForm"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <img src="/loading.gif" alt="Loading ..." width={'10%'} />
            ) : (
              'Criar Loja'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

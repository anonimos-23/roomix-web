import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { getStore } from '@/api/store/get-store'
import { EditStoreSettings } from '@/api/store/edit-store-settings'
import { Label } from '@/components/ui/label'
import { Plus, Save } from 'lucide-react'
import { TStore } from '@/types/entities'
import { getImage } from '@/api/images/get-image'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { AlertDialogHeader, AlertDialogFooter } from '../ui/alert-dialog'
import { deleteImage } from '@/api/images/delete-image'
import { toast } from 'sonner'

const formSchema = z.object({
  logo: z.instanceof(FileList),
  banner: z.instanceof(FileList),
  name: z.string(),
})
type FormSchema = z.infer<typeof formSchema>

export function GeneralStoreSettingsForm() {
  const { handleSubmit, control, ...form } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {},
  })
  const logoImageRef = form.register('logo')
  const bannerImageRef = form.register('banner')
  const [store, setStore] = useState<TStore>()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStoreSettings() {
      const store = await getStore()

      setStore(store)

      if (store.images.logoId !== undefined) {
        const { imagesUrls } = await getImage([store.images.logoId])

        setLogoPreview(imagesUrls[0])
      } else {
        setLogoPreview(null)
      }

      if (store.images.bannerId !== undefined) {
        const { imagesUrls } = await getImage([store.images.bannerId])

        setBannerPreview(imagesUrls[0])
      } else {
        setBannerPreview(null)
      }
    }

    fetchStoreSettings()
  }, [])

  if (store === undefined) {
    return <h1>loading...</h1>
  }

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) {
    const file = e.target.files?.[0]
    if (file) {
      const filePreview = URL.createObjectURL(file)
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      if (type === 'logo') {
        setLogoPreview(filePreview)
        form.setValue('logo', dataTransfer.files)
      } else {
        setBannerPreview(filePreview)
        form.setValue('banner', dataTransfer.files)
      }
    }
  }

  async function handleRemoveImage(type: 'logo' | 'banner') {
    if (store === undefined) {
      return
    }

    if (type === 'logo' && store.images.logoId !== undefined) {
      await deleteImage(store.images.logoId).then((response) => {
        if (response.status === 204) {
          toast.success('Logótipo eliminado!')
          setLogoPreview(null)
          resetFileInput('logoInp')
        }
      })
    } else {
      setLogoPreview(null)
      resetFileInput('logoInp')
    }

    if (type === 'banner' && store.images.bannerId !== undefined) {
      await deleteImage(store.images.bannerId).then((response) => {
        if (response.status === 204) {
          toast.success('Banner eliminado!')
          setBannerPreview(null)
          resetFileInput('bannerInp')
        }
      })
    } else {
      setBannerPreview(null)
      resetFileInput('bannerInp')
    }
  }

  function resetFileInput(id: string) {
    const input = document.getElementById(id) as HTMLInputElement
    if (input) {
      input.value = ''
    }
  }

  async function onSubmit({ logo, banner }: FormSchema) {
    if (store === undefined) {
      return
    }

    EditStoreSettings({
      storeId: store.id,
      logo: store.images.logoId === undefined ? logo : null,
      banner: store.images.bannerId === undefined ? banner : null,
    })
  }

  return (
    <Form handleSubmit={handleSubmit} control={control} {...form}>
      <form
        id="editStoreSettingsForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between space-y-2 sm:px-0 px-4 h-full"
      >
        <div>
          {/* Logo uploader */}
          <FormField
            control={control}
            name="logo"
            render={() => (
              <FormItem>
                <FormLabel>Logótipo</FormLabel>
                <div className="flex items-center gap-4 flex-wrap">
                  {logoPreview ? (
                    <div className="flex w-28 h-28">
                      <img
                        className="w-full h-full border-2 border-white dark:border-gray-800"
                        src={logoPreview}
                        alt={`${store.name} logo`}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant={'destructive'}
                            className="relative -top-5 right-3 hover:text-white bg-transparent w-2 h-8 text-zinc-900 rounded-full flex items-center justify-center text-xs"
                          >
                            X
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Eliminar logótipo
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação é permanente e irá eliminar esta imagem
                              sem qualquer forma de recuperação futura. Tem a
                              certeza que pretende eliminar?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant={'destructive'}
                                onClick={() => handleRemoveImage('logo')}
                              >
                                Confirmar
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <Label
                      htmlFor="logoInp"
                      className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                    >
                      <Plus className="h-4 w-4" />
                    </Label>
                  )}
                  <FormControl>
                    <Input
                      className="hidden"
                      id="logoInp"
                      type="file"
                      accept="image/*"
                      {...logoImageRef}
                      onChange={(e) => handleImageChange(e, 'logo')}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Banner uploader */}
          <FormField
            control={control}
            name="banner"
            render={() => (
              <FormItem>
                <FormLabel>Banner</FormLabel>
                <div className="flex items-center gap-4 flex-wrap">
                  {bannerPreview ? (
                    <div className="flex w-56 h-28">
                      <img
                        className="w-full h-full border-2 border-white dark:border-gray-800"
                        src={bannerPreview}
                        alt={`${store.name} banner`}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant={'destructive'}
                            className="relative -top-5 right-3 hover:text-white bg-transparent w-2 h-8 text-zinc-900 rounded-full flex items-center justify-center text-xs"
                          >
                            X
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar banner</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação é permanente e irá eliminar esta imagem
                              sem qualquer forma de recuperação futura. Tem a
                              certeza que pretende eliminar?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant={'destructive'}
                                onClick={() => handleRemoveImage('banner')}
                              >
                                Confirmar
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <Label
                      htmlFor="bannerInp"
                      className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                    >
                      <Plus className="h-4 w-4" />
                    </Label>
                  )}
                  <FormControl>
                    <Input
                      className="hidden"
                      id="bannerInp"
                      type="file"
                      accept="image/*"
                      {...bannerImageRef}
                      onChange={(e) => handleImageChange(e, 'banner')}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da loja</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="w-1/3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex justify-end">
          <Button
            type="submit"
            form="editStoreSettingsForm"
            className="flex items-center gap-2 w-1/6"
          >
            <Save className="w-5 h-5" />
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  )
}

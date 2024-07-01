import { getStore } from '@/api/store/get-store'
import { getImage } from '@/api/images/get-image'
import { Navbar } from '@/components/StoreNavbar'
import { TStore } from '@/types/entities'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

export function StoreLayout() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [store, setStore] = useState<TStore>()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  // const isDesktop = useMediaQuery('(min-width: 950px)')

  if (!slug) {
    navigate('/marketplace')
    return
  }

  useEffect(() => {
    async function fetchStoreSettings() {
      const store = await getStore(slug)

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

  return (
    <div className="w-screen h-screen bg-neutral-50">
      <Navbar store_name={store.name} slug={slug} logoPreview={logoPreview} />
      <Outlet />
    </div>
  )
}

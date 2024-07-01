import { getStore } from '@/api/store/get-store'
import { getImage } from '@/api/images/get-image'
// import { useMediaQuery } from '@/hooks/use-media-query'
import { TStore } from '@/types/entities'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export function LandingPage() {
  const { slug } = useParams()
  const [store, setStore] = useState<TStore>()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  // const isDesktop = useMediaQuery('(min-width: 950px)')

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
    <div>
      <div>teste</div>
      <section></section>
      <footer></footer>
    </div>
  )
}

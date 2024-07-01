import { api } from '@/lib/axios'
import axios from 'axios'
import { getSignedUrl } from '../images/get-signed-url'

interface EditProductRequest {
  storeId: string
  //   name: string
  //   price: number
  //   description: string | null
  //   stock: number
  //   can_sell_without_stock: boolean
  logo: FileList | null
  banner: FileList | null
}

export async function EditStoreSettings({
  storeId,
  logo,
  banner,
}: EditProductRequest) {
  //   const response = await api.patch(
  //     `/store/${productId}`,
  //     {  },
  //     {
  //       validateStatus: (status) => {
  //         return status !== 500
  //       },
  //     }
  //   )

  if (logo !== null) {
    const file = logo.item(0)

    if (file) {
      try {
        const { signedUrl } = await getSignedUrl({
          name: file.name,
          contentType: file.type,
          type: 'storeLogo',
          entityId: storeId,
        })

        await axios.put(signedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
      } catch (error) {
        console.log(`Error recording files: ${error}`)
      }
    }
  }

  if (banner !== null) {
    const file = banner.item(0)

    if (file) {
      try {
        const { signedUrl } = await getSignedUrl({
          name: file.name,
          contentType: file.type,
          type: 'storeBanner',
          entityId: storeId,
        })

        await axios.put(signedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
      } catch (error) {
        console.log(`Error recording files: ${error}`)
      }
    }
  }

  return true
}

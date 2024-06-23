import { api } from '@/lib/axios'
import axios from 'axios'
import { getSignedUrl } from './get-signed-url'

interface EditProductRequest {
  productId: string
  name: string
  price: number
  description: string | null
  stock: number
  can_sell_without_stock: boolean
  images: FileList
}

export async function EditProduct({
  productId,
  name,
  price,
  description,
  stock,
  can_sell_without_stock,
  images,
}: EditProductRequest) {
  const response = await api.patch(
    `/products/${productId}`,
    { name, price, description, stock, can_sell_without_stock },
    {
      validateStatus: (status) => {
        return status !== 500
      },
    }
  )

  for (let i = 0; i < images.length; i++) {
    const file = images.item(i)

    if (file) {
      try {
        const { signedUrl } = await getSignedUrl({
          name: file.name,
          contentType: file.type,
          type: 'storeProduct',
          entityId: productId,
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

  return response
}

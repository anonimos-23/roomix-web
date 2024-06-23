import { api } from '@/lib/axios'
import axios from 'axios'
import { getSignedUrl } from './get-signed-url'

interface CreateProductRequest {
  name: string
  price: number
  description: string | null
  images: FileList
}

export async function CreateProduct({
  name,
  price,
  description,
  images,
}: CreateProductRequest) {
  const response = await api.post<{ productId: string }>(
    '/products',
    { name, price, description },
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
          entityId: response.data.productId,
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

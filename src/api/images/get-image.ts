import { api } from '@/lib/axios'

export async function getImage(images: string[]) {
  const imagesUrls = []

  for (let i = 0; i < images.length; i++) {
    const response = await api.get<{ imageUrl: string }>(
      `/uploads/${images[i]}`,
      {
        validateStatus(status) {
          return status !== 500
        },
      }
    )

    if (response.status === 200) {
      imagesUrls.push(response.data.imageUrl)
    }
  }

  return { imagesUrls }
}

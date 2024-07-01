import { api } from '@/lib/axios'
interface GetSignedUrlRequest {
  name: string
  contentType: string
  type: 'avatar' | 'storeLogo' | 'storeBanner' | 'storeProduct'
  entityId: string
}

export async function getSignedUrl({
  name,
  contentType,
  type,
  entityId,
}: GetSignedUrlRequest) {
  const response = await api.post<{ signedUrl: string }>(
    '/uploads',
    { name, contentType, type, entityId },
    {
      validateStatus: (status) => {
        return status !== 500
      },
    }
  )

  return {
    signedUrl: response.data.signedUrl,
  }
}

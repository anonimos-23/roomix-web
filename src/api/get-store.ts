import { api } from '@/lib/axios'

// export interface StoreData {

// }

export async function getStore() {
  const response = await api.get('/stores').catch((error) => {
    console.log('Fatal error: \n', error)
    throw new Error()
  })

  if (response.status === 204) {
    return null
  }

  if (response.status === 200) {
    return response.data
  }
}

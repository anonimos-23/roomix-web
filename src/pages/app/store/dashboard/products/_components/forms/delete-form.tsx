import { useEffect, useState } from 'react'
import { TProduct } from '@/types/entities'
import { getImage } from '@/api/images/get-image'
import { deleteProduct } from '@/api/products/delete-product'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface EditProductFormProps {
  product: TProduct
  onSubmissionCompleted: (type: 'edit' | 'delete') => void
}

export function DeleteProductForm({
  product,
  onSubmissionCompleted,
}: EditProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    undefined
  )

  useEffect(() => {
    async function fetchCoverImage() {
      const { imagesUrls } = await getImage(product.images)

      if (imagesUrls.length === 0) {
        setImagePreview(null)
      } else {
        setImagePreview(imagesUrls[0])
      }
    }

    fetchCoverImage()
  }, [])

  async function onSubmit() {
    const response = await deleteProduct(product.id)

    if (response.status === 200) {
      toast.success('Produto eliminado permanentemente.')
      onSubmissionCompleted('delete')
      return
    }

    console.log(
      `Unexpected response from delete product request: \n${response}`
    )
  }

  if (imagePreview === undefined) {
    return <LoadingSpinner />
  }

  return (
    <form
      id="deleteProductForm"
      onSubmit={onSubmit}
      className="flex flex-col space-y-2 sm:px-0 px-4"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex w-28 h-28">
            <img
              className="w-full h-full border-2 border-white dark:border-gray-800"
              src={imagePreview ?? '/no-image.png'}
              alt={'Imagem do produto'}
            />
          </div>
        </div>
        <span>
          ID: <b>{product.slug}</b>
        </span>
        <b>{product.name}</b>
      </div>
    </form>
  )
}

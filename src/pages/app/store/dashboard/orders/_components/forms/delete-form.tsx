import { useEffect, useState } from 'react'
import { TProduct } from '@/types/entities'
import { getImage } from '@/api/images/get-image'
import { deleteProduct } from '@/api/products/delete-product'
import { toast } from 'sonner'

interface EditProductFormProps {
  product: TProduct
  onSubmissionCompleted: (type: 'edit' | 'delete') => void
}

export function DeleteProductForm({
  product,
  onSubmissionCompleted,
}: EditProductFormProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    async function fetchCoverImage() {
      const { imagesUrls } = await getImage(product.images)

      setImagePreviews(imagesUrls)
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

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-2 sm:px-0 px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 flex-wrap">
          {imagePreviews.map((src, index) => (
            <div key={index} className="flex w-28 h-28">
              <img
                key={index}
                className="w-full h-full border-2 border-white dark:border-gray-800"
                src={src}
                alt={`preview-${index}`}
              />
            </div>
          ))}
        </div>
        <span>
          ID: <b>{product.slug}</b>
        </span>
        <b>{product.name}</b>
      </div>
    </form>
  )
}

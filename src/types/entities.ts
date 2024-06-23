export interface Product {
  id: string
  name: string
  description: string
  price: string
  discount: number
  stock: number
  can_sell_without_stock: boolean
  slug: string
  created_at: string
  images: string[]
}

// Product server return
// {
//   "id": "1181c2be-69a3-4792-a244-a4eb75b73903",
//   "name": "THROWBACK THAVAGE T-SHIRT",
//   "description": "",
//   "price": "30",
//   "discount": 0,
//   "stock": 0,
//   "can_sell_without_stock": false,
//   "slug": "51476",
//   "created_at": "2024-06-22T18:48:43.827Z",
//   "images": [
//       "clxqh402n0000osw5f8qnfkjx"
//   ]
// }

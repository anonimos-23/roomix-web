export interface TProduct {
  id: string
  name: string
  description: string | null
  price: number
  discount: number
  stock: number
  can_sell_without_stock: boolean
  slug: string
  created_at: string
  images: string[]
}

export interface TUserProfile {
  email: string
  name: string
  phone: string | null
  fileId: string | null
  storeId: string | null
}

export interface TStore {
  id: string
  slug: string
  name: string
  slogan: string | null
  email: string
  country: string
  shippingAddress: string | null
  storeSettings: {
    needEmailOnSale: boolean
    needNameOnSale: boolean
    needPhoneOnSale: boolean
  } | null
  images: {
    logoId: string | undefined
    bannerId: string | undefined
  }
  created_at: string
}

export interface TCartItem {
  store: {
    id: string
    name: string
  }
  items: {
    productId: string
    name: string
    price: number
    discount: number
    quantity: number
    images: string[]
  }[]
}

export interface TOrder {
  id: string
  status: 'Canceled' | 'Preparing' | 'Delivering' | 'Delivered'
  totalAmount: string
  customerName: string
  customerEmail: string
  customerNotes: string | null
  country: string
  city: string
  province: string
  postal: string
  address: string
  currency: 'EUR' | 'USD' | 'BRL' | 'GBP'
  products: {
    productId: string
    name: string
    quantity: number
  }[]
}

export interface TFAQ {
  id: number
  question: string
  answer: string
  storeId: string
  createdAt: string
}

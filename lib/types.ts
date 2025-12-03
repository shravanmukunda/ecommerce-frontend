export interface Product {
  id: number
  name: string
  description?: string
  price: number
  image: string
  hoverImage?: string
  images?: string[]
  size?: string
  color?: string
  category?: string
}
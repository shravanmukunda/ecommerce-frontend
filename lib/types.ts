export interface Product {
  id: string | number // Support both string (GraphQL ID) and number for backward compatibility
  name: string
  description?: string
  price: number
  image: string
  hoverImage?: string
  images?: string[]
  size?: string
  color?: string
  category?: string
  limitedEdition?: boolean
}
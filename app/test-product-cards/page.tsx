import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data/products"

export default function TestProductCardsPage() {
  // Get first few products for testing
  const testProducts = products.slice(0, 4)
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-wider mb-8">Product Cards Test</h1>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {testProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <h2 className="text-2xl font-black uppercase tracking-wider mt-16 mb-8">List View Test</h2>
      
      <div className="space-y-8">
        {testProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode="list" />
        ))}
      </div>
    </div>
  )
}
import { ProductForm } from "@/app/admin/products/form"

export default function TestProductFormPage() {
  const handleSubmit = (productData: any) => {
    console.log("Product data submitted:", productData)
    alert("Product data logged to console. Check developer tools.")
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-wider mb-8">Product Form Test</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  )
}
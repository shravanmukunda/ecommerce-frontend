"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PlusCircle, Edit, Eye, Trash2 } from "lucide-react"
import { DELETE_PRODUCT } from "@/graphql/product-mutations"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProductManagementProps {
  products: Product[]
  onProductDeleted?: () => void
}

export function ProductManagement({ products, onProductDeleted }: ProductManagementProps) {
  const router = useRouter()
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [deleteProduct, { loading: deleting }] = useMutation(DELETE_PRODUCT)

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return
    
    try {
      await deleteProduct({
        variables: { id: deleteProductId },
        refetchQueries: ['GetProducts']
      })
      setDeleteProductId(null)
      onProductDeleted?.() // Callback to refresh data
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Failed to delete product. Check console for details.")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <Link href="/admin/products/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img 
                  src={product.image || "/placeholder.svg"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-4">₹{product.price?.toFixed(2) || '0.00'}</p>
                <div className="flex gap-2">
                  <Link href={`/product/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setDeleteProductId(product.id.toString())}
                    disabled={deleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product? This action cannot be undone.
            All associated variants and inventory data will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteProduct}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  )
}
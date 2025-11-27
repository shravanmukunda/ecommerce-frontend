"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/context/store-context"
import Link from "next/link"

interface ProductManagementProps {
  products: Product[]
}

export function ProductManagement({ products }: ProductManagementProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>Product Management</CardTitle>
          <Link href="/admin/products/new">
            <Button className="mt-4 md:mt-0 bg-black text-white hover:bg-gray-800">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
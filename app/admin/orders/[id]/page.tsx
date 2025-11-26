"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

// Mock data for demonstration
const mockOrderDetails = {
  id: "#1001",
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  },
  date: "2023-05-15",
  time: "14:30",
  status: "Delivered" as const,
  shippingAddress: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  billingAddress: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  items: [
    {
      id: 1,
      name: "Sacred Mayhem White Tee",
      size: "M",
      color: "White",
      price: 45.00,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: 2,
      name: "Black Oversized Hoodie",
      size: "L",
      color: "Black",
      price: 95.00,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100"
    }
  ],
  subtotal: 185.00,
  shipping: 10.00,
  tax: 15.00,
  total: 210.00
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch order data based on params.id
    // For now, we'll use mock data
    setOrder(mockOrderDetails)
  }, [params.id])

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Loading order details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight">Order Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Order {order.id}</CardTitle>
              <p className="text-gray-600 mt-1">
                Placed on {order.date} at {order.time}
              </p>
            </div>
            <Badge 
              className="mt-2 md:mt-0 text-sm"
              variant={
                order.status === "Delivered" ? "default" : 
                order.status === "Processing" ? "secondary" : 
                "outline"
              }
            >
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="space-y-2">
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-gray-600">{order.customer.email}</p>
                <p className="text-gray-600">{order.customer.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Billing Address</h2>
              <div className="space-y-1">
                <p>{order.billingAddress.street}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} | Color: {item.color}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
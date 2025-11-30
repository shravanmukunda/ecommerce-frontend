"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"

// Define TypeScript interfaces for our data
interface Product {
  id: string;
  name: string;
  designImageURL: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
}

// GraphQL query for order details
const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      status
      total
      createdAt
      shippingAddress {
        fullName
        address
        city
        state
        zipCode
        country
      }
      billingAddress {
        fullName
        address
        city
        state
        zipCode
        country
      }
      items {
        product {
          id
          name
          designImageURL
        }
        quantity
        size
        color
        price
      }
    }
  }
`;

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  
  // Fetch order data from API
  const { data, loading, error } = useQuery<{ order: Order }>(GET_ORDER, {
    variables: { id: params.id },
    skip: !params.id
  })

  useEffect(() => {
    if (data && data.order) {
      setOrder(data.order)
    }
  }, [data])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Error loading order details.</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Order not found.</p>
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
              <CardTitle className="text-2xl">Order {order.orderNumber}</CardTitle>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
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
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.billingAddress.fullName}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="space-y-1">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4">Billing Address</h2>
              <div className="space-y-1">
                <p>{order.billingAddress.address}</p>
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
            {order.items.map((item: OrderItem) => (
              <div key={item.product.id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={item.product.designImageURL || "/placeholder.svg"} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
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
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$0.00</span>
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
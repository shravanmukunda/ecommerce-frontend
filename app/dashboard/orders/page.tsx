"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@apollo/client/react"
import { MY_ORDERS } from "@/graphql/orders"

// Define TypeScript interfaces for API response
interface ApiOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  variant: {
    id: string;
    size: string;
    color: string;
    sku: string;
    price: number;
    product: {
      id: string;
      name: string;
      designImageURL: string;
    } | null;
  } | null;
}

interface ApiOrder {
  id: string;
  userID: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
  payment: {
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    transactionID: string;
    createdAt: string;
  } | null;
}

interface MyOrdersResponse {
  myOrders: ApiOrder[];
}

// Define TypeScript interfaces for our component data
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
}

export default function MyOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  const { data, loading, error } = useQuery<MyOrdersResponse>(MY_ORDERS, {
    errorPolicy: 'all' // Allow partial data even if some fields fail
  })

  // Transform API data to component format
  const orders = useMemo<Order[]>(() => {
    if (!data?.myOrders) return []
    
    return data.myOrders
      .filter((order): order is ApiOrder => order != null && order.id != null)
      .map((apiOrder) => ({
        id: apiOrder.id,
        date: new Date(apiOrder.createdAt).toLocaleDateString(),
        total: apiOrder.totalAmount || 0,
        status: apiOrder.status || "Unknown",
        shippingAddress: apiOrder.shippingAddress || "N/A",
        items: (apiOrder.items || [])
          .filter((item) => item.variant?.product != null)
          .map((item) => ({
            name: item.variant!.product!.name || "Unknown Product",
            quantity: item.quantity || 0,
            price: item.subtotal || item.unitPrice || 0,
            image: item.variant!.product!.designImageURL || "/placeholder.svg",
          })),
      }))
  }, [data])

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-black uppercase tracking-wider">My Orders</h1>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-black uppercase tracking-wider">My Orders</h1>
        <div className="text-red-500 mb-4">Error: {error.message}</div>
        <div className="text-gray-600">
          Failed to load orders. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-wider">My Orders</h1>

      {selectedOrder ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold uppercase tracking-wide">Order #{selectedOrder.id}</CardTitle>
            <Button
              variant="outline"
              onClick={() => setSelectedOrder(null)}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Back to Orders
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Order Date:</p>
                <p>{selectedOrder.date}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p>{selectedOrder.status}</p>
              </div>
              <div>
                <p className="font-semibold">Total:</p>
                <p>₹{selectedOrder.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold">Shipping Address:</p>
                <p className="whitespace-pre-line">{selectedOrder.shippingAddress}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold uppercase tracking-wide mt-4">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center space-x-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={40}
                        height={50}
                        className="object-cover"
                      />
                      <span>{item.name}</span>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="bg-black text-white hover:bg-gray-800">Track Shipment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-gray-600">You have no past orders.</p>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Date: {order.date}</p>
                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-xl font-bold">₹{order.total.toFixed(2)}</p>
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      className="mt-2 bg-black text-white hover:bg-gray-800"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
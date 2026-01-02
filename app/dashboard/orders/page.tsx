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
  items: ApiOrderItem[] | null;
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
      .map((apiOrder) => {
        // Handle null items array
        const items = apiOrder.items || []
        
        // Filter out items with null variants or products
        const validItems = items
          .filter((item): item is ApiOrderItem => 
            item != null && 
            item.variant != null && 
            item.variant.product != null
          )
          .map((item) => ({
            name: item.variant!.product!.name || "Unknown Product",
            quantity: item.quantity || 0,
            price: item.subtotal || item.unitPrice || 0,
            image: item.variant!.product!.designImageURL || "/placeholder.svg",
          }))
        
        return {
          id: apiOrder.id,
          date: new Date(apiOrder.createdAt).toLocaleDateString(),
          total: apiOrder.totalAmount || 0,
          status: apiOrder.status || "Unknown",
          shippingAddress: apiOrder.shippingAddress || "N/A",
          items: validItems,
        }
      })
  }, [data])

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-black uppercase tracking-wider text-white">My Orders</h1>
        <p className="text-gray-400">Loading orders...</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-black uppercase tracking-wider text-white">My Orders</h1>
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardContent className="pt-6">
            <div className="text-red-400 mb-4">Error: {error.message}</div>
            <div className="text-gray-400">
              Failed to load orders. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show warning if there are errors but we have partial data
  const hasPartialDataErrors = error && data && (
    error.message?.includes('null') || 
    error.message?.includes('product') ||
    error.message?.includes('failed to load')
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">My Orders</h1>
      
      {hasPartialDataErrors && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-300">
          <p className="font-semibold mb-1">Note:</p>
          <p>Some order items may not be displayed because the associated products are no longer available.</p>
        </div>
      )}

      {selectedOrder ? (
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#1a1a1a]">
            <CardTitle className="text-xl font-bold uppercase tracking-wide text-white">Order #{selectedOrder.id}</CardTitle>
            <Button
              variant="outline"
              onClick={() => setSelectedOrder(null)}
              className="border-[#333] text-white hover:bg-gradient-to-r hover:from-[#00bfff] hover:to-[#0099ff] hover:text-white hover:border-transparent bg-transparent transition-all duration-300"
            >
              Back to Orders
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-400 mb-1">Order Date:</p>
                <p className="text-white">{selectedOrder.date}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-400 mb-1">Status:</p>
                <p className="text-white uppercase">{selectedOrder.status}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-400 mb-1">Total:</p>
                <p className="text-white text-lg font-bold">₹{selectedOrder.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-400 mb-1">Shipping Address:</p>
                <p className="text-white whitespace-pre-line">{selectedOrder.shippingAddress}</p>
              </div>
            </div>

            <div className="border-t border-[#1a1a1a] pt-4">
              <h3 className="text-lg font-bold uppercase tracking-wide mt-4 text-white mb-4">Items</h3>
              {selectedOrder.items.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No items available for this order. The products may have been removed.
                </p>
              ) : (
                <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#1a1a1a] hover:bg-[#1a1a1a]">
                        <TableHead className="text-gray-400">Product</TableHead>
                        <TableHead className="text-gray-400">Quantity</TableHead>
                        <TableHead className="text-right text-gray-400">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index} className="border-[#1a1a1a] hover:bg-[#1a1a1a]">
                          <TableCell className="flex items-center space-x-3 text-white">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={40}
                              height={50}
                              className="object-cover rounded"
                            />
                            <span>{item.name}</span>
                          </TableCell>
                          <TableCell className="text-white">{item.quantity}</TableCell>
                          <TableCell className="text-right text-white font-semibold">₹{item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            <Button className="w-full bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all duration-300 border-0">
              Track Shipment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center py-8">You have no past orders.</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card 
                key={order.id} 
                className="bg-[#0f0f0f] border-[#1a1a1a] hover:border-[#333] hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white mb-2">Order #{order.id}</h3>
                    <p className="text-sm text-gray-400">Date: {order.date}</p>
                    <p className="text-sm text-gray-400 uppercase">Status: {order.status}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-xl font-bold text-white mb-3">₹{order.total.toFixed(2)}</p>
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all duration-300 border-0"
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
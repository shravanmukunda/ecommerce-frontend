"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dummyOrders = [
  {
    id: "SM-2024-001",
    date: "2024-07-25",
    total: 285.0,
    status: "Delivered",
    items: [
      { name: "ESSENTIAL TEE", quantity: 1, price: 85.0, image: "/placeholder.svg?height=50&width=40&text=Tee" },
      { name: "CARGO PANTS", quantity: 1, price: 195.0, image: "/placeholder.svg?height=50&width=40&text=Cargo" },
    ],
  },
  {
    id: "SM-2024-002",
    date: "2024-07-10",
    total: 165.0,
    status: "Shipped",
    items: [
      { name: "OVERSIZED HOODIE", quantity: 1, price: 165.0, image: "/placeholder.svg?height=50&width=40&text=Hoodie" },
    ],
  },
  {
    id: "SM-2024-003",
    date: "2024-06-01",
    total: 570.0,
    status: "Processing",
    items: [
      { name: "BOMBER JACKET", quantity: 2, price: 285.0, image: "/placeholder.svg?height=50&width=40&text=Bomber" },
    ],
  },
]

export default function MyOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<(typeof dummyOrders)[0] | null>(null)

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
                <p>${selectedOrder.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold">Shipping Address:</p>
                <p>John Doe</p>
                <p>123 Main St</p>
                <p>Anytown, USA 12345</p>
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
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button className="bg-black text-white hover:bg-gray-800">Track Shipment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {dummyOrders.length === 0 ? (
            <p className="text-gray-600">You have no past orders.</p>
          ) : (
            dummyOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Date: {order.date}</p>
                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
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

import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { client } from "@/lib/apolloClient"
import { gql } from "@apollo/client"

/* ======================= TYPES ======================= */

interface Product {
  id: string
  name: string
  designImageURL: string
}

interface Variant {
  size: string
  color?: string
  price: number
  product: Product | null
}

interface OrderItem {
  quantity: number
  unitPrice: number
  subtotal: number
  variant: Variant | null
}

interface Address {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  shippingAddress: Address
  billingAddress: Address
  items: OrderItem[]
}

/* ======================= QUERY ======================= */

const GET_ORDER = gql`
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    status
    totalAmount
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
      quantity
      unitPrice
      subtotal

      variant {
        size
        color
        price
        product {
          id
          name
          designImageURL
        }
      }
    }
  }
}
`

/* ======================= FETCH ======================= */

async function getOrder(id: string): Promise<Order | null> {
  try {
    const { data } = await client.query<{ order: Order }>({
      query: GET_ORDER,
      variables: { id },
      fetchPolicy: "no-cache",
      errorPolicy: "all", // Allow partial data even if some fields fail
    })

    return data?.order ?? null
  } catch (err) {
    console.error("Order fetch failed:", err)
    // If error is about null products, try to return partial data
    if (err instanceof Error && (err.message.includes('null') || err.message.includes('product'))) {
      console.warn("Some order items may have null products - attempting to return partial data")
    }
    return null
  }
}

/* ======================= PAGE ======================= */

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Order not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight">Order Details</h1>
        <Button variant="outline" onClick={() => redirect("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* ORDER INFO */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <Badge
              className="mt-2 md:mt-0"
              variant={
                order.status === "Delivered"
                  ? "default"
                  : order.status === "Processing"
                  ? "secondary"
                  : "outline"
              }
            >
              {order.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CUSTOMER */}
            <div>
              <h2 className="text-xl font-bold mb-4">Customer</h2>
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-gray-500">{order.billingAddress.fullName}</p>
            </div>

            {/* SHIPPING */}
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping</h2>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>

            {/* BILLING */}
            <div>
              <h2 className="text-xl font-bold mb-4">Billing</h2>
              <p>{order.billingAddress.address}</p>
              <p>
                {order.billingAddress.city}, {order.billingAddress.state}{" "}
                {order.billingAddress.zipCode}
              </p>
              <p>{order.billingAddress.country}</p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.filter(item => item.variant?.product != null).map((item, index) => (
            <div key={index} className="flex items-center border-b pb-4 mb-4 last:border-0">

              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={item.variant?.product?.designImageURL || "/placeholder.svg"}
                  alt={item.variant?.product?.name || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="ml-4 flex-grow">
                <p className="font-semibold">{item.variant?.product?.name || "Product Unavailable"}</p>
                <p className="text-sm text-gray-500">
                  Size: {item.variant?.size || "N/A"} | Color: {item.variant?.color || "N/A"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">₹{item.unitPrice}</p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>

            </div>
          ))}
          {order.items.filter(item => item.variant?.product == null).length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {order.items.filter(item => item.variant?.product == null).length} item(s) could not be loaded (product may have been deleted).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* TOTAL */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

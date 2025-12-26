"use client"

import { useState, useEffect } from "react"

import type { Product } from "@/lib/types"
import { OverviewCards } from "@/components/admin/overview-cards"
import { SalesChart } from "@/components/admin/sales-chart"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentOrders } from "@/components/admin/recent-orders"
import { ProductManagement } from "@/components/admin/product-management"
import { PromoCodeManagement } from "@/components/admin/promo-code-management"
import { useQuery } from "@apollo/client/react"
import { GET_PRODUCTS } from "@/graphql/product-queries"
import { ALL_ORDERS } from "@/graphql/orders"

// Define TypeScript interfaces for our data
interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  inventory: {
    availableQuantity: number;
  };
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  designImageURL: string;
  imageURLs?: string[]; // Optional for backward compatibility
  basePrice: number;
  isActive: boolean;
  limitedEdition?: boolean;
  variants: ProductVariant[];
}

interface OrderItem {
  variant?: {
    id?: string;
    size?: string;
    color?: string;
    sku?: string;
    price?: number;
    product?: {
      id: string;
      name: string;
      designImageURL?: string;
    } | null;
  } | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface PaymentData {
  id?: string;
  amount?: number;
  status?: string;
  paymentMethod?: string;
  transactionID?: string;
  createdAt?: string;
}

interface OrderData {
  id: string;
  userID?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  shippingAddress: string;
  items: OrderItem[];
  payment?: PaymentData | null;
}

interface OrdersResponse {
  allOrders: OrderData[];
}

// Transform OrderData to match RecentOrders component expectations
interface TransformedOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: "Delivered" | "Processing" | "Shipped" | "Pending";
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<TransformedOrder[]>([])
  const [allOrdersData, setAllOrdersData] = useState<OrderData[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  
  // Fetch products from API
  const { data: productsData, loading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery<{ products: ProductData[] }>(GET_PRODUCTS)
  
  // Fetch orders from API with error policy to allow partial data
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery<OrdersResponse>(ALL_ORDERS, {
    errorPolicy: 'all' // Allow partial data even if some fields fail
  })
  
  // Update products state when data is fetched
  useEffect(() => {
    if (productsData && productsData.products) {
      // Convert ProductData to Product interface
      // Support both new imageURLs array and legacy designImageURL
      const convertedProducts: Product[] = productsData.products.map(product => {
        const images = product.imageURLs && product.imageURLs.length > 0 
          ? product.imageURLs 
          : (product.designImageURL ? [product.designImageURL] : [])
        
        return {
          id: parseInt(product.id),
          name: product.name,
          price: product.basePrice,
          image: images[0] || product.designImageURL || "/placeholder.svg",
          images: images,
          limitedEdition: product.limitedEdition || false,
          // Other properties will use defaults from the Product interface
        }
      })
      setProducts(convertedProducts)
    }
  }, [productsData])
  
  // Update orders state when data is fetched
  useEffect(() => {
    if (ordersData && ordersData.allOrders) {
      // Filter out orders with items that have null products, and filter out undefined/null orders
      const validOrders = ordersData.allOrders
        .filter((order): order is OrderData => order != null && order.id != null)
        .filter(order => {
          // Check if all items have valid products
          if (!order.items || order.items.length === 0) return true
          return order.items.every(item => item?.variant?.product != null)
        })
      
      // Store all orders data for CSV export
      setAllOrdersData(validOrders)
      
      // Filter out completed and failed orders from display
      const activeOrders = validOrders.filter(order => {
        const statusLower = (order.status || "").toLowerCase()
        return !(
          statusLower === "delivered" || 
          statusLower === "completed" || 
          statusLower === "failed" ||
          statusLower === "cancelled"
        )
      })
      
      // Transform orders to match component expectations (only active orders)
      const transformedOrders: TransformedOrder[] = activeOrders.map(order => {
        // Extract customer name from shipping address or use placeholder
        const customerName = order.shippingAddress || "Customer"
        
        return {
          id: order.id!,
          customer: customerName,
          date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
          amount: order.totalAmount || 0,
          status: mapOrderStatus(order.status || "Pending")
        }
      })
      setOrders(transformedOrders)
      
      // Generate sales data from valid orders for charts
      const salesByMonth = generateMonthlySalesData(validOrders)
      setSalesData(salesByMonth)
    }
  }, [ordersData])
  
  // Helper function to map backend status to component status
  const mapOrderStatus = (status: string): "Delivered" | "Processing" | "Shipped" | "Pending" => {
    const statusLower = status.toLowerCase()
    if (statusLower === "delivered" || statusLower === "completed") return "Delivered"
    if (statusLower === "processing" || statusLower === "confirmed") return "Processing"
    if (statusLower === "shipped" || statusLower === "in_transit") return "Shipped"
    return "Pending"
  }

  // Helper function to check if order is completed or failed
  const isCompletedOrFailed = (status: string): boolean => {
    const statusLower = (status || "").toLowerCase().trim()
    return (
      statusLower === "delivered" || 
      statusLower === "completed" || 
      statusLower === "complete" ||
      statusLower === "failed" ||
      statusLower === "failure" ||
      statusLower === "cancelled" ||
      statusLower === "canceled"
    )
  }

  // Function to convert orders to CSV format
  const convertOrdersToCSV = (orders: OrderData[]): string => {
    // Filter only completed/failed orders
    const completedFailedOrders = orders.filter(order => {
      const status = order.status || ""
      return isCompletedOrFailed(status)
    })
    
    // Debug logging
    console.log("Total orders:", orders.length)
    console.log("Order statuses:", orders.map(o => ({ id: o.id, status: o.status })))
    console.log("Completed/Failed orders:", completedFailedOrders.length)
    
    if (completedFailedOrders.length === 0) {
      return ""
    }

    // Define CSV headers
    const headers = [
      "Order ID",
      "User ID",
      "Status",
      "Total Amount",
      "Created At",
      "Updated At",
      "Shipping Address",
      "Payment ID",
      "Payment Amount",
      "Payment Status",
      "Payment Method",
      "Transaction ID",
      "Payment Created At",
      "Items (Product Name, Size, Color, SKU, Quantity, Unit Price, Subtotal)"
    ]

    // Convert orders to CSV rows
    const rows = completedFailedOrders.map(order => {
      // Format items as a readable string
      const itemsString = order.items?.map(item => {
        const productName = item.variant?.product?.name || "N/A"
        const size = item.variant?.size || "N/A"
        const color = item.variant?.color || "N/A"
        const sku = item.variant?.sku || "N/A"
        const quantity = item.quantity || 0
        const unitPrice = item.unitPrice || 0
        const subtotal = item.subtotal || 0
        return `${productName} (Size: ${size}, Color: ${color}, SKU: ${sku}, Qty: ${quantity}, Price: ₹${unitPrice}, Subtotal: ₹${subtotal})`
      }).join("; ") || "No items"

      return [
        order.id || "",
        order.userID || "",
        order.status || "",
        `₹${(order.totalAmount || 0).toFixed(2)}`,
        order.createdAt ? new Date(order.createdAt).toLocaleString() : "",
        order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "",
        order.shippingAddress || "",
        order.payment?.id || "",
        order.payment?.amount ? `₹${order.payment.amount.toFixed(2)}` : "",
        order.payment?.status || "",
        order.payment?.paymentMethod || "",
        order.payment?.transactionID || "",
        order.payment?.createdAt ? new Date(order.payment.createdAt).toLocaleString() : "",
        `"${itemsString}"` // Wrap in quotes to handle commas in the string
      ]
    })

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const cellStr = String(cell).replace(/"/g, '""')
        if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
          return `"${cellStr}"`
        }
        return cellStr
      }).join(","))
    ].join("\n")

    return csvContent
  }

  // Function to download CSV
  const exportCompletedFailedOrdersToCSV = () => {
    // Check if we have orders data
    if (!allOrdersData || allOrdersData.length === 0) {
      alert("No orders data available. Please wait for orders to load.")
      return
    }
    
    // Check for completed/failed orders first
    const completedFailedOrders = allOrdersData.filter(order => {
      const status = order.status || ""
      return isCompletedOrFailed(status)
    })
    
    if (completedFailedOrders.length === 0) {
      alert(`No completed or failed orders to export. Found ${allOrdersData.length} total orders with statuses: ${[...new Set(allOrdersData.map(o => o.status))].join(", ")}`)
      return
    }
    
    const csvContent: string = convertOrdersToCSV(allOrdersData)
    
    if (!csvContent || csvContent.trim() === "") {
      alert("Error generating CSV file. Please try again.")
      return
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `completed-failed-orders-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Generate monthly sales data from orders
  const generateMonthlySalesData = (orders: OrderData[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyData: { [key: string]: { sales: number, revenue: number, count: number } } = {}
    
    // Initialize last 6 months
    const currentDate = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      monthlyData[monthKey] = { sales: 0, revenue: 0, count: 0 }
    }
    
    // Aggregate order data by month
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const monthKey = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear()}`
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += order.totalAmount
        monthlyData[monthKey].count += 1
        monthlyData[monthKey].sales += order.totalAmount // Using revenue as sales for now
      }
    })
    
    // Convert to array format for charts
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      sales: data.count,
      revenue: data.revenue
    }))
  }
  
  // Calculate stats from actual data
  const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  
  // Handle loading states
  if (productsLoading || ordersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Loading dashboard data...</p>
      </div>
    )
  }
  
  // Handle error states - but allow partial data to be displayed
  const hasCriticalError = (productsError && !productsData) || (ordersError && !ordersData)
  
  if (hasCriticalError) {
    console.error('Products error:', productsError?.message)
    console.error('Orders error:', ordersError?.message)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Error loading dashboard data.</p>
          <p className="text-gray-600 mt-2">Please try again later.</p>
          {productsError?.message && <p className="text-red-500 mt-2">Products Error: {productsError.message}</p>}
          {ordersError?.message && (
            <p className="text-red-500 mt-2">
              Orders Error: {ordersError.message}
              {ordersError.message.includes('null') || ordersError.message.includes('product') 
                ? " (Some orders may have items with deleted products)"
                : ""}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your store performance and products</p>
      </div>
      
      {/* Warning banner if there are errors but partial data */}
      {((productsError || ordersError) && (productsData || ordersData)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Some data may not be fully loaded. 
            {ordersError?.message?.includes('null') || ordersError?.message?.includes('product') 
              ? " Some orders have items with deleted products and were filtered out."
              : " Please refresh the page if you notice missing information."}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <OverviewCards 
        totalRevenue={totalRevenue}
        totalSales={totalRevenue} // Using revenue as sales for now
        totalOrders={totalOrders}
        totalProducts={totalProducts}
      />

      {/* Charts - using empty data instead of mock data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart data={salesData.map(({ month, sales }) => ({ month, sales: sales || 0 }))} />
        <RevenueChart data={salesData.map(({ month, revenue }) => ({ month, revenue: revenue || 0 }))} />
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={exportCompletedFailedOrdersToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Completed/Failed Orders (CSV)
          </button>
        </div>
        <RecentOrders orders={orders} />
      </div>

      {/* Promo Code Management */}
      <PromoCodeManagement />

      {/* Products Management */}
      <ProductManagement 
        products={products} 
        onProductDeleted={() => refetchProducts()}
      />
    </div>
  )
}

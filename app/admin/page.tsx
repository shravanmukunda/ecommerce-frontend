"use client"

import { useState, useEffect } from "react"

import type { Product } from "@/lib/types"
import { OverviewCards } from "@/components/admin/overview-cards"
import { SalesChart } from "@/components/admin/sales-chart"
import { RevenueChart } from "@/components/admin/revenue-chart"
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


export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
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
      
      // Generate sales data from valid orders for charts
      const salesByMonth = generateMonthlySalesData(validOrders)
      setSalesData(salesByMonth)
    }
  }, [ordersData])
  
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
  const totalRevenue = salesData.reduce((sum, data) => sum + (data.revenue || 0), 0)
  const totalOrders = ordersData?.allOrders?.length || 0
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

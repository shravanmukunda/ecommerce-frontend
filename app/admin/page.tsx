"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  PlusCircle,
  Edit,
  Eye,
  Tag
} from "lucide-react"
import { Product } from "@/context/store-context"
import Link from "next/link"
import { OverviewCards } from "@/components/admin/overview-cards"
import { SalesChart } from "@/components/admin/sales-chart"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentOrders } from "@/components/admin/recent-orders"
import { ProductManagement } from "@/components/admin/product-management"
import { PromoCodeManagement } from "@/components/admin/promo-code-management"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"

// Define TypeScript interfaces for our data
interface ProductData {
  id: string;
  name: string;
  basePrice: number;
  isActive: boolean;
}

interface OrderData {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

// GraphQL queries
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      basePrice
      isActive
    }
  }
`;

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      orderNumber
      total
      status
      createdAt
    }
  }
`;

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  
  // Fetch products from API
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery<{ products: ProductData[] }>(GET_PRODUCTS)
  
  // Fetch orders from API
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery<{ orders: OrderData[] }>(GET_ORDERS)
  
  // Update products state when data is fetched
  useEffect(() => {
    if (productsData && productsData.products) {
      // Convert ProductData to Product interface
      const convertedProducts: Product[] = productsData.products.map(product => ({
        id: parseInt(product.id),
        name: product.name,
        price: product.basePrice,
        image: "/placeholder.svg", // Default placeholder image
        // Other properties will use defaults
      }))
      setProducts(convertedProducts)
    }
  }, [productsData])
  
  // Update orders state when data is fetched
  useEffect(() => {
    if (ordersData && ordersData.orders) {
      setOrders(ordersData.orders)
    }
  }, [ordersData])
  
  // For now, we'll use empty arrays instead of mock data
  // In a real application, this data would come from the API
  const totalSales = salesData.reduce((sum, data) => sum + (data.sales || 0), 0)
  const totalRevenue = salesData.reduce((sum, data) => sum + (data.revenue || 0), 0)
  const totalOrders = orders.length
  
  // Handle loading states
  if (productsLoading || ordersLoading) {
    return <div>Loading dashboard data...</div>
  }
  
  // Handle error states
  if (productsError || ordersError) {
    return <div>Error loading dashboard data. Please try again later.</div>
  }
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your store performance and products</p>
      </div>

      {/* Stats Cards */}
      <OverviewCards 
        totalRevenue={totalRevenue}
        totalSales={totalSales}
        totalOrders={totalOrders}
        totalProducts={products.length}
      />

      {/* Charts - using empty data instead of mock data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart data={salesData.map(({ month, sales }) => ({ month, sales: sales || 0 }))} />
        <RevenueChart data={salesData.map(({ month, revenue }) => ({ month, revenue: revenue || 0 }))} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={orders} />

      {/* Promo Code Management */}
      <PromoCodeManagement />

      {/* Products Management */}
      <ProductManagement products={products} />
    </div>
  )
}
"use client"

import { useState } from "react"
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
import { products as initialProducts } from "@/lib/data/products"
import { Product } from "@/context/store-context"
import Link from "next/link"
import { OverviewCards } from "@/components/admin/overview-cards"
import { SalesChart } from "@/components/admin/sales-chart"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentOrders } from "@/components/admin/recent-orders"
import { ProductManagement } from "@/components/admin/product-management"
import { PromoCodeManagement } from "@/components/admin/promo-code-management"

// Mock data for demonstration
const mockSalesData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1398 },
  { month: "Mar", sales: 2000, revenue: 9800 },
  { month: "Apr", sales: 2780, revenue: 3908 },
  { month: "May", sales: 1890, revenue: 4800 },
  { month: "Jun", sales: 2390, revenue: 3800 },
  { month: "Jul", sales: 3490, revenue: 4300 },
]

const mockOrders = [
  { id: "#1001", customer: "John Doe", date: "2023-05-15", amount: 125.99, status: "Delivered" as const },
  { id: "#1002", customer: "Sarah Smith", date: "2023-05-16", amount: 89.50, status: "Processing" as const },
  { id: "#1003", customer: "Mike Johnson", date: "2023-05-17", amount: 210.75, status: "Shipped" as const },
  { id: "#1004", customer: "Emma Wilson", date: "2023-05-18", amount: 65.25, status: "Pending" as const },
  { id: "#1005", customer: "David Brown", date: "2023-05-19", amount: 199.99, status: "Delivered" as const },
]

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  
  // Calculate metrics
  const totalSales = mockSalesData.reduce((sum, data) => sum + data.sales, 0)
  const totalRevenue = mockSalesData.reduce((sum, data) => sum + data.revenue, 0)
  const totalOrders = mockOrders.length
  
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart data={mockSalesData.map(({ month, sales }) => ({ month, sales }))} />
        <RevenueChart data={mockSalesData.map(({ month, revenue }) => ({ month, revenue }))} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={mockOrders} />

      {/* Promo Code Management */}
      <PromoCodeManagement />

      {/* Products Management */}
      <ProductManagement products={products} />
    </div>
  )
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Package
} from "lucide-react"

interface OverviewCardsProps {
  totalRevenue: number
  totalSales: number
  totalOrders: number
  totalProducts: number
  revenueGrowth?: number
  salesGrowth?: number
  orderGrowth?: number
}

export function OverviewCards({
  totalRevenue,
  totalSales,
  totalOrders,
  totalProducts,
  revenueGrowth = 0,
  salesGrowth = 0,
  orderGrowth = 0
}: OverviewCardsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: revenueGrowth ? `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% from last month` : "No previous data",
      icon: DollarSign,
    },
    {
      title: "Total Sales",
      value: totalSales.toLocaleString(),
      description: salesGrowth ? `${salesGrowth > 0 ? '+' : ''}${salesGrowth.toFixed(1)}% from last month` : "No previous data",
      icon: TrendingUp,
    },
    {
      title: "Orders",
      value: totalOrders.toString(),
      description: orderGrowth ? `${orderGrowth > 0 ? '+' : ''}${orderGrowth.toFixed(1)}% from last month` : "No previous data",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      description: "Active products",
      icon: Package,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
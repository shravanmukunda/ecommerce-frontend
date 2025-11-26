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
}

export function OverviewCards({
  totalRevenue,
  totalSales,
  totalOrders,
  totalProducts
}: OverviewCardsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "Total Sales",
      value: totalSales.toLocaleString(),
      description: "+18.1% from last month",
      icon: TrendingUp,
    },
    {
      title: "Orders",
      value: totalOrders.toString(),
      description: "+19% from last month",
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
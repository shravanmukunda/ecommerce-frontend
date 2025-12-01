"use client"

import { useState, useEffect } from "react"
import {
  Package,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  PlusCircle,
  Edit,
  Eye,
  Tag
} from "lucide-react"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { OverviewCards } from "@/components/admin/overview-cards"
import { SalesChart } from "@/components/admin/sales-chart"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentOrders } from "@/components/admin/recent-orders"
import { ProductManagement } from "@/components/admin/product-management"
import { PromoCodeManagement } from "@/components/admin/promo-code-management"
import { useQuery } from "@apollo/client/react"
import { GET_PRODUCTS } from "@/graphql/product-queries"
import { GET_ORDERS } from "@/graphql/orders"
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "@/graphql/order";
import { useRouter } from "next/navigation";

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
  basePrice: number;
  isActive: boolean;
  variants: ProductVariant[];
}

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  size: string;
  color: string;
}

interface OrderData {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
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
  const [salesData, setSalesData] = useState<any[]>([])
  
  // Fetch products from API
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery<{ products: ProductData[] }>(GET_PRODUCTS)
  
  // Fetch orders from API
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery<OrdersResponse>(GET_ORDERS)
  
  // Update products state when data is fetched
  useEffect(() => {
    if (productsData && productsData.products) {
      // Convert ProductData to Product interface
      const convertedProducts: Product[] = productsData.products.map(product => ({
        id: parseInt(product.id),
        name: product.name,
        price: product.basePrice,
        image: product.designImageURL || "/placeholder.svg",
        // Other properties will use defaults from the Product interface
      }))
      setProducts(convertedProducts)
    }
  }, [productsData])
  
  // Update orders state when data is fetched
  useEffect(() => {
    if (ordersData && ordersData.allOrders) {
      // Transform orders to match component expectations
      const transformedOrders: TransformedOrder[] = ordersData.allOrders.map(order => ({
        id: order.id,
        customer: "Customer Name", // Placeholder - would need user data to populate this
        date: new Date(order.createdAt).toLocaleDateString(),
        amount: order.totalAmount,
        status: order.status as "Delivered" | "Processing" | "Shipped" | "Pending"
      }))
      setOrders(transformedOrders)
    }
  }, [ordersData])
  
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
  
  // Handle error states
  if (productsError || ordersError) {
    console.error('Products error:', productsError)
    console.error('Orders error:', ordersError)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Error loading dashboard data.</p>
          <p className="text-gray-600 mt-2">Please try again later.</p>
          {productsError && <p className="text-red-500 mt-2">Products Error: {productsError.message}</p>}
          {ordersError && <p className="text-red-500 mt-2">Orders Error: {ordersError.message}</p>}
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
      <RecentOrders orders={orders} />

      {/* Promo Code Management */}
      <PromoCodeManagement />

      {/* Products Management */}
      <ProductManagement products={products} />
    </div>
  )
}
export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [createOrder] = useMutation(CREATE_ORDER);

  const handleCheckout = async () => {
    const res = await createOrder();
    router.push("/order-success?orderId=" + res.data.createOrder.id);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
}
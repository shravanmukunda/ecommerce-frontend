"use client";

import { useQuery } from "@apollo/client/react";
import { ALL_ORDERS } from "@/graphql/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

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

interface Order {
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

interface AllOrdersResponse {
  allOrders: Order[];
}

// Helper function to map backend status to display status
const getStatusBadgeVariant = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "delivered" || statusLower === "completed") return "default";
  if (statusLower === "processing" || statusLower === "confirmed") return "secondary";
  if (statusLower === "shipped" || statusLower === "in_transit") return "outline";
  if (statusLower === "failed" || statusLower === "cancelled" || statusLower === "canceled") return "destructive";
  return "outline";
};

export default function AdminOrders() {
  const { data, loading, error } = useQuery<AllOrdersResponse>(ALL_ORDERS, {
    errorPolicy: 'all' // Allow partial data even if some fields fail
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Loading orders...</p>
      </div>
    );
  }
  
  // Show error but still try to display data if available
  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500 mb-4">Error loading orders</p>
          <p className="text-gray-600">
            {error.message?.includes('null') || error.message?.includes('product') 
              ? "Some orders may have items with deleted products. Please contact support if this persists."
              : "Failed to load orders. Please try again later."}
          </p>
        </div>
      </div>
    );
  }
  
  // Filter out any undefined/null orders and log warnings
  if (error) {
    console.warn('Orders query had errors but partial data may be available:', error.message);
    if (error.message?.includes('null') || error.message?.includes('product')) {
      console.warn('Some order items may have null products - this is expected if products were deleted');
    }
  }

  // Filter valid orders
  const validOrders = (data?.allOrders || [])
    .filter((order): order is Order => order != null && order.id != null)
    .filter(order => {
      // Check if all items have valid products
      if (!order.items || order.items.length === 0) return true;
      return order.items.every(item => item?.variant?.product != null);
    });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Orders</h1>
        <p className="text-gray-600 mt-2">View and manage all orders</p>
      </div>

      {/* Warning banner if there are errors but partial data */}
      {error && data && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Some orders may not be fully loaded. 
            {error.message?.includes('null') || error.message?.includes('product') 
              ? " Some orders have items with deleted products and were filtered out."
              : " Please refresh the page if you notice missing information."}
          </p>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({validOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {validOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell className="text-gray-500">
                        {order.userID || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {order.createdAt 
                          ? new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {order.items?.length || 0} item(s)
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{(order.totalAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {order.payment?.status ? (
                          <Badge 
                            variant={
                              order.payment.status.toLowerCase() === "paid" || 
                              order.payment.status.toLowerCase() === "success"
                                ? "default"
                                : order.payment.status.toLowerCase() === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {order.payment.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status || "Pending")}>
                          {order.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                Orders will appear here once customers start placing orders.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { useQuery } from "@apollo/client/react";
import { ALL_ORDERS } from "@/graphql/orders";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  userID: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
}

interface AllOrdersResponse {
  allOrders: Order[];
}

export default function AdminOrders() {
  const { data, loading, error } = useQuery<AllOrdersResponse>(ALL_ORDERS, {
    errorPolicy: 'all' // Allow partial data even if some fields fail
  });

  if (loading) return <div className="p-8">Loading orders...</div>;
  
  // Show error but still try to display data if available
  if (error && !data) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">Error: {error.message}</div>
        <div className="text-gray-600">
          {error.message?.includes('null') || error.message?.includes('product') 
            ? "Some orders may have items with deleted products. Please contact support if this persists."
            : "Failed to load orders. Please try again later."}
        </div>
      </div>
    );
  }
  
  // Filter out any undefined/null orders and log warnings
  if (error) {
    console.warn('Orders query had errors but partial data may be available:', error.message)
    if (error.message?.includes('null') || error.message?.includes('product')) {
      console.warn('Some order items may have null products - this is expected if products were deleted')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">All Orders</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.allOrders && data.allOrders.length > 0 ? (
                  data.allOrders
                    .filter((order): order is Order => order != null && order.id != null)
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userID || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{(order.totalAmount || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {order.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

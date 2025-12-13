"use client";
import { useCart } from "@/src/hooks/use-cart";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "@/graphql/orders";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CreateOrderResponse {
  createOrder: {
    id: string;
    totalAmount: number;
    status: string;
  };
}

interface CreateOrderInput {
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [createOrder, { loading }] = useMutation<CreateOrderResponse>(CREATE_ORDER);

  const handleCheckout = async () => {
    try {
      // Prepare items for order creation
      const items = cart?.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      })) || [];

      const res = await createOrder({
        variables: {
          input: {
            items
          }
        }
      });
      
      if (res.data?.createOrder.id) {
        router.push("/order-success?orderId=" + res.data.createOrder.id);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  if (!cart) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {cart.items.length > 0 ? (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">Product #{item.productId}</p>
                    <p className="text-gray-600 text-sm">Variant: {item.variantId}</p>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold">${cart.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        
        <Button 
          onClick={handleCheckout} 
          disabled={loading || cart.items.length === 0}
          className="w-full bg-black text-white py-3 text-lg"
        >
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
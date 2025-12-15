"use client";
import { useCart } from "@/src/hooks/use-cart";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { CREATE_ORDER } from "@/graphql/orders";
import { VALIDATE_PROMO_CODE } from "@/graphql/promo";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CreateOrderResponse {
  createOrder: {
    id: string;
    totalAmount: number;
    status: string;
  };
}

interface ValidatePromoResponse {
  validatePromoCode: {
    isValid: boolean;
    discountAmount: number;
    message: string;
  };
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const [createOrder, { loading: ordering }] = useMutation<CreateOrderResponse>(CREATE_ORDER);
  const [validatePromo, { loading: validating }] = useLazyQuery<ValidatePromoResponse>(VALIDATE_PROMO_CODE);

  const subtotal = cart?.totalAmount || 0;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    try {
      const { data } = await validatePromo({
        variables: {
          code: promoInput,
          orderAmount: subtotal,
        },
      });

      if (data?.validatePromoCode.isValid) {
        setAppliedPromo(promoInput);
        setDiscount(data.validatePromoCode.discountAmount);
        setPromoError("");
      } else {
        setPromoError(data?.validatePromoCode.message || "Invalid code");
        setAppliedPromo(null);
        setDiscount(0);
      }
    } catch (error) {
      setPromoError("Error validating promo code");
      console.error(error);
    }
  };

  const handleCheckout = async () => {
    try {
      const items = cart?.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })) || [];

      const res = await createOrder({
        variables: {
          input: {
            items,
            promoCode: appliedPromo,
          },
        },
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

  const finalTotal = subtotal - discount;

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
                <p className="text-lg font-semibold">Subtotal</p>
                <p className="text-lg font-semibold">${subtotal.toFixed(2)}</p>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <p className="font-semibold">Discount ({appliedPromo})</p>
                  <p className="font-semibold">-${discount.toFixed(2)}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
                <p>Total</p>
                <p>${finalTotal.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium mb-2">Promo Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 border rounded"
              disabled={appliedPromo !== null}
            />
            {appliedPromo ? (
              <button
                onClick={() => {
                  setAppliedPromo(null);
                  setDiscount(0);
                  setPromoInput("");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={handleApplyPromo}
                disabled={validating}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {validating ? "Validating..." : "Apply"}
              </button>
            )}
          </div>
          {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
          {appliedPromo && <p className="text-green-500 text-sm mt-2">✓ Code applied!</p>}
        </div>

        <Button
          onClick={handleCheckout}
          disabled={ordering || cart.items.length === 0}
          className="w-full bg-black text-white py-3 text-lg"
        >
          {ordering ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
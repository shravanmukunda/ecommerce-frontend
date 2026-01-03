"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCart } from "@/src/hooks/use-cart";
import { useRazorpay } from "@/hooks/use-razorpay";
import { usePromo } from "@/hooks/use-promo";

import {
  CREATE_ORDER,
  CREATE_RAZORPAY_ORDER,
  VERIFY_PAYMENT,
} from "@/graphql/orders";

/* =======================
   GraphQL Response Types
   ======================= */

interface CreateOrderResponse {
  createOrder: {
    id: string;
  };
}

interface CreateRazorpayOrderResponse {
  createRazorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };
}

interface VerifyPaymentResponse {
  verifyPayment: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { openRazorpay } = useRazorpay();
  const { promo } = usePromo();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  /* =======================
     GraphQL Mutations
     ======================= */

  const [createOrder] =
    useMutation<CreateOrderResponse>(CREATE_ORDER);

  const [createRazorpayOrder] =
    useMutation<CreateRazorpayOrderResponse>(CREATE_RAZORPAY_ORDER);

  const [verifyPayment] =
    useMutation<VerifyPaymentResponse>(VERIFY_PAYMENT);

  /* =======================
     Form State (phone added)
     ======================= */

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const orderItems = cart?.items || [];

  const subtotal = orderItems.reduce(
    (sum: number, item: any) => sum + item.unitPrice * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const totalBeforeDiscount = subtotal + shipping;
  const finalTotal = totalBeforeDiscount - promo.discount;
  const total = Math.max(finalTotal, 0);

  /* =======================
     Checkout Handler
     ======================= */

  const handleCheckout = async () => {
    // Validate required fields
    if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName) {
      alert("Please fill in all contact information fields.");
      setStep(1);
      return;
    }

    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      alert("Please fill in all shipping address fields.");
      setStep(2);
      return;
    }

    // Validate cart
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Your cart is empty. Please add items to your cart before checkout.");
      router.push("/cart");
      return;
    }

    // Check Razorpay key
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      alert("Payment gateway is not configured. Please contact support.");
      setIsProcessing(false);
      return;
    }

    try {
      setIsProcessing(true);

      // 1️⃣ Create DB Order
      const orderRes = await createOrder({
        variables: {
          input: {
            shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.country} - ${formData.postalCode}`,
          },
        },
      });

      if (!orderRes.data?.createOrder?.id) {
        throw new Error("Failed to create order: No order ID returned");
      }

      const orderId = orderRes.data.createOrder.id;

      // 2️⃣ Create Razorpay Order
      const rpRes = await createRazorpayOrder({
        variables: { orderID: orderId },
      });

      if (!rpRes.data?.createRazorpayOrder) {
        throw new Error("Failed to create Razorpay order");
      }

      const razorpayOrder = rpRes.data.createRazorpayOrder;

      // 3️⃣ Open Razorpay Checkout
      openRazorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "AuraGaze",
        description: "Order Payment",

        handler: async function (response: any) {
          if (cart?.id) {
            clearCart(cart.id).catch(() => {
              // Silently handle cart clear failure
            });
          }
          router.push(`/order-success?orderId=${orderId}`);
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },

        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#000000",
        },
      });
    } catch (error: any) {
      // Extract error message
      let errorMessage = "Checkout failed. Please try again.";
      
      if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message || errorMessage;
      } else if (error?.networkError) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(`Checkout failed: ${errorMessage}`);
      setIsProcessing(false);
    }
  };

  /* =======================
     UI States
     ======================= */

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading cart...</h1>
      </div>
    );
  }

  if (!orderItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
      </div>
    );
  }

  /* =======================
     UI
     ======================= */

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      <section className="bg-black py-8 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase">
          Secure Checkout
        </h1>
        <div className="mt-2 flex justify-center items-center gap-2 text-sm">
          <Lock className="h-4 w-4" /> SSL Encrypted
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">
                Contact Information
              </h2>
              <Input name="email" placeholder="Email" onChange={handleInputChange} />
              <Input
                name="phone"
                placeholder="Phone Number"
                className="mt-4"
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input name="firstName" placeholder="First Name" onChange={handleInputChange} />
                <Input name="lastName" placeholder="Last Name" onChange={handleInputChange} />
              </div>
              <Button className="mt-6" onClick={() => setStep(2)}>
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">
                Shipping Address
              </h2>
              <Input name="address" placeholder="Address" onChange={handleInputChange} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input name="city" placeholder="City" onChange={handleInputChange} />
                <Input name="postalCode" placeholder="Postal Code" onChange={handleInputChange} />
              </div>
              <Input
                name="country"
                placeholder="Country"
                className="mt-4"
                onChange={handleInputChange}
              />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">
                Confirm & Pay
              </h2>
              <Button
                disabled={isProcessing}
                onClick={handleCheckout}
                className="bg-black text-white w-full"
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="bg-[#121212] border border-[#1a1a1a] rounded-xl p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">
            Order Summary
          </h2>

          {orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm text-[#999]">
              <span>
                {item.product?.name} × {item.quantity}
              </span>
              <span className="text-[#e5e5e5]">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="space-y-4 mt-6 mb-6">
            <div className="flex justify-between text-[#999]">
              <span>Subtotal</span>
              <span className="text-[#e5e5e5]">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#999]">
              <span>Shipping</span>
              <span className="text-[#e5e5e5]">
                {shipping === 0 ? (
                  <span className="text-[#00bfff]">Free</span>
                ) : (
                  `₹${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {promo.discount > 0 && (
              <div className="flex justify-between text-[#00bfff]">
                <span>Discount ({promo.code})</span>
                <span>-₹{promo.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-[#1a1a1a] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#e5e5e5]">Total</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-[#0099ff]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 text-xs text-[#666] gap-2">
            <Lock className="h-3 w-3" /> Secure Payment
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/src/hooks/use-cart";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_ORDER,
  CREATE_RAZORPAY_ORDER,
  VERIFY_PAYMENT,
} from "@/graphql/orders";
import { useRouter } from "next/navigation";
import { useRazorpay } from "@/hooks/use-razorpay";

/* ---------------- TYPES ---------------- */

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

/* ---------------- COMPONENT ---------------- */

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const { cart, loading: cartLoading, error: cartError, clearCart } = useCart();
  const router = useRouter();
  const { openRazorpay } = useRazorpay();

  const [createOrder] = useMutation(CREATE_ORDER);
  const [createRazorpayOrder] = useMutation(CREATE_RAZORPAY_ORDER);
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const orderItems = cart?.items || [];

  const subtotal = orderItems.reduce(
    (sum: number, item: any) => sum + item.unitPrice * item.quantity,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------- CHECKOUT FLOW ---------------- */

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      /* 1️⃣ Create DB Order (PENDING) */
      const orderRes = await createOrder({
        variables: {
          input: {
            shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.country} - ${formData.postalCode}`,
          },
        },
      });

      const orderId = (orderRes.data as CreateOrderResponse).createOrder.id;

      /* 2️⃣ Create Razorpay Order */
      const razorpayRes = await createRazorpayOrder({
        variables: { orderID: orderId },
      });

      const razorpayOrder = (
        razorpayRes.data as CreateRazorpayOrderResponse
      ).createRazorpayOrder;

      /* 3️⃣ Open Razorpay Checkout */
      openRazorpay({
                  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                  amount: razorpayOrder.amount,
                  currency: razorpayOrder.currency,
                  order_id: razorpayOrder.id,
                  name: "AuraGaze",
                  description: "Order Payment",

            // 👇👇👇 PUT IT EXACTLY HERE
        handler: async function (response: any) {
          console.log("🔥 Razorpay handler called");
          console.log("🔥 Razorpay response:", response);

        try {
           await verifyPayment({
            variables: {
            input: {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            },
          },
        });

      console.log("✅ verifyPayment success");

      router.push(`/order-success?orderId=${orderId}`);
    } catch (err) {
      console.error("❌ verifyPayment failed", err);
      alert("Payment verification failed");
    }
  },

        modal: {
          ondismiss: () => setIsProcessing(false),
        },

        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: "9999999999",
        },

        theme: {
          color: "#000000",
        },
      });
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Please try again.");
      setIsProcessing(false);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading cart...</h1>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading cart</h1>
          <p className="text-gray-600 mb-4">{cartError.message}</p>
          <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  if (!orderItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty.</h1>
          <Button onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      <section className="bg-black py-8 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase">
          Secure Checkout
        </h1>
        <div className="mt-2 flex justify-center items-center gap-2 text-sm">
          <Lock className="h-4 w-4" />
          SSL Encrypted
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
              <Input
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleInputChange}
                />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                />
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
              <Input
                name="address"
                placeholder="Address"
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  name="city"
                  placeholder="City"
                  onChange={handleInputChange}
                />
                <Input
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={handleInputChange}
                />
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
                {isProcessing ? "Processing Payment..." : "Pay Now"}
              </Button>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="bg-gray-50 p-8 rounded">
          <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
          {orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm">
              <span>
                {item.product?.name || "Item"} × {item.quantity}
              </span>
              <span>
                ₹{(item.quantity * item.unitPrice).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-center mt-4 text-xs gap-2">
            <Lock className="h-3 w-3" /> Secure Payment
          </div>
        </div>
      </div>
    </div>
  );
}

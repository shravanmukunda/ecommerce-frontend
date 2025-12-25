"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCart } from "@/src/hooks/use-cart";
import { useRazorpay } from "@/hooks/use-razorpay";

import {
  CREATE_ORDER,
  CREATE_RAZORPAY_ORDER,
} from "@/graphql/orders";

export const dynamic = "force-dynamic";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { openRazorpay } = useRazorpay();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [createOrder] = useMutation<CreateOrderResponse>(CREATE_ORDER);
  const [createRazorpayOrder] = useMutation<CreateRazorpayOrderResponse>(CREATE_RAZORPAY_ORDER);

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
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

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

      console.log("🛒 Creating order with cart:", cart.id);
      console.log("📦 Cart items:", cart.items.length);

      // Step 1: Create order
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
      console.log("✅ Order created:", orderId);

      // Step 2: Create Razorpay order
      const rpRes = await createRazorpayOrder({
        variables: { orderID: orderId },
      });

      if (!rpRes.data?.createRazorpayOrder) {
        throw new Error("Failed to create Razorpay order");
      }

      const razorpayOrder = rpRes.data.createRazorpayOrder;
      console.log("✅ Razorpay order created:", razorpayOrder.id);

      // Step 3: Open Razorpay checkout
      openRazorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "AuraGaze",
        description: "Order Payment",

        handler: async function (response: any) {
          console.log("✅ Razorpay payment successful:", response);
          if (cart?.id) {
            clearCart(cart.id).catch(err => console.error("Cart clear failed", err));
          }
          router.push(`/order-success?orderId=${orderId}`);
        },

        modal: {
          ondismiss: () => {
            console.log("❌ Razorpay modal dismissed");
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
      console.error("❌ Checkout failed:", error);
      
      // Extract error message
      let errorMessage = "Checkout failed. Please try again.";
      
      if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message || errorMessage;
      } else if (error?.networkError) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Show detailed error
      alert(`Checkout failed: ${errorMessage}\n\nPlease check the console for more details.`);
      setIsProcessing(false);
    }
  };

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

        <div className="bg-gray-50 p-8 rounded">
          <h2 className="mb-6 text-xl font-bold">Order Summary</h2>

          {orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm">
              <span>
                {item.product?.name} × {item.quantity}
              </span>
              <span>₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
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

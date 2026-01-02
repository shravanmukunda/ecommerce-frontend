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
  const { promo } = usePromo();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax - promo.discount;
  const total = Math.max(finalTotal, 0); // Ensure total doesn't go negative

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      const orderRes = await createOrder({
        variables: {
          input: {
            shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.country} - ${formData.postalCode}`,
          },
        },
      });

      const orderId = orderRes.data!.createOrder.id;

      const rpRes = await createRazorpayOrder({
        variables: { orderID: orderId },
      });

      const razorpayOrder = rpRes.data!.createRazorpayOrder;

      openRazorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "AuraGaze",
        description: "Order Payment",

        handler: () => {
          console.log("Razorpay payment successful");
          if (cart?.id) {
            clearCart(cart.id).catch(err => console.error("Cart clear failed", err));
          }
          setIsRedirecting(true);
          router.push(`/order-success?orderId=${orderId}`);
        },

        modal: {
          ondismiss: () => {
            if (!isRedirecting) {
              setIsProcessing(false);
            }
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
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="text-2xl font-bold text-[#e5e5e5]">Loading cart...</h1>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Redirecting...</h1>
      </div>
    );
  }

  if (!orderItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="text-2xl font-bold text-[#e5e5e5]">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl text-[#e5e5e5]">
            Secure Checkout
          </h1>
          <div className="mt-2 flex justify-center items-center gap-2 text-sm text-[#999]">
            <Lock className="h-4 w-4" /> SSL Encrypted
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {step === 1 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">Contact Information</h2>
              <Input name="email" placeholder="Email" onChange={handleInputChange} />
              <Input name="phone" placeholder="Phone Number" className="mt-4" onChange={handleInputChange} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input name="firstName" placeholder="First Name" onChange={handleInputChange} />
                <Input name="lastName" placeholder="Last Name" onChange={handleInputChange} />
              </div>
              <Button className="mt-6" onClick={() => setStep(2)}>Continue</Button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">Shipping Address</h2>
              <Input name="address" placeholder="Address" onChange={handleInputChange} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input name="city" placeholder="City" onChange={handleInputChange} />
                <Input name="postalCode" placeholder="Postal Code" onChange={handleInputChange} />
              </div>
              <Input name="country" placeholder="Country" className="mt-4" onChange={handleInputChange} />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">Confirm & Pay</h2>
              <Button disabled={isProcessing} onClick={handleCheckout} className="bg-black text-white w-full">
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-[#121212] border border-[#1a1a1a] rounded-xl p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">
            Order Summary
          </h2>
          
          {orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm text-[#999]">
              <span>{item.product?.name} × {item.quantity}</span>
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
            <div className="flex justify-between text-[#999]">
              <span>Tax</span>
              <span className="text-[#e5e5e5]">₹{tax.toFixed(2)}</span>
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

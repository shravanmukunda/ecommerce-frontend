"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "@/graphql/orders";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [createOrder, { loading }] = useMutation(CREATE_ORDER);

  // Define the type for the createOrder response
  interface CreateOrderResponse {
    createOrder: {
      id: string;
      // Add other fields as needed
    };
  }

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

  const handleCheckout = async () => {
    try {
      const res = await createOrder({
        variables: {
          input: {
            shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.country} - ${formData.postalCode}`,
          },
        },
      }) as { data: CreateOrderResponse };

      // Pass the cart ID to clearCart function
      if (cart?.id) {
        clearCart(cart.id);
      }
      router.push("/order-success?orderId=" + res.data.createOrder.id);
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please try again.");
    }
  };

  if (!orderItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero */}
      <section className="bg-black py-8 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase">Secure Checkout</h1>
        <div className="mt-2 flex justify-center items-center gap-2 text-sm">
          <Lock className="h-4 w-4" />
          SSL Encrypted
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT FORM */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">Contact Information</h2>
              <Input name="email" placeholder="Email" onChange={handleInputChange} />
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
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="mb-4 text-2xl font-black uppercase">Confirm Order</h2>
              <Button
                disabled={loading}
                onClick={handleCheckout}
                className="bg-black text-white w-full"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </>
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-gray-50 p-8 rounded">
          <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
          {orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm">
              <span>{item.product?.name || "Item"} × {item.quantity}</span>
              <span>₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
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

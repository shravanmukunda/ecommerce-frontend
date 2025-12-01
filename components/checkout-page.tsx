"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Lock, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "@/graphql/order";
import { useRouter } from "next/navigation";

const orderItems = [
  {
    id: 1,
    name: "ESSENTIAL TEE",
    price: 85,
    quantity: 2,
    size: "M",
    image: "/placeholder.svg?height=100&width=80&text=Tee",
  },
  {
    id: 2,
    name: "CARGO PANTS",
    price: 195,
    quantity: 1,
    size: "M",
    image: "/placeholder.svg?height=100&width=80&text=Cargo",
  },
]

export function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Process payment
    setStep(4) // Success step
  }

  if (step === 4) {
    return (
      <div className="min-h-screen pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-16">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8 text-6xl">✅</div>
              <h1 className="mb-4 text-3xl font-black uppercase tracking-wider">Order Confirmed!</h1>
              <p className="mb-8 text-lg text-gray-600">
                Thank you for your purchase. Your order #BLV-2024-001 has been confirmed and will be shipped within 2-3
                business days.
              </p>
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                >
                  Track Your Order
                </Button>
                <div>
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-black py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl">Secure Checkout</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Lock className="h-4 w-4" />
              <span>SSL Encrypted & Secure</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <ScrollReveal direction="up">
              <div className="mb-8 flex items-center justify-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        step >= stepNumber ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`h-0.5 w-16 ${step > stepNumber ? "bg-black" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Contact Information */}
              {step === 1 && (
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="mb-6 text-2xl font-black uppercase tracking-wider">Contact Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block font-semibold uppercase tracking-wide">Email Address</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-black focus:ring-black"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block font-semibold uppercase tracking-wide">First Name</label>
                          <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="border-black focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block font-semibold uppercase tracking-wide">Last Name</label>
                          <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="border-black focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-6 bg-black px-8 py-3 text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                    >
                      Continue to Shipping
                    </Button>
                  </div>
                </ScrollReveal>
              )}

              {/* Step 2: Shipping Information */}
              {step === 2 && (
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="mb-6 text-2xl font-black uppercase tracking-wider">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block font-semibold uppercase tracking-wide">Address</label>
                        <Input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="border-black focus:ring-black"
                          placeholder="123 Street Name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block font-semibold uppercase tracking-wide">City</label>
                          <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="border-black focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block font-semibold uppercase tracking-wide">Postal Code</label>
                          <Input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            required
                            className="border-black focus:ring-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block font-semibold uppercase tracking-wide">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          required
                          className="w-full border border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="FR">France</option>
                          <option value="DE">Germany</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-4">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        className="bg-black px-8 py-3 text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Step 3: Payment Information */}
              {step === 3 && (
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="mb-6 text-2xl font-black uppercase tracking-wider">Payment Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block font-semibold uppercase tracking-wide">Card Number</label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                            className="border-black focus:ring-black pl-10"
                            placeholder="1234 5678 9012 3456"
                          />
                          <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block font-semibold uppercase tracking-wide">Expiry Date</label>
                          <Input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                            className="border-black focus:ring-black"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block font-semibold uppercase tracking-wide">CVV</label>
                          <Input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            className="border-black focus:ring-black"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block font-semibold uppercase tracking-wide">Name on Card</label>
                        <Input
                          type="text"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          required
                          className="border-black focus:ring-black"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-4">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        variant="outline"
                        className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="bg-black px-8 py-3 text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                      >
                        Complete Order
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="right">
              <div className="sticky top-24 bg-gray-50 p-8">
                <h2 className="mb-6 text-2xl font-black uppercase tracking-wider">Order Summary</h2>

                {/* Order Items */}
                <div className="mb-6 space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold uppercase tracking-wide">{item.name}</h3>
                        <p className="text-xs text-gray-600">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-2 border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mt-6 space-y-2 text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-1">
                    <Lock className="h-3 w-3" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Truck className="h-3 w-3" />
                    <span>Free shipping & returns</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
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

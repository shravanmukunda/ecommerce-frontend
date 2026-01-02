"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Lock, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCart } from "@/src/hooks/use-cart";
import { useRazorpay } from "@/hooks/use-razorpay";
import { GET_PRODUCT } from "@/graphql/product-queries";
import { client as apolloClientInstance } from "@/lib/apolloClient";

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

interface Inventory {
  id: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  priceModifier: number;
  sku: string;
  price: number;
  inventory: Inventory;
}

interface Product {
  id: string;
  name: string;
  variants?: ProductVariant[];
}

interface GetProductQueryData {
  product: Product;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { openRazorpay } = useRazorpay();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productInventoryMap, setProductInventoryMap] = useState<Map<string, any>>(new Map());

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

  // Fetch product inventory data for all cart items
  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      setProductInventoryMap(new Map());
      return;
    }

    const fetchInventoryData = async () => {
      const map = new Map<string, any>();
      
      try {
        const queries = cart.items.map((item: any) =>
          apolloClientInstance.query<GetProductQueryData>({
            query: GET_PRODUCT,
            variables: { id: item.productId },
            fetchPolicy: "cache-first",
          })
        );
        
        const results = await Promise.allSettled(queries);
        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value.data?.product) {
            const product = result.value.data.product;
            const variant = product.variants?.find((v: any) => v.id === cart.items[index].variantId);
            map.set(cart.items[index].id, {
              availableQuantity: variant?.inventory?.availableQuantity ?? 0,
              variant,
            });
          }
        });
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
      
      setProductInventoryMap(map);
    };

    fetchInventoryData();
  }, [cart?.items]);

  // Check if any cart items are out of stock
  const hasOutOfStockItems = useMemo(() => {
    if (!cart?.items) return false;
    return cart.items.some((item: any) => {
      const inventory = productInventoryMap.get(item.id);
      if (!inventory) return false;
      return inventory.availableQuantity < item.quantity;
    });
  }, [cart?.items, productInventoryMap]);

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

    // Validate stock availability
    if (hasOutOfStockItems) {
      alert("Some items in your cart are out of stock. Please return to your cart and remove them before proceeding.");
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="text-2xl font-bold text-[#e5e5e5]">Loading cart...</h1>
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
        {/* Out of Stock Warning */}
        {hasOutOfStockItems && (
          <div className="lg:col-span-3 bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-1">Some items are out of stock</h3>
                <p className="text-red-300 text-sm mb-2">
                  Some items in your cart are out of stock. Please return to your cart and remove them before proceeding to checkout.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/cart")}
                  className="border-red-400 text-red-400 hover:bg-red-400/10"
                >
                  Return to Cart
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
              <h2 className="mb-6 text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Contact Information
              </h2>
              <div className="space-y-4">
                <Input 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange} 
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    name="firstName" 
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleInputChange} 
                  />
                  <Input 
                    name="lastName" 
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <Button 
                className="mt-6 bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0" 
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
              <h2 className="mb-6 text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <Input 
                  name="address" 
                  placeholder="Address" 
                  value={formData.address}
                  onChange={handleInputChange} 
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    name="city" 
                    placeholder="City" 
                    value={formData.city}
                    onChange={handleInputChange} 
                  />
                  <Input 
                    name="postalCode" 
                    placeholder="Postal Code" 
                    value={formData.postalCode}
                    onChange={handleInputChange} 
                  />
                </div>
                <Input
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="border-[#1a1a1a] text-[#e5e5e5] hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] bg-transparent"
                >
                  Back
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
                  onClick={() => setStep(3)}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
              <h2 className="mb-6 text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Confirm & Pay
              </h2>
              <Button
                disabled={isProcessing || hasOutOfStockItems}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isProcessing ? "Processing..." : hasOutOfStockItems ? "Cannot Proceed - Out of Stock Items" : "Pay Now"}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-[#121212] border border-[#1a1a1a] p-8 rounded-xl">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-[#e5e5e5]">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {orderItems.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm text-[#999]">
                <span className="text-[#e5e5e5]">
                  {item.product?.name} × {item.quantity}
                </span>
                <span className="text-[#e5e5e5]">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1a1a1a] mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#999]">
              <span>Subtotal</span>
              <span className="text-[#e5e5e5]">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#999]">
              <span>Tax</span>
              <span className="text-[#e5e5e5]">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-[#1a1a1a] text-[#e5e5e5]">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-center items-center mt-6 text-xs gap-2 text-[#999]">
            <Lock className="h-3 w-3" /> Secure Payment
          </div>
        </div>
      </div>
    </div>
  );
}

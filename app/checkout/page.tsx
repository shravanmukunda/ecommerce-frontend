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
                disabled={isProcessing || hasOutOfStockItems}
                onClick={handleCheckout}
                className="bg-black text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : hasOutOfStockItems ? "Cannot Proceed - Out of Stock Items" : "Pay Now"}
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

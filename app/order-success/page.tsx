"use client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#1a1a1a] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-[#00bfff]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#00bfff]/20 to-[#0099ff]/20 animate-pulse"></div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#e5e5e5] mb-4">Order Successful!</h1>
        {orderId && (
          <p className="text-[#999] mb-2">
            Order ID: <span className="font-semibold text-[#00bfff]">#{orderId}</span>
          </p>
        )}
        <p className="text-[#999] mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <div className="space-y-4">
          <Link 
            href="/dashboard/orders"
            className="block w-full bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white py-3 px-4 rounded-lg hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all duration-300"
          >
            View Order Details
          </Link>
          <Link 
            href="/shop"
            className="block w-full border border-[#1a1a1a] text-[#e5e5e5] py-3 px-4 rounded-lg hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
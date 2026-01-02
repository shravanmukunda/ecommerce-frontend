"use client"

import Link from "next/link"

import { Truck, Package, RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

export function ShippingReturnsPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl text-[#e5e5e5]">
              Shipping & Returns
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg uppercase tracking-wide md:text-xl text-[#999]">Your guide to delivery and exchanges</p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Shipping Information */}
        <section className="mb-16">
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">Shipping Information</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl hover:border-[#00bfff]/50 hover:shadow-[0_8px_30px_rgba(0,191,255,0.2)] transition-all duration-300 hover:-translate-y-2">
                <Truck className="mx-auto mb-6 h-12 w-12 text-[#00bfff]" />
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Domestic Shipping</h3>
                <p className="text-[#999]">
                  Free standard shipping (5-7 business days) on all orders over ₹100. Express shipping (2-3 business
                  days) available for ₹15.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <div className="text-center p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl hover:border-[#00bfff]/50 hover:shadow-[0_8px_30px_rgba(0,191,255,0.2)] transition-all duration-300 hover:-translate-y-2">
                <Mail className="mx-auto mb-6 h-12 w-12 text-[#00bfff]" />
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Order Tracking</h3>
                <p className="text-[#999]">
                  Once your order is shipped, you will receive a tracking number via email. You can also track your
                  order in your account.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Returns & Exchanges */}
        <section className="mb-16">
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">Returns & Exchanges</h2>
          </ScrollReveal>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Exchanges */}
            <ScrollReveal direction="up" delay={100}>
              <div className="p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <div className="flex items-center mb-6">
                  <RefreshCw className="mr-3 h-6 w-6 text-[#00bfff]" />
                  <h3 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">Exchanges</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>Exchanges are allowed only for size-related issues</li>
                  <li>Requests must be raised within 48 hours of delivery</li>
                  <li>Products must be unused, unworn, and in original condition</li>
                  <li>Exchange is subject to stock availability</li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Returns */}
            <ScrollReveal direction="up" delay={200}>
              <div className="p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <div className="flex items-center mb-6">
                  <Package className="mr-3 h-6 w-6 text-[#00bfff]" />
                  <h3 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">Returns</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>Returns are accepted only for damaged or incorrect products</li>
                  <li>Unboxing video is mandatory</li>
                  <li>Products failing quality checks will not be accepted</li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Shipping Charges */}
            <ScrollReveal direction="up" delay={300}>
              <div className="p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <div className="flex items-center mb-6">
                  <Truck className="mr-3 h-6 w-6 text-[#00bfff]" />
                  <h3 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">Shipping Charges</h3>
                </div>
                <p className="text-[#999]">
                  Return or exchange shipping costs will be borne by the customer unless the error is from our side.
                </p>
              </div>
            </ScrollReveal>

            {/* How to Initiate */}
            <ScrollReveal direction="up" delay={400}>
              <div className="text-center p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <Mail className="mx-auto mb-6 h-12 w-12 text-[#00bfff]" />
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">How to Initiate a Return</h3>
                <p className="mb-6 text-[#999]">
                  To start a return or exchange, please visit our returns portal or contact our customer service team
                  with your order number.
                </p>
                <Button className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0">
                  Start a Return
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="mt-24 bg-[#121212] border border-[#1a1a1a] rounded-xl p-12 text-center">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl text-[#e5e5e5]">Still Have Questions?</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="mb-8 text-lg text-[#999]">
              Visit our comprehensive FAQ section for more details on shipping, returns, and other common inquiries.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
            >
              <Link href="/faq">Visit FAQ</Link>
            </Button>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}

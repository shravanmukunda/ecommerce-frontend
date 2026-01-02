"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import { DollarSign, CheckCircle, XCircle, Clock } from "lucide-react"

export function RefundPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl text-[#e5e5e5]">
              Refund Policy
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg uppercase tracking-wide md:text-xl text-[#999]">
              Last updated: {currentDate}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Introduction */}
        <ScrollReveal direction="up">
          <div className="mb-12 text-[#999] leading-relaxed">
            <p className="mb-4">
              Refunds are provided only under the conditions mentioned below.
            </p>
          </div>
        </ScrollReveal>

        {/* Eligible Cases for Refund */}
        <ScrollReveal direction="up" delay={100}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <CheckCircle className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Eligible Cases for Refund
              </h2>
            </div>
            <p className="mb-4 text-[#999]">Refunds are applicable only if:</p>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>The product received is damaged or defective</li>
              <li>The wrong product is delivered</li>
            </ul>
          </section>
        </ScrollReveal>

        {/* Conditions */}
        <ScrollReveal direction="up" delay={200}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <Clock className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Conditions
              </h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>The issue must be reported within 48 hours of delivery</li>
              <li>An unboxing video is mandatory as proof</li>
              <li>The product must be unused and in original packaging</li>
            </ul>
          </section>
        </ScrollReveal>

        {/* Refund Processing */}
        <ScrollReveal direction="up" delay={300}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <DollarSign className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Refund Processing
              </h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>Approved refunds will be credited to the original payment method</li>
              <li>Refund processing time: 5–7 business days after approval</li>
            </ul>
          </section>
        </ScrollReveal>

        {/* Non-Refundable Cases */}
        <ScrollReveal direction="up" delay={400}>
          <section className="mb-16 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <XCircle className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Non-Refundable Cases
              </h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>Size-related issues</li>
              <li>Change of mind</li>
              <li>Minor color or design variations</li>
              <li>Discounted or limited-edition products (unless defective)</li>
            </ul>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}


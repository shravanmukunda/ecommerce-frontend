"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import { FileText, Scale, CreditCard, Shield } from "lucide-react"

export function TermsConditionsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl text-[#e5e5e5]">
              Terms and Conditions
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
              By accessing or purchasing from AURAGAZE, you agree to be bound by the following Terms and Conditions.
            </p>
          </div>
        </ScrollReveal>

        {/* General */}
        <ScrollReveal direction="up" delay={100}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <FileText className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                General
              </h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>All products are subject to availability.</li>
              <li>Prices, product details, and policies may change without prior notice.</li>
              <li>Product images are for representation purposes only; slight variations may occur.</li>
            </ul>
          </section>
        </ScrollReveal>

        {/* Orders and Payments */}
        <ScrollReveal direction="up" delay={200}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <CreditCard className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Orders and Payments
              </h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>Orders are confirmed only after successful payment.</li>
              <li>AURAGAZE reserves the right to cancel orders due to pricing errors, stock unavailability, or suspicious activity.</li>
            </ul>
          </section>
        </ScrollReveal>

        {/* Intellectual Property */}
        <ScrollReveal direction="up" delay={300}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <Shield className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Intellectual Property
              </h2>
            </div>
            <p className="text-[#999]">
              All content, logos, designs, and materials on this website are the property of AURAGAZE and may not be used without written permission.
            </p>
          </section>
        </ScrollReveal>

        {/* Limitation of Liability */}
        <ScrollReveal direction="up" delay={400}>
          <section className="mb-16 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <Scale className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Limitation of Liability
              </h2>
            </div>
            <p className="text-[#999]">
              AURAGAZE shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.
            </p>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}


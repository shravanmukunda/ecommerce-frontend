"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import { Shield, FileText, CreditCard, Users, Mail } from "lucide-react"

export function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl text-[#e5e5e5]">
              Privacy Policy
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
              AURAGAZE ("we", "our", "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.
            </p>
          </div>
        </ScrollReveal>

        {/* Information We Collect */}
        <ScrollReveal direction="up" delay={100}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <FileText className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Information We Collect
              </h2>
            </div>
            <p className="mb-4 text-[#999]">We may collect the following information:</p>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Contact number</li>
              <li>Shipping and billing address</li>
              <li>Payment details (processed securely via Razorpay or other third-party payment gateways)</li>
              <li>IP address and basic device/browser information</li>
            </ul>
          </section>
        </ScrollReveal>

        {/* How We Use Your Information */}
        <ScrollReveal direction="up" delay={200}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <Users className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                How We Use Your Information
              </h2>
            </div>
            <p className="mb-4 text-[#999]">Your information is used to:</p>
            <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
              <li>Process orders and payments</li>
              <li>Deliver products</li>
              <li>Provide customer support</li>
              <li>Communicate order updates and service-related information</li>
              <li>Improve our website and services</li>
            </ul>
          </section>
        </ScrollReveal>

        {/* Data Security */}
        <ScrollReveal direction="up" delay={300}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <Shield className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Data Security
              </h2>
            </div>
            <p className="text-[#999]">
              We implement reasonable security measures to protect your personal data. Payment information is not stored by us and is handled securely by authorized payment gateways.
            </p>
          </section>
        </ScrollReveal>

        {/* Third-Party Services */}
        <ScrollReveal direction="up" delay={400}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <CreditCard className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Third-Party Services
              </h2>
            </div>
            <p className="text-[#999]">
              We may share necessary information with logistics partners and payment processors solely for order fulfillment and payment processing.
            </p>
          </section>
        </ScrollReveal>

        {/* Consent */}
        <ScrollReveal direction="up" delay={500}>
          <section className="mb-16 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <h2 className="mb-4 text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
              Consent
            </h2>
            <p className="text-[#999]">
              By using our website and services, you consent to this Privacy Policy.
            </p>
          </section>
        </ScrollReveal>

        {/* Contact Information */}
        <ScrollReveal direction="up" delay={300}>
          <section className="mb-12 p-8 bg-[#121212] border border-[#1a1a1a] rounded-xl">
            <div className="flex items-center mb-6">
              <Mail className="mr-3 h-6 w-6 text-[#00bfff]" />
              <h2 className="text-2xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Contact Information
              </h2>
            </div>
            <p className="mb-4 text-[#999]">For any queries or support, contact us at:</p>
            <div className="space-y-2 text-[#999]">
              <p><span className="font-semibold text-[#e5e5e5]">Business Name:</span> AURAGAZE</p>
              <p>
                <span className="font-semibold text-[#e5e5e5]">Email:</span>{" "}
                <a 
                  href="mailto:support@auragaze.com"
                  className="text-[#00bfff] hover:text-[#0099ff] transition-colors"
                >
                  support@auragaze.com
                </a>
              </p>
              <p><span className="font-semibold text-[#e5e5e5]">Operating Country:</span> India</p>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}


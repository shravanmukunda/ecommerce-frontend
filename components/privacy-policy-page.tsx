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

        {/* Divider */}
        <div className="my-16 border-t border-[#1a1a1a]"></div>

        {/* Terms and Conditions */}
        <ScrollReveal direction="up">
          <section className="mb-12">
            <h2 className="mb-8 text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">
              Terms and Conditions
            </h2>
            <p className="mb-6 text-[#999]">
              Last updated: {currentDate}
            </p>
            <p className="mb-6 text-[#999]">
              By accessing or purchasing from AURAGAZE, you agree to be bound by the following Terms and Conditions.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">General</h3>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>All products are subject to availability.</li>
                  <li>Prices, product details, and policies may change without prior notice.</li>
                  <li>Product images are for representation purposes only; slight variations may occur.</li>
                </ul>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Orders and Payments</h3>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>Orders are confirmed only after successful payment.</li>
                  <li>AURAGAZE reserves the right to cancel orders due to pricing errors, stock unavailability, or suspicious activity.</li>
                </ul>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Intellectual Property</h3>
                <p className="text-[#999]">
                  All content, logos, designs, and materials on this website are the property of AURAGAZE and may not be used without written permission.
                </p>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Limitation of Liability</h3>
                <p className="text-[#999]">
                  AURAGAZE shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Divider */}
        <div className="my-16 border-t border-[#1a1a1a]"></div>

        {/* Refund Policy */}
        <ScrollReveal direction="up" delay={100}>
          <section className="mb-12">
            <h2 className="mb-8 text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">
              Refund Policy
            </h2>
            <p className="mb-6 text-[#999]">
              Last updated: {currentDate}
            </p>
            <p className="mb-6 text-[#999]">
              Refunds are provided only under the conditions mentioned below.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Eligible Cases for Refund</h3>
                <p className="mb-4 text-[#999]">Refunds are applicable only if:</p>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>The product received is damaged or defective</li>
                  <li>The wrong product is delivered</li>
                </ul>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Conditions</h3>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>The issue must be reported within 48 hours of delivery</li>
                  <li>An unboxing video is mandatory as proof</li>
                  <li>The product must be unused and in original packaging</li>
                </ul>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Refund Processing</h3>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>Approved refunds will be credited to the original payment method</li>
                  <li>Refund processing time: 5–7 business days after approval</li>
                </ul>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Non-Refundable Cases</h3>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>Size-related issues</li>
                  <li>Change of mind</li>
                  <li>Minor color or design variations</li>
                  <li>Discounted or limited-edition products (unless defective)</li>
                </ul>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Divider */}
        <div className="my-16 border-t border-[#1a1a1a]"></div>

        {/* Return and Exchange Policy */}
        <ScrollReveal direction="up" delay={200}>
          <section className="mb-12">
            <h2 className="mb-8 text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">
              Return and Exchange Policy
            </h2>
            <p className="mb-6 text-[#999]">
              Last updated: {currentDate}
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Exchanges</h3>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>Exchanges are allowed only for size-related issues</li>
                  <li>Requests must be raised within 48 hours of delivery</li>
                  <li>Products must be unused, unworn, and in original condition</li>
                  <li>Exchange is subject to stock availability</li>
                </ul>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Returns</h3>
                <ul className="list-disc list-inside space-y-2 text-[#999] ml-4">
                  <li>Returns are accepted only for damaged or incorrect products</li>
                  <li>Unboxing video is mandatory</li>
                  <li>Products failing quality checks will not be accepted</li>
                </ul>
              </div>

              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-xl">
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Shipping Charges</h3>
                <p className="text-[#999]">
                  Return or exchange shipping costs will be borne by the customer unless the error is from our side.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Divider */}
        <div className="my-16 border-t border-[#1a1a1a]"></div>

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


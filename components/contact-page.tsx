"use client"

import type React from "react"
import { Phone, Mail, Clock } from "lucide-react"

export function ContactPage() {

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl animate-fade-in-up">
            Contact Us
          </h1>
          <p className="text-lg uppercase tracking-wide md:text-xl animate-fade-in-up animation-delay-300">
            Get in touch with our team
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="animate-fade-in-left">
            <h2 className="mb-8 text-3xl font-black uppercase tracking-wider md:text-4xl text-white">Get in Touch</h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-200">
              Have a question about our products, need styling advice, or want to collaborate? We'd love to hear from
              you. Our team is here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="mt-1 h-6 w-6 flex-shrink-0 text-white" />
                <div>
                  <h3 className="mb-1 font-bold uppercase tracking-wide text-white">Phone</h3>
                  <a 
                    href="https://wa.me/919743198455" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +91 97431 98455
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-white" />
                <div>
                  <h3 className="mb-1 font-bold uppercase tracking-wide text-white">Email</h3>
                  <a 
                    href="mailto:support@auragaze.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    support@auragaze.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

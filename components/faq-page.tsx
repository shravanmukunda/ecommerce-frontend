"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "We offer free standard shipping (5-7 business days) on orders over $100. Express shipping (2-3 business days) is available for $15. International shipping varies by location.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "We ship to over 45 countries worldwide. Shipping costs and delivery times vary by destination. International customers are responsible for any customs duties or taxes.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return window for unworn items in original condition with tags attached. Items must be returned in original packaging.",
      },
      {
        question: "How do I exchange an item?",
        answer:
          "You can exchange items within 30 days. Simply contact our customer service team or initiate an exchange through your account dashboard.",
      },
      {
        question: "Who pays for return shipping?",
        answer:
          "We provide free return shipping for defective items or our errors. For other returns, customers are responsible for return shipping costs.",
      },
    ],
  },
  {
    category: "Sizing & Fit",
    questions: [
      {
        question: "How do I find my size?",
        answer:
          "Use our detailed size guide available on each product page. We recommend measuring yourself and comparing to our size chart for the best fit.",
      },
      {
        question: "Do your items run true to size?",
        answer:
          "Our items generally run true to size, but fit can vary by style. Check individual product descriptions for specific fit notes and sizing recommendations.",
      },
      {
        question: "Can I get help with sizing?",
        answer:
          "Our customer service team can help with sizing questions. Contact us via chat, email, or phone for personalized assistance.",
      },
    ],
  },
  {
    category: "Product Care",
    questions: [
      {
        question: "How should I care for my AuraGaze items?",
        answer:
          "Follow the care instructions on each garment's label. Generally, we recommend washing in cold water, air drying, and avoiding bleach to maintain quality and color.",
      },
      {
        question: "Are your products sustainable?",
        answer:
          "Yes! We're committed to sustainability with 95% of our materials being eco-friendly. We use organic cotton, recycled polyester, and ethical manufacturing processes.",
      },
    ],
  },
]

export function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl animate-fade-in-up text-[#e5e5e5]">
            FAQ
          </h1>
          <p className="text-lg uppercase tracking-wide md:text-xl animate-fade-in-up animation-delay-300 text-[#999]">
            Everything you need to know
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search Bar */}
        <div className="mb-16 text-center">
          <div className="mx-auto max-w-md">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#e5e5e5] placeholder:text-[#666] px-4 py-3 text-center font-semibold uppercase tracking-wide rounded-lg focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqData.map((category, categoryIndex) => (
            <div
              key={category.category}
              className="animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 200}ms` }}
            >
              <h2 className="mb-8 text-2xl font-black uppercase tracking-wider md:text-3xl text-[#e5e5e5]">{category.category}</h2>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemId = `${categoryIndex}-${questionIndex}`
                  const isOpen = openItems.includes(itemId)

                  return (
                    <div
                      key={questionIndex}
                      className="border border-[#1a1a1a] bg-[#121212] rounded-lg hover:border-[#1a1a1a]/80 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="flex w-full items-center justify-between p-6 text-left hover:bg-[#1a1a1a] transition-colors duration-200 rounded-lg"
                      >
                        <h3 className="text-lg font-bold uppercase tracking-wide text-[#e5e5e5]">{faq.question}</h3>
                        <div className={`transition-transform duration-300 text-[#999] ${isOpen ? "rotate-180 text-[#00bfff]" : ""}`}>
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t border-[#1a1a1a] p-6 pt-4">
                          <p className="leading-relaxed text-[#999]">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <section className="mt-24 bg-[#121212] border border-[#1a1a1a] rounded-xl p-12 text-center">
          <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl text-[#e5e5e5]">Still Have Questions?</h2>
          <p className="mb-8 text-lg text-[#999]">Our customer service team is here to help you 24/7.</p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
            >
              Live Chat
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#1a1a1a] px-8 py-4 text-lg font-bold uppercase tracking-wide text-[#e5e5e5] hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] hover:scale-105 transition-all duration-300 bg-transparent"
            >
              Email Support
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)

    alert("Message sent successfully!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-black py-16 text-white">
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
            <h2 className="mb-8 text-3xl font-black uppercase tracking-wider md:text-4xl">Get in Touch</h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              Have a question about our products, need styling advice, or want to collaborate? We'd love to hear from
              you. Our team is here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="mb-1 font-bold uppercase tracking-wide">Address</h3>
                  <p className="text-gray-600">
                    123 Fashion District
                    <br />
                    Paris, France 75001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="mb-1 font-bold uppercase tracking-wide">Phone</h3>
                  <p className="text-gray-600">+33 1 23 45 67 89</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="mb-1 font-bold uppercase tracking-wide">Email</h3>
                  <p className="text-gray-600">hello@auragaze.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="mb-1 font-bold uppercase tracking-wide">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-right">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block font-semibold uppercase tracking-wide">
                    Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-black focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block font-semibold uppercase tracking-wide">
                    Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-black focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block font-semibold uppercase tracking-wide">
                  Subject *
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="border-black focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block font-semibold uppercase tracking-wide">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-black py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 disabled:opacity-50 hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-24">
          <div className="aspect-[16/9] w-full overflow-hidden bg-gray-200">
            <div className="flex h-full items-center justify-center">
              <p className="text-lg font-semibold uppercase tracking-wide text-gray-600">Interactive Map Coming Soon</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const dummyReturnableItems = [
  { id: "item-1", name: "ESSENTIAL TEE", orderId: "SM-2024-001", price: 85.0, reason: "" },
  { id: "item-2", name: "CARGO PANTS", orderId: "SM-2024-001", price: 195.0, reason: "" },
  { id: "item-3", name: "OVERSIZED HOODIE", orderId: "SM-2024-002", price: 165.0, reason: "" },
]

export default function ReturnsExchangePage() {
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [returnReason, setReturnReason] = useState("")
  const [returnType, setReturnType] = useState<"return" | "exchange">("return")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsSubmitting(true)

    if (!selectedItem || !returnReason) {
      setMessage("Please select an item and provide a reason.")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setMessage(`Your ${returnType} request for ${selectedItem} has been submitted successfully!`)
    setSelectedItem("")
    setReturnReason("")
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-wider">Returns / Exchange</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-wide">Initiate a New Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReturn} className="space-y-6">
            <div>
              <label htmlFor="returnType" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                Request Type
              </label>
              <Select value={returnType} onValueChange={(value: "return" | "exchange") => setReturnType(value)}>
                <SelectTrigger className="w-full border-black text-black">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="itemSelect" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                Select Item to {returnType === "return" ? "Return" : "Exchange"}
              </label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="w-full border-black text-black">
                  <SelectValue placeholder="Choose an item from your past orders" />
                </SelectTrigger>
                <SelectContent>
                  {dummyReturnableItems.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name} (Order: {item.orderId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="reason" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                Reason for {returnType === "return" ? "Return" : "Exchange"}
              </label>
              <Textarea
                id="reason"
                placeholder="e.g., Too small, changed mind, defective item..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                required
                rows={4}
                className="border-black focus:ring-black"
              />
            </div>

            {message && <p className="text-sm text-center text-green-600">{message}</p>}

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              disabled={isSubmitting || !selectedItem || !returnReason}
            >
              {isSubmitting ? "Submitting..." : `Submit ${returnType === "return" ? "Return" : "Exchange"} Request`}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-wide">Your Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No recent return or exchange requests found.</p>
          {/* In a real app, you'd list past requests here */}
        </CardContent>
      </Card>
    </div>
  )
}

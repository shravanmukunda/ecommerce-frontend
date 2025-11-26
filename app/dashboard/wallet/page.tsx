"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, CreditCardIcon } from "lucide-react"

interface PaymentMethod {
  id: string
  type: "Visa" | "Mastercard" | "Amex" | "Discover"
  last4: string
  expiry: string
  isDefault: boolean
}

const dummyPaymentMethods: PaymentMethod[] = [
  { id: "card-1", type: "Visa", last4: "1234", expiry: "12/26", isDefault: true },
  { id: "card-2", type: "Mastercard", last4: "5678", expiry: "08/25", isDefault: false },
]

export default function WalletPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(dummyPaymentMethods)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState({
    type: "Visa",
    cardNumber: "",
    expiry: "",
    cvv: "",
    isDefault: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault()
    const last4 = formData.cardNumber.slice(-4)
    const newMethod: PaymentMethod = {
      id: editingMethod ? editingMethod.id : `card-${Date.now()}`,
      type: formData.type as PaymentMethod["type"],
      last4,
      expiry: formData.expiry,
      isDefault: formData.isDefault,
    }

    if (editingMethod) {
      setPaymentMethods(paymentMethods.map((method) => (method.id === editingMethod.id ? newMethod : method)))
      setEditingMethod(null)
    } else {
      setPaymentMethods([...paymentMethods, newMethod])
      setIsAddingNew(false)
    }
    setFormData({ type: "Visa", cardNumber: "", expiry: "", cvv: "", isDefault: false })
  }

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
  }

  const startEditing = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({
      type: method.type,
      cardNumber: `•••• •••• •••• ${method.last4}`, // Placeholder for display
      expiry: method.expiry,
      cvv: "•••", // Placeholder
      isDefault: method.isDefault,
    })
    setIsAddingNew(false)
  }

  const startAdding = () => {
    setIsAddingNew(true)
    setEditingMethod(null)
    setFormData({ type: "Visa", cardNumber: "", expiry: "", cvv: "", isDefault: false })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-wider">My Wallet</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold uppercase tracking-wide">Payment Methods</CardTitle>
          <Button onClick={startAdding} className="bg-black text-white hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentMethods.length === 0 ? (
            <p className="text-gray-600">You have no saved payment methods.</p>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="border border-gray-200 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex items-center space-x-4">
                  <CreditCardIcon className="h-8 w-8 text-gray-600" />
                  <div>
                    <h3 className="font-bold uppercase tracking-wide">
                      {method.type} ending in {method.last4}
                    </h3>
                    <p className="text-gray-700">Expires: {method.expiry}</p>
                    {method.isDefault && (
                      <span className="bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => startEditing(method)}
                    className="border-black text-black hover:bg-black hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteMethod(method.id)}
                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {(isAddingNew || editingMethod) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide">
              {editingMethod ? "Edit Payment Method" : "Add New Payment Method"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveMethod} className="space-y-6">
              <div>
                <label htmlFor="type" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                  Card Type
                </label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as PaymentMethod["type"] })}
                >
                  <SelectTrigger className="w-full border-black text-black">
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                    <SelectItem value="Amex">American Express</SelectItem>
                    <SelectItem value="Discover">Discover</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="cardNumber" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                  Card Number
                </label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="•••• •••• •••• ••••"
                  maxLength={19} // 16 digits + 3 spaces
                  required
                  className="border-black focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                    Expiry Date (MM/YY)
                  </label>
                  <Input
                    id="expiry"
                    name="expiry"
                    type="text"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    className="border-black focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                    CVV
                  </label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="text"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="•••"
                    maxLength={4}
                    required
                    className="border-black focus:ring-black"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="text-sm font-semibold uppercase tracking-wide">
                  Set as default payment method
                </label>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  Save Payment Method
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false)
                    setEditingMethod(null)
                  }}
                  className="border-black text-black hover:bg-black hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

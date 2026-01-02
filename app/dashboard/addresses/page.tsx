"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefaultShipping: boolean
  isDefaultBilling: boolean
}

// GraphQL queries and mutations
const GET_ADDRESSES = gql`
  query GetAddresses {
    # This would be implemented in a real application
    # For now, we'll return an empty array
    addresses {
      id
      name
      street
      city
      state
      zip
      country
      isDefaultShipping
      isDefaultBilling
    }
  }
`

const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddressInput!) {
    # This would be implemented in a real application
    addAddress(input: $input) {
      id
      name
      street
      city
      state
      zip
      country
      isDefaultShipping
      isDefaultBilling
    }
  }
`

const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: ID!, $input: AddressInput!) {
    # This would be implemented in a real application
    updateAddress(id: $id, input: $input) {
      id
      name
      street
      city
      state
      zip
      country
      isDefaultShipping
      isDefaultBilling
    }
  }
`

const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    # This would be implemented in a real application
    deleteAddress(id: $id)
  }
`

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefaultShipping: false,
    isDefaultBilling: false,
  })

  // In a real application, you would fetch addresses from the API
  // const { data, loading, error } = useQuery(GET_ADDRESSES)
  
  // For now, we'll initialize with an empty array
  useEffect(() => {
    setAddresses([])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddress) {
      // In a real application, you would call the update mutation
      // updateAddress({ variables: { id: editingAddress.id, input: formData } })
      setAddresses(
        addresses.map((addr) => (addr.id === editingAddress.id ? ({ ...formData, id: addr.id } as Address) : addr)),
      )
      setEditingAddress(null)
    } else {
      // In a real application, you would call the add mutation
      // addAddress({ variables: { input: formData } })
      const newAddress: Address = { ...formData, id: `addr-${Date.now()}` } as Address
      setAddresses([...addresses, newAddress])
      setIsAddingNew(false)
    }
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefaultShipping: false,
      isDefaultBilling: false,
    })
  }

  const handleDeleteAddress = (id: string) => {
    // In a real application, you would call the delete mutation
    // deleteAddress({ variables: { id } })
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const startEditing = (address: Address) => {
    setEditingAddress(address)
    setFormData(address)
    setIsAddingNew(false)
  }

  const startAdding = () => {
    setIsAddingNew(true)
    setEditingAddress(null)
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefaultShipping: false,
      isDefaultBilling: false,
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">My Addresses</h1>

      <Card className="bg-[#121212] border-[#1a1a1a]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Your Saved Addresses</CardTitle>
          <Button 
            onClick={startAdding} 
            className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {addresses.length === 0 ? (
            <p className="text-[#999]">You have no saved addresses.</p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="border border-[#1a1a1a] bg-[#0f0f0f] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:border-[#00bfff]/50 transition-all duration-300"
              >
                <div>
                  <h3 className="font-bold uppercase tracking-wide text-[#e5e5e5]">{address.name}</h3>
                  <p className="text-[#999]">{address.street}</p>
                  <p className="text-[#999]">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-[#999]">{address.country}</p>
                  <div className="flex space-x-2 mt-2 text-sm">
                    {address.isDefaultShipping && (
                      <span className="bg-[#00bfff]/20 border border-[#00bfff]/50 px-2 py-1 rounded-full text-xs font-semibold text-[#00bfff]">Default Shipping</span>
                    )}
                    {address.isDefaultBilling && (
                      <span className="bg-[#00bfff]/20 border border-[#00bfff]/50 px-2 py-1 rounded-full text-xs font-semibold text-[#00bfff]">Default Billing</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => startEditing(address)}
                    className="border-[#1a1a1a] text-[#e5e5e5] hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] bg-transparent"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {(isAddingNew || editingAddress) && (
        <Card className="bg-[#121212] border-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveAddress} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                  Address Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Home, Work"
                  required
                />
              </div>
              <div>
                <label htmlFor="street" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                  Street Address
                </label>
                <Input
                  id="street"
                  name="street"
                  type="text"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                    State / Province
                  </label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zip" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                    Zip / Postal Code
                  </label>
                  <Input
                    id="zip"
                    name="zip"
                    type="text"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                    Country
                  </label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  id="isDefaultShipping"
                  name="isDefaultShipping"
                  type="checkbox"
                  checked={formData.isDefaultShipping}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#00bfff] focus:ring-[#00bfff] border-[#1a1a1a] rounded bg-[#0f0f0f]"
                />
                <label htmlFor="isDefaultShipping" className="text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                  Set as default shipping address
                </label>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  id="isDefaultBilling"
                  name="isDefaultBilling"
                  type="checkbox"
                  checked={formData.isDefaultBilling}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#00bfff] focus:ring-[#00bfff] border-[#1a1a1a] rounded bg-[#0f0f0f]"
                />
                <label htmlFor="isDefaultBilling" className="text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                  Set as default billing address
                </label>
              </div>
              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
                >
                  Save Address
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false)
                    setEditingAddress(null)
                  }}
                  className="border-[#1a1a1a] text-[#e5e5e5] hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] bg-transparent"
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
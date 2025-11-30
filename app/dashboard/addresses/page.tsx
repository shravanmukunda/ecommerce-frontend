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
      <h1 className="text-3xl font-black uppercase tracking-wider">My Addresses</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold uppercase tracking-wide">Your Saved Addresses</CardTitle>
          <Button onClick={startAdding} className="bg-black text-white hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {addresses.length === 0 ? (
            <p className="text-gray-600">You have no saved addresses.</p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h3 className="font-bold uppercase tracking-wide">{address.name}</h3>
                  <p className="text-gray-700">{address.street}</p>
                  <p className="text-gray-700">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-gray-700">{address.country}</p>
                  <div className="flex space-x-2 mt-2 text-sm">
                    {address.isDefaultShipping && (
                      <span className="bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold">Default Shipping</span>
                    )}
                    {address.isDefaultBilling && (
                      <span className="bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold">Default Billing</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => startEditing(address)}
                    className="border-black text-black hover:bg-black hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteAddress(address.id)}
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

      {(isAddingNew || editingAddress) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveAddress} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
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
                  className="border-black focus:ring-black"
                />
              </div>
              <div>
                <label htmlFor="street" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
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
                  className="border-black focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="border-black focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                    State / Province
                  </label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="border-black focus:ring-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zip" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                    Zip / Postal Code
                  </label>
                  <Input
                    id="zip"
                    name="zip"
                    type="text"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="border-black focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                    Country
                  </label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="border-black focus:ring-black"
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
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="isDefaultShipping" className="text-sm font-semibold uppercase tracking-wide">
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
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="isDefaultBilling" className="text-sm font-semibold uppercase tracking-wide">
                  Set as default billing address
                </label>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  Save Address
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false)
                    setEditingAddress(null)
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
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    // Simulate API call to update profile
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In a real app, you'd send name/email to backend and update context user
    setMessage("Profile updated successfully!")
    setIsEditing(false)
  }

  if (loading) {
    return <p>Loading profile...</p>
  }

  if (!user) {
    return <p>Please log in to view your profile.</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-wider">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-wide">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="border-black focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="border-black focus:ring-black"
              />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-black text-black hover:bg-black hover:text-white"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-black text-white hover:bg-gray-800">
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-wide">Password Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Change your password to keep your account secure.</p>
          <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white bg-transparent">
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

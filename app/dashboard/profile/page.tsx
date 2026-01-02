"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [name, setName] = useState(user?.firstName || "")
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "")
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    
    try {
      if (user) {
        await user.update({
          firstName: name,
        })
      }
      setMessage("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      setMessage("Error updating profile. Please try again.")
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#e5e5e5]">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#e5e5e5]">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">My Profile</h1>
      <Card className="bg-[#121212] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#e5e5e5]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true} // Email is managed by Clerk
              />
              <p className="text-sm text-[#999] mt-1">Email can be managed in your Clerk account settings.</p>
            </div>
            {message && (
              <p className={`text-sm ${message.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setName(user.firstName || "")
                      setIsEditing(false)
                    }}
                    className="border-[#1a1a1a] text-[#e5e5e5] hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] bg-transparent"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-[#121212] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">Password Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#999] mb-4">Change your password to keep your account secure.</p>
          <Button 
            onClick={() => window.open("https://dashboard.clerk.com", "_blank")}
            variant="outline" 
            className="border-[#1a1a1a] text-[#e5e5e5] hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] bg-transparent"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signup, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      console.log('Attempting signup with:', { name, email, password });
      const result = await signup(name, email, password)
      console.log('Signup result:', result);
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "An error occurred during signup")
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || "An unexpected error occurred during signup")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black uppercase tracking-wider">Sign Up</CardTitle>
          <p className="text-gray-600">Create your Sacred Mayhem account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-black focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-black focus:ring-black"
              />
            </div>
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-black py-3 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-black hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

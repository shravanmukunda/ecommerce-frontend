"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user from local storage or a session
    const storedUser = localStorage.getItem("blvck_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    // Mock authentication logic
    if (email === "admin@example.com" && password === "adminpass") {
      const adminUser: User = { id: "admin-123", email: "admin@example.com", name: "Admin User", isAdmin: true }
      setUser(adminUser)
      localStorage.setItem("blvck_user", JSON.stringify(adminUser))
      setIsLoading(false)
      return { success: true, message: "Logged in as Admin!" }
    } else if (email === "user@example.com" && password === "userpass") {
      const regularUser: User = { id: "user-456", email: "user@example.com", name: "Regular User", isAdmin: false }
      setUser(regularUser)
      localStorage.setItem("blvck_user", JSON.stringify(regularUser))
      setIsLoading(false)
      return { success: true, message: "Logged in successfully!" }
    } else {
      setIsLoading(false)
      return { success: false, message: "Invalid email or password." }
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    // Mock signup logic (for simplicity, just create a new user)
    const newUser: User = { id: `user-${Date.now()}`, email, name, isAdmin: false }
    setUser(newUser)
    localStorage.setItem("blvck_user", JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true, message: "Account created successfully!" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("blvck_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

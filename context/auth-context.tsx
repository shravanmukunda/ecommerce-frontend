import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import client from '@/lib/apolloClient'
import { LOGIN_USER, SIGNUP_USER, LOGOUT_USER } from '@/lib/graphql/mutations'
import { GET_CURRENT_USER } from '@/lib/graphql/queries'

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Use the imported client directly
  const apolloClient = client;

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken')
        if (token) {
          // Try to fetch current user
          const { data }: any = await apolloClient.query({
            query: GET_CURRENT_USER,
            fetchPolicy: 'network-only'
          })
          setUser(data.currentUser)
        }
      } catch (err: any) {
        // If error, clear token and user
        localStorage.removeItem('authToken')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [apolloClient])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password });
      setLoading(true)
      setError(null)
      
      const { data }: any = await apolloClient.mutate({
        mutation: LOGIN_USER,
        variables: { email, password }
      })
      console.log('Login response:', data);

      // Store token in localStorage
      localStorage.setItem('authToken', data.login.token)
      
      // Set user in state
      setUser(data.login.user)
      
      console.log('Login successful, user set:', data.login.user);
      return { success: true, user: data.login.user }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message)
      return { success: false, error: err.message || 'An unknown error occurred during login' }
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data }: any = await apolloClient.mutate({
        mutation: SIGNUP_USER,
        variables: { name, email, password }
      })

      // Store token in localStorage
      localStorage.setItem('authToken', data.signup.token)
      
      // Set user in state
      setUser(data.signup.user)
      
      return { success: true, user: data.signup.user }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message || 'An unknown error occurred during signup' }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setLoading(true)
      
      // Call logout mutation
      await apolloClient.mutate({
        mutation: LOGOUT_USER
      })

      // Clear token and user
      localStorage.removeItem('authToken')
      setUser(null)
      
      // Reset Apollo Client cache
      await apolloClient.resetStore()
      
      return { success: true }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message || 'An unknown error occurred during logout' }
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

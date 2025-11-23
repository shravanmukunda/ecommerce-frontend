import { useState, ChangeEvent, FormEvent } from 'react'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const { login, loading } = useAuth()
  const { toast } = useToast()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        })
        // Redirect will be handled by the parent page or router
      } else {
        const errorMessage = result.error || "Invalid email or password"
        setErrors({ general: errorMessage })
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred."
      setErrors({ general: errorMessage })
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors.general && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {errors.general}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-black">
              Forgot password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-black font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

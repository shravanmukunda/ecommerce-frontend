import { SignUp } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

"use client"

export function Register() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none p-0',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'bg-black text-white hover:bg-gray-800 border-0',
              formButtonPrimary: 'bg-black text-white hover:bg-gray-800',
              footerActionLink: 'text-black hover:text-gray-800'
            }
          }}
          signInUrl="/login"
        />
      </CardContent>
      <CardFooter>
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-black font-medium hover:underline">
            Sign in
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}

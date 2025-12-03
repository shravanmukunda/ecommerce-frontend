"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SignIn } from '@clerk/nextjs'

export function Login() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignIn 
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
          signUpUrl="/signup"
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-black font-medium hover:underline">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
"use client"

import { useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Brain, Mail, Lock, Chrome } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      toast({
        title: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({ title: "Account created successfully!" })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast({ title: "Signed in successfully!" })
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast({ title: "Signed in with Google successfully!" })
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Vidya AI</h1>
          <p className="text-gray-600 mt-2">Your AI-powered learning companion</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to access your personalized AI tutor</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={() => handleEmailAuth(false)} className="w-full" disabled={loading}>
                  Sign In
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={() => handleEmailAuth(true)} className="w-full" disabled={loading}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" onClick={handleGoogleAuth} className="w-full" disabled={loading}>
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

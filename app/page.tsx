"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import AuthPage from "@/components/auth-page"
import ChatInterface from "@/components/chat-interface"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return user ? <ChatInterface user={user} /> : <AuthPage />
}

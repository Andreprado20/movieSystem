"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { UserConnections } from "@/components/user-connections"
import { useAuth } from "@/contexts/auth-context"

export default function ConnectionsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userId] = useState(1) // This would come from the authenticated user

  useEffect(() => {
    if (!authLoading) {
      setLoading(false)
      if (!user) {
        router.push("/login")
      }
    }
  }, [user, authLoading, router])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Conexões</h1>
        <UserConnections userId={userId} isCurrentUser={true} />
      </div>
    </div>
  )
}

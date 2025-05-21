"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { ProfileSettings } from "@/components/profile-settings"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)

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
        <h1 className="text-3xl font-bold mb-8">Configurações da Conta</h1>
        <ProfileSettings />
      </div>
    </div>
  )
}

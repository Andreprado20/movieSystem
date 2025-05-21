"use client"

import { useState } from "react"
import Link from "next/link"
import { HelpCircle } from "lucide-react"
import Header from "@/components/header"
import { UserProfile } from "@/components/user-profile"
import { UserMovieLists } from "@/components/user-movie-lists"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const [userId] = useState(1) // This would come from the authenticated user

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Faça login para ver seu perfil</h1>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-16">
      <Header />

      {/* Profile Section */}
      <div className="pt-8 px-8 md:px-16">
        <UserProfile
          userId={userId}
          username={user.email?.split("@")[0] || "user"}
          displayName={user.displayName || user.email?.split("@")[0] || "User"}
          bio="Cinéfilo apaixonado | Crítico Amador | Colecionador de Filmes Clássicos"
          isCurrentUser={true}
        />
      </div>

      {/* Movie Lists Section */}
      <div className="mt-12 px-8 md:px-16">
        <UserMovieLists userId={userId} />
      </div>

      {/* FAQ Link at the bottom */}
      <div className="mt-16 text-center">
        <Link href="/faq" className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
          <HelpCircle className="h-5 w-5" />
          <span>Perguntas Frequentes</span>
        </Link>
      </div>
    </div>
  )
}

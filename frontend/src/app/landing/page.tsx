"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src="/placeholder.svg?height=48&width=48&text=🎬"
              alt="CineMatch Logo"
              width={48}
              height={48}
              className="rounded-full bg-blue-500"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">CineMatch</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white px-8" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200 px-8" asChild>
            <Link href="/register">Cadastrar</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl">
          Sua comunidade de cinéfilos
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl">
          Descubra, discuta e compartilhe sua paixão por filmes com pessoas que amam cinema tanto quanto você.
        </p>
        <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-md" asChild>
          <Link href="/register">
            Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </main>

      {/* Optional: Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 CineMatch. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

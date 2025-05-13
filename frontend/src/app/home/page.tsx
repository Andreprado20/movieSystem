"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Movie data for each section
  const recommendedMovies = [
    { id: 1, title: "Inception", image: "/placeholder.svg?height=300&width=200&text=Inception" },
    { id: 2, title: "The Dark Knight", image: "/placeholder.svg?height=300&width=200&text=The+Dark+Knight" },
    { id: 3, title: "Interstellar", image: "/placeholder.svg?height=300&width=200&text=Interstellar" },
    { id: 4, title: "Parasite", image: "/placeholder.svg?height=300&width=200&text=Parasite" },
    { id: 5, title: "Joker", image: "/placeholder.svg?height=300&width=200&text=Joker" },
  ]

  const communityMovies = [
    { id: 6, title: "The Godfather", image: "/placeholder.svg?height=300&width=200&text=The+Godfather" },
    { id: 7, title: "Pulp Fiction", image: "/placeholder.svg?height=300&width=200&text=Pulp+Fiction" },
    { id: 8, title: "Fight Club", image: "/placeholder.svg?height=300&width=200&text=Fight+Club" },
    { id: 9, title: "The Matrix", image: "/placeholder.svg?height=300&width=200&text=The+Matrix" },
    { id: 10, title: "Goodfellas", image: "/placeholder.svg?height=300&width=200&text=Goodfellas" },
  ]

  const topRatedMovies = [
    { id: 11, title: "The Shawshank Redemption", image: "/placeholder.svg?height=300&width=200&text=Shawshank" },
    { id: 12, title: "The Godfather", image: "/placeholder.svg?height=300&width=200&text=Godfather" },
    { id: 13, title: "The Dark Knight", image: "/placeholder.svg?height=300&width=200&text=Dark+Knight" },
    { id: 14, title: "12 Angry Men", image: "/placeholder.svg?height=300&width=200&text=12+Angry+Men" },
    { id: 15, title: "Schindler's List", image: "/placeholder.svg?height=300&width=200&text=Schindler" },
  ]

  const becauseYouWatchedMovies = [
    { id: 16, title: "Ready Player One", image: "/placeholder.svg?height=300&width=200&text=Ready+Player+One" },
    { id: 17, title: "Free Guy", image: "/placeholder.svg?height=300&width=200&text=Free+Guy" },
    { id: 18, title: "Sword Art Online", image: "/placeholder.svg?height=300&width=200&text=SAO" },
    { id: 19, title: "Tron: Legacy", image: "/placeholder.svg?height=300&width=200&text=Tron" },
    { id: 20, title: "The Matrix", image: "/placeholder.svg?height=300&width=200&text=Matrix" },
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("Sending request to AI service...")

      // Make a direct request to the Python microservice
      // This assumes the microservice is accessible from the client
      const aiServiceUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      const response = await fetch(`${aiServiceUrl}/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pergunta: searchQuery }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Received data:", data)
      setAiRecommendation(data.resposta)
    } catch (err) {
      console.error("Failed to fetch AI recommendations:", err)
      setError("Não foi possível obter recomendações no momento. Por favor, tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setAiRecommendation(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />

      {/* Hero Section with Search */}
      <section className="py-20 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-8">O que vamos assistir hoje?</h1>
        <form onSubmit={handleSearch} className="relative w-full max-w-xl">
          <Input
            type="text"
            placeholder="Digite o filme aqui"
            className="bg-gray-800/80 border-gray-700 rounded-full py-6 pl-6 pr-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
          {searchQuery && !isLoading && (
            <Button
              type="button"
              className="absolute right-12 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-400"
              size="icon"
              onClick={clearSearch}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <Button
            type={isLoading ? "button" : "submit"}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent text-gray-400"
            size="icon"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </section>

      {/* AI Recommendation Section */}
      {(isLoading || aiRecommendation || error) && (
        <section className="px-4 md:px-12 mb-12">
          <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold">Recomendações da IA</h2>
              <Button variant="ghost" size="sm" onClick={clearSearch} className="text-gray-400 hover:text-white">
                Fechar
              </Button>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}

            {error && !isLoading && <div className="text-red-400 py-4">{error}</div>}

            {aiRecommendation && !isLoading && !error && (
              <div className="overflow-auto">
                <MarkdownRenderer content={aiRecommendation} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Movie Sections */}
      <div className="px-4 md:px-12 pb-16 space-y-12">
        {/* Recommended Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Recomendados para você</h2>
            <Link href="/recomendados" className="text-sm text-gray-400 hover:text-white">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedMovies.map((movie) => (
              <div key={movie.id} className="cursor-pointer group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Suggestions Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Sugeridos pelas suas Comunidades</h2>
            <Link href="/comunidades-sugestoes" className="text-sm text-gray-400 hover:text-white">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {communityMovies.map((movie) => (
              <div key={movie.id} className="cursor-pointer group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Mais bem avaliados</h2>
            <Link href="/top-rated" className="text-sm text-gray-400 hover:text-white">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topRatedMovies.map((movie) => (
              <div key={movie.id} className="cursor-pointer group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Because You Watched Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Porque você assistiu "Autentic Games: Namorada Perfeita"</h2>
            <Link href="/because-you-watched" className="text-sm text-gray-400 hover:text-white">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {becauseYouWatchedMovies.map((movie) => (
              <div key={movie.id} className="cursor-pointer group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

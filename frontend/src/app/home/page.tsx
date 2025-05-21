"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { TextFormatter } from "@/components/text-formatter"
import { MovieRecommendations } from "@/components/movie-recommendations"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
              <div className="overflow-auto formatted-content">
                <TextFormatter content={aiRecommendation} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Movie Sections */}
      <div className="px-4 md:px-12 pb-16 space-y-12">
        {/* Personalized Recommendations */}
        <MovieRecommendations type="personalized" title="Recomendados para você" limit={5} />

        {/* Trending Movies */}
        <MovieRecommendations type="trending" title="Em alta esta semana" timeWindow="week" limit={5} />

        {/* New Releases */}
        <MovieRecommendations type="new-releases" title="Lançamentos" limit={5} />

        {/* Genre Recommendations - Action */}
        <MovieRecommendations type="genre" genreId={28} title="Filmes de Ação" limit={5} />

        {/* Genre Recommendations - Comedy */}
        <MovieRecommendations type="genre" genreId={35} title="Comédias" limit={5} />
      </div>
    </div>
  )
}

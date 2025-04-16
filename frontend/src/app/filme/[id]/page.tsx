"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Clock, Star, Heart, Share2, Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Header from "@/components/header"

// Define types based on the Prisma schema
interface Filme {
  id: number
  titulo: string
  sinopse?: string
  diretor?: string
  elenco: string[]
  genero: string[]
  avaliacaoMedia: number
  avaliacoes?: Avaliacao[]
}

interface Avaliacao {
  id: number
  nota: number
  comentario?: string
  curtidas: number
  perfil: {
    id: number
    nome: string
    tipo: string
  }
}

export default function MoviePage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatchLater, setIsWatchLater] = useState(false)
  const [movie, setMovie] = useState<Filme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        // Fetch movie data from the NestJS API
        const response = await fetch(`http://localhost:3000/filmes/${id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch movie: ${response.statusText}`)
        }

        const data = await response.json()
        setMovie(data)
      } catch (err) {
        console.error("Error fetching movie:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch movie data")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMovie()
    }
  }, [id])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // In a real app, you would make an API call to update the user's favorites
  }

  const toggleWatchLater = () => {
    setIsWatchLater(!isWatchLater)
    // In a real app, you would make an API call to update the user's watch later list
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Carregando filme...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-xl text-red-500">Erro ao carregar o filme</p>
          <p className="text-gray-400">{error || "Filme não encontrado"}</p>
          <Button onClick={() => router.push("/home")}>Voltar para Home</Button>
        </div>
      </div>
    )
  }

  // Generate a placeholder image URL if no poster is available
  const posterUrl = `/placeholder.svg?height=400&width=270&text=${encodeURIComponent(movie.titulo)}`

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto pb-16">
        {/* Movie Header */}
        <div className="pt-8 px-4 md:px-8 lg:px-16">
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="relative w-full md:w-64 aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mx-auto md:mx-0 max-w-xs">
              <Image src={posterUrl || "/placeholder.svg"} alt={movie.titulo} fill className="object-cover" />
            </div>

            {/* Movie Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{movie.titulo}</h1>
              <p className="text-lg md:text-xl text-gray-400 mb-4">
                {/* Display available metadata */}
                {movie.avaliacaoMedia > 0 && (
                  <span className="flex items-center gap-1 inline-block mr-2">
                    <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                    {movie.avaliacaoMedia.toFixed(1)}
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genero.map((genre) => (
                  <span key={genre} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border-gray-700"
                  onClick={toggleWatchLater}
                >
                  <Clock className={`h-4 w-4 ${isWatchLater ? "text-blue-500" : ""}`} />
                  Assistir depois
                </Button>

                <Button variant="outline" className="flex items-center gap-2 rounded-full border-gray-700">
                  <Star className="h-4 w-4" />
                  Avaliar
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border-gray-700"
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "text-red-500 fill-red-500" : ""}`} />
                  Favoritos
                </Button>
              </div>

              <p className="text-gray-300 mb-6">{movie.sinopse || "Sinopse não disponível"}</p>

              {movie.diretor && (
                <div className="mb-2">
                  <strong>Direção:</strong> {movie.diretor}
                </div>
              )}

              {movie.elenco && movie.elenco.length > 0 && (
                <div className="mb-6">
                  <strong>Elenco:</strong> {movie.elenco.join(", ")}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2 border-gray-700">
                  <Star className="h-4 w-4" />
                  Assistir Trailer
                </Button>

                <Button variant="outline" className="flex items-center gap-2 border-gray-700">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>

                <Button variant="outline" className="flex items-center gap-2 border-gray-700">
                  <Calendar className="h-4 w-4" />
                  Agendar Sessão
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl font-bold mb-6">Comentários</h2>
          {movie.avaliacoes && movie.avaliacoes.length > 0 ? (
            <div className="space-y-4">
              {movie.avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-gray-600">{avaliacao.perfil.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-lg mb-2">{avaliacao.comentario || "Sem comentário"}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <span>{avaliacao.curtidas}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 10v12" />
                              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                            </svg>
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 14V2" />
                              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-6 text-center">
              <p className="text-gray-400">Nenhum comentário disponível para este filme.</p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Seja o primeiro a comentar</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

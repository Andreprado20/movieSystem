"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Star, Share2, Calendar, Settings, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { TextFormatter } from "@/components/text-formatter"
import MovieForum from "@/components/forum/movie-forum"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieListActions } from "@/components/movie-list-actions"
import { recommendationService } from "@/lib/recommendation-service"
import { MovieReviews } from "@/components/movie-reviews"
import { getImageUrl } from "@/lib/tmdb"

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
  poster_path?: string
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

interface SimilarMovie {
  id: number
  title: string
  posterPath: string
  overview: string
  releaseDate: string
  voteAverage: number
  similarityScore: number
}

// Interface for the Movie type that might be returned from the API
interface Movie {
  id: number
  title: string
  posterPath?: string
  overview?: string
  releaseDate?: string
  voteAverage?: number
  similarityScore?: number
}

export default function MoviePage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const movieId = Number.parseInt(id as string, 10)

  const [movie, setMovie] = useState<Filme | null>(null)
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [similarLoading, setSimilarLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("info")

  // New states for AI summary
  const [reviewSummary, setReviewSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        // Fetch movie data from the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/movies/${id}`)

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

  // Fetch similar movies
  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!movieId) return

      try {
        setSimilarLoading(true)
        const data = await recommendationService.getSimilarMovies(movieId)

        // Transform the data to ensure it matches the SimilarMovie interface
        const transformedData: SimilarMovie[] = data.map((movie: Movie) => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.posterPath || "",
          overview: movie.overview || "",
          releaseDate: movie.releaseDate || "",
          voteAverage: movie.voteAverage || 0,
          similarityScore: movie.similarityScore || 0, // Provide a default value if undefined
        }))

        setSimilarMovies(transformedData)
      } catch (err) {
        console.error("Error fetching similar movies:", err)
      } finally {
        setSimilarLoading(false)
      }
    }

    fetchSimilarMovies()
  }, [movieId])

  // New effect to fetch AI summary when movie data is loaded
  useEffect(() => {
    const fetchReviewSummary = async () => {
      if (!movie || !movie.id) return

      try {
        setSummaryLoading(true)
        setSummaryError(null)

        // Get the AI service URL from environment variables
        const aiServiceUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

        console.log(`Fetching review summary for movie ID: ${movie.id}`)

        const response = await fetch(`${aiServiceUrl}/resumo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filme_id: movie.id }),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Review summary response:", data)

        if (data.resumo) {
          setReviewSummary(data.resumo)
        } else {
          setSummaryError("Não foi possível gerar um resumo das avaliações")
        }
      } catch (err) {
        console.error("Error fetching review summary:", err)
        setSummaryError("Erro ao carregar o resumo das avaliações")
      } finally {
        setSummaryLoading(false)
      }
    }

    if (movie && movie.id) {
      fetchReviewSummary()
    }
  }, [movie])

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

  // Use the TMDB image URL format
  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path)
    : `/placeholder.svg?height=400&width=270&text=${encodeURIComponent(movie.titulo)}`

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

              {/* Movie List Actions */}
              <MovieListActions movieId={movieId} />

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

        {/* Tabs for different sections */}
        <div className="mt-12 px-4 md:px-8 lg:px-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-900 p-1 rounded-lg mb-8 w-full max-w-xl">
              <TabsTrigger value="info" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                Informações
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                Avaliações
              </TabsTrigger>
              <TabsTrigger value="forum" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                Fórum
              </TabsTrigger>
              <TabsTrigger value="similar" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                Similares
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              {/* AI Review Summary Section */}
              {(reviewSummary || summaryLoading || summaryError) && (
                <div className="mb-8">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      <h2 className="text-xl font-bold">O que os usuários estão dizendo</h2>
                    </div>

                    {summaryLoading && (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                      </div>
                    )}

                    {summaryError && <div className="text-red-400 py-4">{summaryError}</div>}

                    {reviewSummary && !summaryLoading && (
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <TextFormatter content={reviewSummary} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional movie information could go here */}
              <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Detalhes Técnicos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-300">Diretor</h3>
                    <p>{movie.diretor || "Não disponível"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-300">Gêneros</h3>
                    <p>{movie.genero.join(", ") || "Não disponível"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-300">Elenco Principal</h3>
                    <p>{movie.elenco.join(", ") || "Não disponível"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-300">Avaliação</h3>
                    <p>{movie.avaliacaoMedia.toFixed(1)} / 5.0</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <MovieReviews movieId={movieId} movieTitle={movie.titulo} />
            </TabsContent>

            <TabsContent value="forum">
              {/* Forum Component */}
              <MovieForum movieId={movieId} movieTitle={movie.titulo} />
            </TabsContent>

            <TabsContent value="similar">
              {/* Similar Movies */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Filmes Similares</h2>

                {similarLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : similarMovies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {similarMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="cursor-pointer group"
                        onClick={() => router.push(`/filme/${movie.id}`)}
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                          <Image
                            src={getImageUrl(movie.posterPath) || "/placeholder.svg"}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
                        <div className="flex items-center text-xs text-gray-400">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                          {movie.voteAverage.toFixed(1)}
                          <span className="mx-1">•</span>
                          <span>Similaridade: {Math.round(movie.similarityScore * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                    <p className="text-gray-400">Nenhum filme similar encontrado.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

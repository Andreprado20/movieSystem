"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { movieListService } from "@/lib/movie-list-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Heart, Clock } from "lucide-react"

interface Movie {
  id: number
  titulo: string
  sinopse?: string
  genero: string[]
  avaliacaoMedia: number
  poster_path?: string
}

interface UserMovieListsProps {
  userId: number
  profileId?: number
}

export function UserMovieLists({ userId, profileId }: UserMovieListsProps) {
  const [activeTab, setActiveTab] = useState("watched")
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const [watchLaterMovies, setWatchLaterMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState({
    watched: true,
    favorites: true,
    watchLater: true,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieLists = async () => {
      try {
        setError(null)

        // Fetch watched movies
        setLoading((prev) => ({ ...prev, watched: true }))
        const watchedData = await movieListService.getMoviesInList("watched", profileId)
        setWatchedMovies(watchedData)
        setLoading((prev) => ({ ...prev, watched: false }))

        // Fetch favorite movies
        setLoading((prev) => ({ ...prev, favorites: true }))
        const favoritesData = await movieListService.getMoviesInList("favorites", profileId)
        setFavoriteMovies(favoritesData)
        setLoading((prev) => ({ ...prev, favorites: false }))

        // Fetch watch later movies
        setLoading((prev) => ({ ...prev, watchLater: true }))
        const watchLaterData = await movieListService.getMoviesInList("watch_later", profileId)
        setWatchLaterMovies(watchLaterData)
        setLoading((prev) => ({ ...prev, watchLater: false }))
      } catch (err) {
        console.error("Error fetching movie lists:", err)
        setError("Failed to load movie lists")
      }
    }

    fetchMovieLists()
  }, [profileId])

  const renderMovieGrid = (movies: Movie[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (movies.length === 0) {
      return (
        <div className="bg-gray-800/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">Nenhum filme encontrado nesta lista.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/filme/${movie.id}`} className="cursor-pointer group">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={
                  movie.poster_path ||
                  `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(movie.titulo) || "/placeholder.svg"}`
                }
                alt={movie.titulo}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium truncate">{movie.titulo}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {movie.genero.slice(0, 2).map((genre) => (
                <span key={genre} className="text-xs text-gray-400">
                  {genre}
                  {movie.genero.indexOf(genre) < Math.min(1, movie.genero.length - 1) && ","}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div>
      {error && <div className="bg-red-900/20 text-red-300 p-4 rounded-md mb-6">{error}</div>}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-900 p-1 rounded-lg mb-8 w-full max-w-xl">
          <TabsTrigger value="watched" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
            <Eye className="h-4 w-4" />
            <span>Assistidos</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
            <Heart className="h-4 w-4" />
            <span>Favoritos</span>
          </TabsTrigger>
          <TabsTrigger value="watchLater" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
            <Clock className="h-4 w-4" />
            <span>Assistir depois</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watched">
          <h2 className="text-2xl font-bold mb-6">Filmes Assistidos</h2>
          {renderMovieGrid(watchedMovies, loading.watched)}
        </TabsContent>

        <TabsContent value="favorites">
          <h2 className="text-2xl font-bold mb-6">Filmes Favoritos</h2>
          {renderMovieGrid(favoriteMovies, loading.favorites)}
        </TabsContent>

        <TabsContent value="watchLater">
          <h2 className="text-2xl font-bold mb-6">Filmes para Assistir Depois</h2>
          {renderMovieGrid(watchLaterMovies, loading.watchLater)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

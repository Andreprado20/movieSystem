"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { movieService, type Movie } from "@/lib/movie-service"
import { getImageUrl } from "@/lib/tmdb"

interface MovieBrowserProps {
  initialGenre?: string
  initialPage?: number
}

export function MovieBrowser({ initialGenre, initialPage = 1 }: MovieBrowserProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState(initialGenre || "")

  const genres = [
    "Ação",
    "Aventura",
    "Animação",
    "Comédia",
    "Crime",
    "Documentário",
    "Drama",
    "Família",
    "Fantasia",
    "História",
    "Terror",
    "Música",
    "Mistério",
    "Romance",
    "Ficção Científica",
    "Thriller",
    "Guerra",
    "Faroeste",
  ]

  useEffect(() => {
    fetchMovies()
  }, [page, selectedGenre])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await movieService.listMovies(page, 12)

      // Filter by genre if selected
      let filteredMovies = result.movies
      if (selectedGenre) {
        filteredMovies = result.movies.filter((movie) => movie.genero.includes(selectedGenre))
      }

      setMovies(filteredMovies)
      setTotalPages(Math.ceil(result.total / result.limit))
    } catch (err) {
      console.error("Error fetching movies:", err)
      setError("Falha ao carregar os filmes. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API endpoint for search
    // For now, we'll just filter the existing movies
    if (searchQuery.trim()) {
      const filtered = movies.filter((movie) => movie.titulo.toLowerCase().includes(searchQuery.toLowerCase()))
      setMovies(filtered)
    } else {
      fetchMovies()
    }
  }

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? "" : genre)
    setPage(1)
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Input
            type="text"
            placeholder="Buscar filmes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 pr-10"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-gray-400">
            <Search className="h-5 w-5" />
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-gray-400">Filtrar por:</span>
          <select
            value={selectedGenre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md p-2"
          >
            <option value="">Todos os gêneros</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex flex-wrap gap-2">
        {genres.slice(0, 10).map((genre) => (
          <Button
            key={genre}
            variant="outline"
            size="sm"
            className={`rounded-full ${
              selectedGenre === genre
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-800 text-gray-300 border-gray-700"
            }`}
            onClick={() => handleGenreChange(genre)}
          >
            {genre}
          </Button>
        ))}
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-900/20 text-red-300 p-4 rounded-md">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-800 aspect-[2/3] rounded-lg"></div>
              <div className="h-4 bg-gray-800 rounded mt-2 w-3/4"></div>
              <div className="h-3 bg-gray-800 rounded mt-1 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Movies Grid */}
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <Link key={movie.id} href={`/filme/${movie.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={
                        movie.poster_path
                          ? getImageUrl(movie.poster_path)
                          : `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(movie.titulo)}`
                      }
                      alt={movie.titulo}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 font-medium truncate">{movie.titulo}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                    {movie.avaliacaoMedia.toFixed(1)}
                    <span className="mx-1">•</span>
                    <span>{movie.genero.slice(0, 2).join(", ")}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
              <p className="text-gray-400">Nenhum filme encontrado</p>
            </div>
          )}

          {/* Pagination */}
          {movies.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button variant="outline" onClick={handlePreviousPage} disabled={page === 1} className="border-gray-700">
                Anterior
              </Button>
              <span className="text-gray-400">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="border-gray-700"
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

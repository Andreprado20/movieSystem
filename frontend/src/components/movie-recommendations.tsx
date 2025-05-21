"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { recommendationService } from "@/lib/recommendation-service"
import { getImageUrl } from "@/lib/tmdb"

interface Movie {
  id: number
  title: string
  posterPath: string
  overview: string
  releaseDate: string
  voteAverage: number
  matchScore?: number
  trendingScore?: number
  genreScore?: number
  popularity?: number
}

interface MovieRecommendationsProps {
  type: "personalized" | "trending" | "new-releases" | "genre"
  genreId?: number
  timeWindow?: string
  title: string
  limit?: number
}

export function MovieRecommendations({
  type,
  genreId,
  timeWindow = "week",
  title,
  limit = 5,
}: MovieRecommendationsProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        setError(null)

        let data: Movie[] = []

        switch (type) {
          case "personalized":
            data = await recommendationService.getPersonalizedRecommendations(1, limit)
            break
          case "trending":
            data = await recommendationService.getTrendingMovies(timeWindow, 1, limit)
            break
          case "new-releases":
            data = await recommendationService.getNewReleases(1, limit)
            break
          case "genre":
            if (!genreId) {
              throw new Error("Genre ID is required for genre recommendations")
            }
            data = await recommendationService.getGenreRecommendations(genreId, 1, limit)
            break
        }

        setMovies(data)
      } catch (err) {
        console.error(`Error fetching ${type} recommendations:`, err)
        setError(`Failed to load ${type} recommendations`)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [type, genreId, timeWindow, limit])

  if (loading) {
    return (
      <div className="py-4">
        <h2 className="text-xl md:text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-800 aspect-[2/3] rounded-lg"></div>
              <div className="h-4 bg-gray-800 rounded mt-2 w-3/4"></div>
              <div className="h-3 bg-gray-800 rounded mt-1 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-4">
        <h2 className="text-xl md:text-2xl font-bold mb-6">{title}</h2>
        <div className="bg-red-900/20 text-red-300 p-4 rounded-md">{error}</div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="py-4">
        <h2 className="text-xl md:text-2xl font-bold mb-6">{title}</h2>
        <div className="bg-gray-800/50 p-6 rounded-lg text-center">
          <p className="text-gray-400">Nenhum filme encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <Link href={`/${type}`} className="text-sm text-gray-400 hover:text-white">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/filme/${movie.id}`} className="cursor-pointer group">
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
              {movie.matchScore && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-green-500">{Math.round(movie.matchScore * 100)}% match</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

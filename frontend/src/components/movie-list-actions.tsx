"use client"

import { useState, useEffect } from "react"
import { Heart, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { movieListService, type MovieListStatus } from "@/lib/movie-list-service"
import { useAuth } from "@/contexts/auth-context"

interface MovieListActionsProps {
  movieId: number
  profileId?: number
  onStatusChange?: (status: MovieListStatus) => void
}

export function MovieListActions({ movieId, profileId, onStatusChange }: MovieListActionsProps) {
  const { user } = useAuth()
  const [status, setStatus] = useState<MovieListStatus>({
    filme_id: movieId,
    is_favorite: false,
    is_watched: false,
    is_watch_later: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieStatus = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)
        const movieStatus = await movieListService.getMovieStatus(movieId, profileId)
        setStatus(movieStatus)
        if (onStatusChange) {
          onStatusChange(movieStatus)
        }
      } catch (err) {
        console.error("Error fetching movie status:", err)
        setError("Failed to load movie status")
      } finally {
        setLoading(false)
      }
    }

    fetchMovieStatus()
  }, [movieId, profileId, user, onStatusChange])

  const toggleFavorite = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      if (status.is_favorite) {
        await movieListService.removeFromList("favorites", movieId, profileId)
      } else {
        await movieListService.addToFavorites(movieId, profileId)
      }

      // Update status
      const newStatus = { ...status, is_favorite: !status.is_favorite }
      setStatus(newStatus)
      if (onStatusChange) {
        onStatusChange(newStatus)
      }
    } catch (err) {
      console.error("Error toggling favorite:", err)
      setError("Failed to update favorite status")
    } finally {
      setLoading(false)
    }
  }

  const toggleWatched = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      if (status.is_watched) {
        await movieListService.removeFromList("watched", movieId, profileId)
      } else {
        await movieListService.addToWatched(movieId, profileId)
      }

      // Update status - adding to watched removes from watch later
      const newStatus = {
        ...status,
        is_watched: !status.is_watched,
        is_watch_later: status.is_watch_later && !status.is_watched ? false : status.is_watch_later,
      }
      setStatus(newStatus)
      if (onStatusChange) {
        onStatusChange(newStatus)
      }
    } catch (err) {
      console.error("Error toggling watched:", err)
      setError("Failed to update watched status")
    } finally {
      setLoading(false)
    }
  }

  const toggleWatchLater = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Can't add to watch later if already watched
      if (status.is_watched) {
        setError("Não é possível adicionar à lista 'assistir depois' um filme já assistido")
        setLoading(false)
        return
      }

      if (status.is_watch_later) {
        await movieListService.removeFromList("watch_later", movieId, profileId)
      } else {
        await movieListService.addToWatchLater(movieId, profileId)
      }

      // Update status
      const newStatus = { ...status, is_watch_later: !status.is_watch_later }
      setStatus(newStatus)
      if (onStatusChange) {
        onStatusChange(newStatus)
      }
    } catch (err) {
      console.error("Error toggling watch later:", err)
      setError("Failed to update watch later status")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {error && <div className="w-full text-red-500 text-sm">{error}</div>}

      <Button
        variant="outline"
        className={`flex items-center gap-2 rounded-full border-gray-700 ${loading ? "opacity-50" : ""}`}
        onClick={toggleWatchLater}
        disabled={loading || status.is_watched}
      >
        <Clock className={`h-4 w-4 ${status.is_watch_later ? "text-blue-500" : ""}`} />
        {status.is_watch_later ? "Na lista" : "Assistir depois"}
      </Button>

      <Button
        variant="outline"
        className={`flex items-center gap-2 rounded-full border-gray-700 ${loading ? "opacity-50" : ""}`}
        onClick={toggleWatched}
        disabled={loading}
      >
        <Check className={`h-4 w-4 ${status.is_watched ? "text-green-500" : ""}`} />
        {status.is_watched ? "Assistido" : "Marcar como assistido"}
      </Button>

      <Button
        variant="outline"
        className={`flex items-center gap-2 rounded-full border-gray-700 ${loading ? "opacity-50" : ""}`}
        onClick={toggleFavorite}
        disabled={loading}
      >
        <Heart className={`h-4 w-4 ${status.is_favorite ? "text-red-500 fill-red-500" : ""}`} />
        {status.is_favorite ? "Favoritado" : "Favoritar"}
      </Button>
    </div>
  )
}

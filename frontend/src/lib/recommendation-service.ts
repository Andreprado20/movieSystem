import { fetchAPI } from "@/lib/api"

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
  similarityScore?: number
}

export const recommendationService = {
  async getPersonalizedRecommendations(page = 1, limit = 10): Promise<Movie[]> {
    try {
      const response = await fetchAPI(`/api/v1/recommendations/personalized?page=${page}&limit=${limit}`)
      return response || []
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error)
      // Return mock data for development
      return Array.from({ length: limit }, (_, i) => ({
        id: i + 1,
        title: `Filme Recomendado ${i + 1}`,
        posterPath: `/placeholder.svg?height=300&width=200&text=Recomendado+${i + 1}`,
        overview: `Descrição do filme recomendado ${i + 1}`,
        releaseDate: "2023-01-01",
        voteAverage: 4 + Math.random(),
        matchScore: 0.7 + Math.random() * 0.3,
      }))
    }
  },

  async getSimilarMovies(movieId: number, limit = 6): Promise<Movie[]> {
    try {
      const response = await fetchAPI(`/api/v1/recommendations/similar/${movieId}?limit=${limit}`)
      return response || []
    } catch (error) {
      console.error("Error fetching similar movies:", error)
      // Return mock data for development
      return Array.from({ length: limit }, (_, i) => ({
        id: movieId + i + 100,
        title: `Filme Similar ${i + 1}`,
        posterPath: `/placeholder.svg?height=300&width=200&text=Similar+${i + 1}`,
        overview: `Descrição do filme similar ${i + 1}`,
        releaseDate: "2023-01-01",
        voteAverage: 4 + Math.random(),
        similarityScore: 0.7 + Math.random() * 0.3,
      }))
    }
  },

  async getTrendingMovies(timeWindow = "week", page = 1, limit = 10): Promise<Movie[]> {
    try {
      const response = await fetchAPI(
        `/api/v1/recommendations/trending?time_window=${timeWindow}&page=${page}&limit=${limit}`,
      )
      return response || []
    } catch (error) {
      console.error("Error fetching trending movies:", error)
      // Return mock data for development
      return Array.from({ length: limit }, (_, i) => ({
        id: i + 200,
        title: `Filme em Alta ${i + 1}`,
        posterPath: `/placeholder.svg?height=300&width=200&text=Trending+${i + 1}`,
        overview: `Descrição do filme em alta ${i + 1}`,
        releaseDate: "2023-01-01",
        voteAverage: 4 + Math.random(),
        trendingScore: 0.7 + Math.random() * 0.3,
      }))
    }
  },

  async getNewReleases(page = 1, limit = 10): Promise<Movie[]> {
    try {
      const response = await fetchAPI(`/api/v1/recommendations/new-releases?page=${page}&limit=${limit}`)
      return response || []
    } catch (error) {
      console.error("Error fetching new releases:", error)
      // Return mock data for development
      return Array.from({ length: limit }, (_, i) => ({
        id: i + 300,
        title: `Lançamento ${i + 1}`,
        posterPath: `/placeholder.svg?height=300&width=200&text=New+${i + 1}`,
        overview: `Descrição do lançamento ${i + 1}`,
        releaseDate: "2023-01-01",
        voteAverage: 4 + Math.random(),
        popularity: 0.7 + Math.random() * 0.3,
      }))
    }
  },

  async getGenreRecommendations(genreId: number, page = 1, limit = 10): Promise<Movie[]> {
    try {
      const response = await fetchAPI(`/api/v1/recommendations/genre/${genreId}?page=${page}&limit=${limit}`)
      return response || []
    } catch (error) {
      console.error("Error fetching genre recommendations:", error)
      // Return mock data for development
      return Array.from({ length: limit }, (_, i) => ({
        id: i + 400,
        title: `Filme de Gênero ${i + 1}`,
        posterPath: `/placeholder.svg?height=300&width=200&text=Genre+${i + 1}`,
        overview: `Descrição do filme de gênero ${i + 1}`,
        releaseDate: "2023-01-01",
        voteAverage: 4 + Math.random(),
        genreScore: 0.7 + Math.random() * 0.3,
      }))
    }
  },
}

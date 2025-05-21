import { fetchAPI } from "@/lib/api"

export interface Movie {
  id: number
  titulo: string
  sinopse?: string
  diretor?: string
  elenco: string[]
  genero: string[]
  avaliacaoMedia: number
  poster_path?: string
}

export interface MovieListResponse {
  movies: Movie[]
  total: number
  page: number
  limit: number
}

export const movieService = {
  async getMovie(id: number): Promise<Movie> {
    try {
      return await fetchAPI(`/v1/movies/${id}`)
    } catch (error) {
      console.error("Error fetching movie:", error)
      throw error
    }
  },

  async listMovies(page = 1, limit = 10): Promise<MovieListResponse> {
    try {
      const response = await fetchAPI(`/v1/movies?page=${page}&limit=${limit}`)
      return {
        movies: response.results || [],
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || limit,
      }
    } catch (error) {
      console.error("Error listing movies:", error)
      // Return mock data for development
      return {
        movies: Array.from({ length: limit }, (_, i) => ({
          id: i + 1,
          titulo: `Filme ${i + 1}`,
          sinopse: `Descrição do filme ${i + 1}`,
          diretor: `Diretor ${i + 1}`,
          elenco: [`Ator 1`, `Ator 2`, `Ator 3`],
          genero: ["Ação", "Drama"],
          avaliacaoMedia: Math.random() * 5,
          poster_path: `/placeholder.svg?height=300&width=200&text=Filme+${i + 1}`,
        })),
        total: 100,
        page,
        limit,
      }
    }
  },

  async searchMovies(query: string, page = 1, limit = 10): Promise<MovieListResponse> {
    try {
      const response = await fetchAPI(
        `/v1/movies/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      )
      return {
        movies: response.results || [],
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || limit,
      }
    } catch (error) {
      console.error("Error searching movies:", error)
      throw error
    }
  },

  async getMoviesByGenre(genre: string, page = 1, limit = 10): Promise<MovieListResponse> {
    try {
      const response = await fetchAPI(`/v1/movies/genre/${encodeURIComponent(genre)}?page=${page}&limit=${limit}`)
      return {
        movies: response.results || [],
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || limit,
      }
    } catch (error) {
      console.error("Error fetching movies by genre:", error)
      throw error
    }
  },
}

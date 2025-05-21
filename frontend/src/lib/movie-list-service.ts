import { fetchAPI } from "@/lib/api"

interface MovieList {
  id: number
  name: string
  description?: string
  isPublic: boolean
  userId: number
  createdAt: string
  updatedAt: string
  movieCount: number
}

interface MovieInList {
  id: number
  title: string
  posterPath: string
  voteAverage: number
  releaseDate: string
  addedAt: string
}

export const movieListService = {
  async getUserLists(userId: number): Promise<MovieList[]> {
    try {
      const response = await fetchAPI(`/api/v1/users/${userId}/lists`)
      return response || []
    } catch (error) {
      console.error("Error fetching user lists:", error)
      // Return mock data for development
      return [
        {
          id: 1,
          name: "Favoritos",
          description: "Meus filmes favoritos",
          isPublic: true,
          userId: userId,
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
          movieCount: 12,
        },
        {
          id: 2,
          name: "Assistir Depois",
          description: "Filmes para assistir no futuro",
          isPublic: true,
          userId: userId,
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
          movieCount: 8,
        },
        {
          id: 3,
          name: "Clássicos",
          description: "Filmes clássicos que amo",
          isPublic: false,
          userId: userId,
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
          movieCount: 5,
        },
      ]
    }
  },

  async getListMovies(listId: number): Promise<MovieInList[]> {
    try {
      const response = await fetchAPI(`/api/v1/lists/${listId}/movies`)
      return response || []
    } catch (error) {
      console.error("Error fetching list movies:", error)
      // Return mock data for development
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Filme ${i + 1} da Lista`,
        posterPath: `/placeholder.svg?height=300&width=200&text=Filme+${i + 1}`,
        voteAverage: 4 + Math.random(),
        releaseDate: "2023-01-01",
        addedAt: "2023-01-01T00:00:00Z",
      }))
    }
  },

  async createList(name: string, description = "", isPublic = true): Promise<MovieList> {
    try {
      const response = await fetchAPI(`/api/v1/lists`, {
        method: "POST",
        body: JSON.stringify({ name, description, isPublic }),
      })
      return response
    } catch (error) {
      console.error("Error creating list:", error)
      throw error
    }
  },

  async addMovieToList(listId: number, movieId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetchAPI(`/api/v1/lists/${listId}/movies`, {
        method: "POST",
        body: JSON.stringify({ movieId }),
      })
      return { success: true, message: "Filme adicionado à lista com sucesso" }
    } catch (error) {
      console.error("Error adding movie to list:", error)
      throw error
    }
  },

  async removeMovieFromList(listId: number, movieId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetchAPI(`/api/v1/lists/${listId}/movies/${movieId}`, {
        method: "DELETE",
      })
      return { success: true, message: "Filme removido da lista com sucesso" }
    } catch (error) {
      console.error("Error removing movie from list:", error)
      throw error
    }
  },

  async isMovieInList(listId: number, movieId: number): Promise<boolean> {
    try {
      const movies = await this.getListMovies(listId)
      return movies.some((movie) => movie.id === movieId)
    } catch (error) {
      console.error("Error checking if movie is in list:", error)
      return false
    }
  },

  async isMovieInAnyList(
    userId: number,
    movieId: number,
  ): Promise<{ inList: boolean; listId?: number; listName?: string }> {
    try {
      const lists = await this.getUserLists(userId)

      for (const list of lists) {
        const isInList = await this.isMovieInList(list.id, movieId)
        if (isInList) {
          return { inList: true, listId: list.id, listName: list.name }
        }
      }

      return { inList: false }
    } catch (error) {
      console.error("Error checking if movie is in any list:", error)
      return { inList: false }
    }
  },
}

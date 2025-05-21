import { fetchAPI } from "@/lib/api"

interface User {
  id: number
  name: string
  username: string
  email: string
  bio?: string
  avatar?: string
  followersCount: number
  followingCount: number
  createdAt: string
}

interface UserStats {
  moviesWatched: number
  reviewsWritten: number
  listsCreated: number
  averageRating: number
}

export const userService = {
  async getUserProfile(userId: number): Promise<User> {
    try {
      const response = await fetchAPI(`/api/v1/profile/${userId}`)
      return response
    } catch (error) {
      console.error("Error fetching user profile:", error)
      // Return mock data for development
      return {
        id: userId,
        name: `Usuário ${userId}`,
        username: `usuario${userId}`,
        email: `usuario${userId}@example.com`,
        bio: "Esta é uma bio de exemplo para o usuário.",
        avatar: `/placeholder.svg?height=100&width=100&text=U${userId}`,
        followersCount: 120,
        followingCount: 45,
        createdAt: "2023-01-01T00:00:00Z",
      }
    }
  },

  async getUserStats(userId: number): Promise<UserStats> {
    try {
      const response = await fetchAPI(`/api/v1/profile/${userId}/stats`)
      return response
    } catch (error) {
      console.error("Error fetching user stats:", error)
      // Return mock data for development
      return {
        moviesWatched: 42,
        reviewsWritten: 15,
        listsCreated: 8,
        averageRating: 4.2,
      }
    }
  },

  async updateUserProfile(userId: number, data: Partial<User>): Promise<User> {
    try {
      const response = await fetchAPI(`/api/v1/profile/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      return response
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  },

  async searchUsers(query: string, page = 1, limit = 10): Promise<User[]> {
    try {
      const response = await fetchAPI(
        `/api/v1/search/users?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      )
      return response.results || []
    } catch (error) {
      console.error("Error searching users:", error)
      // Return mock data for development
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `${query} Usuário ${i + 1}`,
        username: `${query.toLowerCase()}${i + 1}`,
        email: `${query.toLowerCase()}${i + 1}@example.com`,
        bio: `Esta é uma bio de exemplo para o usuário ${query} ${i + 1}.`,
        avatar: `/placeholder.svg?height=40&width=40&text=${query.charAt(0)}${i + 1}`,
        followersCount: Math.floor(Math.random() * 100),
        followingCount: Math.floor(Math.random() * 50),
        createdAt: "2023-01-01T00:00:00Z",
      }))
    }
  },
}

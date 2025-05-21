import { fetchAPI } from "@/lib/api"

interface User {
  id: number
  name: string
  username: string
  avatar?: string
  bio?: string
  followersCount: number
  followingCount: number
}

export const socialService = {
  async getUserFollowers(userId: number, page = 1, limit = 20): Promise<User[]> {
    try {
      const response = await fetchAPI(`/api/v1/social/users/${userId}/followers?page=${page}&limit=${limit}`)
      return response || []
    } catch (error) {
      console.error("Error fetching user followers:", error)
      // Return mock data for development
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Seguidor ${i + 1}`,
        username: `seguidor${i + 1}`,
        avatar: `/placeholder.svg?height=40&width=40&text=S${i + 1}`,
        bio: `Bio do seguidor ${i + 1}`,
        followersCount: Math.floor(Math.random() * 100),
        followingCount: Math.floor(Math.random() * 100),
      }))
    }
  },

  async getUserFollowing(userId: number, page = 1, limit = 20): Promise<User[]> {
    try {
      const response = await fetchAPI(`/api/v1/social/users/${userId}/following?page=${page}&limit=${limit}`)
      return response || []
    } catch (error) {
      console.error("Error fetching user following:", error)
      // Return mock data for development
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 10,
        name: `Seguindo ${i + 1}`,
        username: `seguindo${i + 1}`,
        avatar: `/placeholder.svg?height=40&width=40&text=S${i + 1}`,
        bio: `Bio de quem o usuário segue ${i + 1}`,
        followersCount: Math.floor(Math.random() * 100),
        followingCount: Math.floor(Math.random() * 100),
      }))
    }
  },

  async followUser(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetchAPI(`/api/v1/social/users/${userId}/follow`, {
        method: "POST",
      })
      return { success: true, message: "Usuário seguido com sucesso" }
    } catch (error) {
      console.error("Error following user:", error)
      throw error
    }
  },

  async unfollowUser(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetchAPI(`/api/v1/social/users/${userId}/follow`, {
        method: "DELETE",
      })
      return { success: true, message: "Deixou de seguir o usuário com sucesso" }
    } catch (error) {
      console.error("Error unfollowing user:", error)
      throw error
    }
  },

  async isFollowing(userId: number, targetUserId: number): Promise<boolean> {
    try {
      const following = await this.getUserFollowing(userId)
      return following.some((user) => user.id === targetUserId)
    } catch (error) {
      console.error("Error checking if following:", error)
      return false
    }
  },
}

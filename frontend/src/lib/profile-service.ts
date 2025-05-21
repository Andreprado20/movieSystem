/**
 * Service for user profile operations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ProfileUpdate {
  name?: string
  username?: string
  bio?: string
  email?: string
}

export interface PasswordChange {
  currentPassword: string
  newPassword: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  movieRecommendations: boolean
  socialNotifications: boolean
}

export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private"
  showWatchedMovies: boolean
  showFavorites: boolean
  showWatchLater: boolean
}

export interface AppPreferences {
  language: string
  theme: string
  timezone: string
}

export interface UserStats {
  moviesWatched: number
  reviewsWritten: number
  followers: number
  following: number
  listsCreated: number
}

export const profileService = {
  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to fetch current profile:", error)
      throw error
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: ProfileUpdate): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to update profile:", error)
      throw error
    }
  },

  /**
   * Change user password
   */
  async changePassword(passwordData: PasswordChange): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to change password:", error)
      throw error
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to delete account:", error)
      throw error
    }
  },

  /**
   * Update profile picture
   */
  async updateAvatar(file: File): Promise<{ message: string; avatarUrl: string }> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_URL}/api/v1/profile/me/avatar`, {
        method: "PUT",
        // Add authorization header if needed
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to update avatar:", error)
      throw error
    }
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: number): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch user profile ${userId}:`, error)
      throw error
    }
  },

  /**
   * Get user profile by username
   */
  async getUserByUsername(username: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/username/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch user profile for username ${username}:`, error)
      throw error
    }
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: number): Promise<UserStats> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/${userId}/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch user stats for user ${userId}:`, error)
      throw error
    }
  },

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/me/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to update notification settings:", error)
      throw error
    }
  },

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(settings: PrivacySettings): Promise<PrivacySettings> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/me/settings/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to update privacy settings:", error)
      throw error
    }
  },

  /**
   * Update app preferences
   */
  async updateAppPreferences(preferences: AppPreferences): Promise<AppPreferences> {
    try {
      const response = await fetch(`${API_URL}/api/v1/profile/me/settings/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to update app preferences:", error)
      throw error
    }
  },
}

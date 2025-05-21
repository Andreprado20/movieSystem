// Base URL for the AI comments service
const AI_COMMENTS_BASE_URL = "https://movie-system-ia-comentario.vercel.app/"

// Interface for AI-generated comment
export interface AIComment {
  id?: string
  movieId: number
  content: string
  sentiment: "positive" | "negative" | "neutral"
  keywords: string[]
  createdAt?: string
}

// Interface for AI comment request
export interface AICommentRequest {
  movieId: number
  movieTitle: string
  movieOverview: string
  genre?: string[]
}

/**
 * Service for interacting with the AI comments API
 */
export const aiCommentsService = {
  /**
   * Generate an AI comment for a movie
   */
  async generateComment(request: AICommentRequest): Promise<AIComment> {
    try {
      const response = await fetch(`${AI_COMMENTS_BASE_URL}/api/generate-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Error generating AI comment: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to generate AI comment:", error)
      throw error
    }
  },

  /**
   * Get AI comments for a movie
   */
  async getCommentsForMovie(movieId: number): Promise<AIComment[]> {
    try {
      const response = await fetch(`${AI_COMMENTS_BASE_URL}/api/comments/${movieId}`)

      if (!response.ok) {
        throw new Error(`Error fetching AI comments: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch AI comments for movie ${movieId}:`, error)
      throw error
    }
  },

  /**
   * Get sentiment analysis for a user comment
   */
  async analyzeSentiment(text: string): Promise<{ sentiment: string; score: number }> {
    try {
      const response = await fetch(`${AI_COMMENTS_BASE_URL}/api/analyze-sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Error analyzing sentiment: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Failed to analyze sentiment:", error)
      throw error
    }
  },

  /**
   * Get keyword extraction for a text
   */
  async extractKeywords(text: string): Promise<string[]> {
    try {
      const response = await fetch(`${AI_COMMENTS_BASE_URL}/api/extract-keywords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Error extracting keywords: ${response.status}`)
      }

      const data = await response.json()
      return data.keywords
    } catch (error) {
      console.error("Failed to extract keywords:", error)
      throw error
    }
  },
}

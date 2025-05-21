// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Generic fetch function
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

// API functions
export async function getMovies(page = 1) {
  return fetchAPI(`/api/v1/movies?page=${page}`)
}

export async function getMovie(id: string) {
  return fetchAPI(`/api/v1/movies/${id}`)
}

export async function getMovieRecommendations(id: string) {
  return fetchAPI(`/api/v1/movies/${id}/recommendations`)
}

export async function getCommunities(page = 1) {
  return fetchAPI(`/api/v1/communities?page=${page}`)
}

export async function getCommunity(id: string) {
  return fetchAPI(`/api/v1/communities/${id}`)
}

export async function getForumComments(movieId: string) {
  return fetchAPI(`/api/v1/forum/filme/${movieId}/comments`)
}

export async function createForumComment(movieId: string, content: string) {
  return fetchAPI(`/api/v1/forum/filme/${movieId}/comments`, {
    method: "POST",
    body: JSON.stringify({ mensagem: content }),
  })
}

// User profile functions
export async function getUserProfile(userId: string) {
  return fetchAPI(`/api/v1/profile/${userId}`)
}

export async function updateUserProfile(userId: string, data: any) {
  return fetchAPI(`/api/v1/profile/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function getUserMovieLists(userId: string) {
  return fetchAPI(`/api/v1/users/${userId}/lists`)
}

// Movie list functions
export async function getMovieList(listId: string) {
  return fetchAPI(`/api/v1/lists/${listId}`)
}

export async function createMovieList(name: string, description: string, isPublic = true) {
  return fetchAPI(`/api/v1/lists`, {
    method: "POST",
    body: JSON.stringify({ name, description, isPublic }),
  })
}

export async function addMovieToList(listId: string, movieId: string) {
  return fetchAPI(`/api/v1/lists/${listId}/movies`, {
    method: "POST",
    body: JSON.stringify({ movieId }),
  })
}

export async function removeMovieFromList(listId: string, movieId: string) {
  return fetchAPI(`/api/v1/lists/${listId}/movies/${movieId}`, {
    method: "DELETE",
  })
}

// Social functions
export async function followUser(userId: string) {
  return fetchAPI(`/api/v1/social/users/${userId}/follow`, {
    method: "POST",
  })
}

export async function unfollowUser(userId: string) {
  return fetchAPI(`/api/v1/social/users/${userId}/follow`, {
    method: "DELETE",
  })
}

export async function getUserFollowers(userId: string, page = 1) {
  return fetchAPI(`/api/v1/social/users/${userId}/followers?page=${page}`)
}

export async function getUserFollowing(userId: string, page = 1) {
  return fetchAPI(`/api/v1/social/users/${userId}/following?page=${page}`)
}

// Review functions
export async function getMovieReviews(movieId: string, page = 1) {
  return fetchAPI(`/api/v1/movies/${movieId}/reviews?page=${page}`)
}

export async function createMovieReview(movieId: string, rating: number, content: string) {
  return fetchAPI(`/api/v1/movies/${movieId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, content }),
  })
}

export async function updateMovieReview(reviewId: string, rating: number, content: string) {
  return fetchAPI(`/api/v1/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({ rating, content }),
  })
}

export async function deleteMovieReview(reviewId: string) {
  return fetchAPI(`/api/v1/reviews/${reviewId}`, {
    method: "DELETE",
  })
}

// Comment functions
export async function getReviewComments(reviewId: string, page = 1) {
  return fetchAPI(`/api/v1/reviews/${reviewId}/comments?page=${page}`)
}

export async function createReviewComment(reviewId: string, content: string) {
  return fetchAPI(`/api/v1/reviews/${reviewId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
}

// Search functions
export async function searchMovies(query: string, page = 1) {
  return fetchAPI(`/api/v1/search/movies?query=${encodeURIComponent(query)}&page=${page}`)
}

export async function searchUsers(query: string, page = 1) {
  return fetchAPI(`/api/v1/search/users?query=${encodeURIComponent(query)}&page=${page}`)
}

// Notification functions
export async function getNotifications(page = 1) {
  return fetchAPI(`/api/v1/notifications?page=${page}`)
}

export async function markNotificationAsRead(notificationId: string) {
  return fetchAPI(`/api/v1/notifications/${notificationId}/read`, {
    method: "PUT",
  })
}

// AI functions
export async function getAIMovieRecommendations(prompt: string) {
  return fetchAPI(`/api/v1/ai/recommendations`, {
    method: "POST",
    body: JSON.stringify({ prompt }),
  })
}

export async function getAIMovieAnalysis(movieId: string) {
  return fetchAPI(`/api/v1/ai/analysis/${movieId}`)
}

// Mock functions for development
export function getMockMovies() {
  return Promise.resolve({
    results: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Movie ${i + 1}`,
      poster_path: `/placeholder.svg?height=300&width=200&text=Movie+${i + 1}`,
      overview: `This is a description for Movie ${i + 1}`,
      release_date: "2023-01-01",
      vote_average: Math.floor(Math.random() * 10) + 1,
    })),
    total_pages: 10,
    page: 1,
  })
}

export function getMockMovie(id: string) {
  return Promise.resolve({
    id: Number.parseInt(id),
    title: `Movie ${id}`,
    poster_path: `/placeholder.svg?height=500&width=300&text=Movie+${id}`,
    backdrop_path: `/placeholder.svg?height=800&width=1200&text=Movie+${id}+Backdrop`,
    overview: `This is a detailed description for Movie ${id}. It's a great movie with an interesting plot and amazing characters.`,
    release_date: "2023-01-01",
    vote_average: Math.floor(Math.random() * 10) + 1,
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Drama" },
    ],
    runtime: 120,
  })
}

// Export the fetchAPI function for custom requests
export { fetchAPI }

// import type { User, Movie, Review, Conversation, Message, Event, Community } from "@/lib/types"

// // Base API URL - should be set in environment variables
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// // Helper function to handle API responses
// async function handleResponse<T>(response: Response): Promise<T> {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}))
//     throw new Error(error.message || `API error: ${response.status}`)
//   }
//   return response.json()
// }

// // Helper function to get auth headers
// function getAuthHeaders() {
//   // In a real app, you would get the token from localStorage or a state management solution
//   const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
//   return token ? { Authorization: `Bearer ${token}` } : {}
// }

// // Authentication API
// export const authApi = {
//   login: async (email: string, password: string) => {
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     })
//     const data = await handleResponse<{ user: User; token: string }>(response)
//     // Store token in localStorage
//     localStorage.setItem("auth_token", data.token)
//     return data
//   },

//   register: async (userData: {
//     name: string
//     username: string
//     email: string
//     password: string
//     birthDate: string
//   }) => {
//     const response = await fetch(`${API_BASE_URL}/auth/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//     })
//     return handleResponse<{ user: User; token: string }>(response)
//   },

//   logout: async () => {
//     localStorage.removeItem("auth_token")
//     await fetch(`${API_BASE_URL}/auth/logout`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//     })
//   },
// }

// // User API
// export const userApi = {
//   getCurrentUser: async () => {
//     const response = await fetch(`${API_BASE_URL}/users/me`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<User>(response)
//   },

//   getUserById: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/${id}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<User>(response)
//   },

//   getUserStats: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/${id}/stats`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<any>(response)
//   },

//   updateProfile: async (userData: Partial<User>) => {
//     const response = await fetch(`${API_BASE_URL}/users/me`, {
//       method: "PUT",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     })
//     return handleResponse<User>(response)
//   },

//   updateAvatar: async (formData: FormData) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
//       method: "PUT",
//       headers: getAuthHeaders(),
//       body: formData,
//     })
//     return handleResponse<{ avatarUrl: string }>(response)
//   },

//   updatePassword: async (currentPassword: string, newPassword: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/password`, {
//       method: "PUT",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ currentPassword, newPassword }),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   updateSettings: async (settingType: string, settings: any) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/settings/${settingType}`, {
//       method: "PUT",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(settings),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   followUser: async (userId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   unfollowUser: async (userId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   getFollowers: async (userId: string, page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/users/${userId}/followers?page=${page}&limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ followers: User[]; total: number }>(response)
//   },

//   getFollowing: async (userId: string, page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/users/${userId}/following?page=${page}&limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ following: User[]; total: number }>(response)
//   },

//   getUserMovies: async (userId: string, type: "watched" | "favorites" | "watchlater", page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/users/${userId}/movies/${type}?page=${page}&limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ movies: Movie[]; total: number }>(response)
//   },

//   getUserReviews: async (userId: string, page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/users/${userId}/reviews?page=${page}&limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ reviews: Review[]; total: number }>(response)
//   },
// }

// // Movie API
// export const movieApi = {
//   getMovies: async (params: { page?: number; limit?: number; sort?: string; genre?: string } = {}) => {
//     const queryParams = new URLSearchParams()
//     if (params.page) queryParams.append("page", params.page.toString())
//     if (params.limit) queryParams.append("limit", params.limit.toString())
//     if (params.sort) queryParams.append("sort", params.sort)
//     if (params.genre) queryParams.append("genre", params.genre)

//     const response = await fetch(`${API_BASE_URL}/filmes?${queryParams.toString()}`)
//     return handleResponse<{ movies: Movie[]; total: number }>(response)
//   },

//   getMovieById: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/filmes/${id}`)
//     return handleResponse<Movie>(response)
//   },

//   getMovieReviews: async (id: string, page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/filmes/${id}/reviews?page=${page}&limit=${limit}`)
//     return handleResponse<{ reviews: Review[]; total: number }>(response)
//   },

//   getSimilarMovies: async (id: string, limit = 10) => {
//     const response = await fetch(`${API_BASE_URL}/filmes/${id}/similar?limit=${limit}`)
//     return handleResponse<{ movies: Movie[] }>(response)
//   },

//   getGenres: async () => {
//     const response = await fetch(`${API_BASE_URL}/filmes/genres`)
//     return handleResponse<{ genres: string[] }>(response)
//   },

//   getTrendingMovies: async (timeWindow: "day" | "week" = "week") => {
//     const response = await fetch(`${API_BASE_URL}/filmes/trending?timeWindow=${timeWindow}`)
//     return handleResponse<{ movies: Movie[] }>(response)
//   },

//   getRecommendations: async (limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/filmes/recommendations?limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ movies: Movie[] }>(response)
//   },

//   // User movie actions
//   markAsWatched: async (movieId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/movies/watched`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ movieId }),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   removeFromWatched: async (movieId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/movies/watched/${movieId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   addToFavorites: async (movieId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/movies/favorites`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ movieId }),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   removeFromFavorites: async (movieId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/movies/favorites/${movieId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   addToWatchLater: async (movieId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/movies/watchlater`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ movieId }),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   removeFromWatchLater: async (movieId: string) => {
//     const response = await fetch(`${API_BASE_URL}/users/me/movies/watchlater/${movieId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   // Reviews
//   createReview: async (movieId: string, review: { rating: number; content?: string }) => {
//     const response = await fetch(`${API_BASE_URL}/filmes/${movieId}/reviews`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(review),
//     })
//     return handleResponse<Review>(response)
//   },

//   updateReview: async (movieId: string, reviewId: string, review: { rating: number; content?: string }) => {
//     const response = await fetch(`${API_BASE_URL}/filmes/${movieId}/reviews/${reviewId}`, {
//       method: "PUT",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(review),
//     })
//     return handleResponse<Review>(response)
//   },

//   deleteReview: async (movieId: string, reviewId: string) => {
//     const response = await fetch(`${API_BASE_URL}/filmes/${movieId}/reviews/${reviewId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   likeReview: async (reviewId: string) => {
//     const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/likes`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ likes: number }>(response)
//   },

//   unlikeReview: async (reviewId: string) => {
//     const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/likes`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ likes: number }>(response)
//   },
// }

// // Chat API
// export const chatApi = {
//   getConversations: async (page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/conversations?page=${page}&limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ conversations: Conversation[]; total: number }>(response)
//   },

//   getConversation: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<Conversation>(response)
//   },

//   createConversation: async (data: { participants: string[]; name?: string; isGroup: boolean }) => {
//     const response = await fetch(`${API_BASE_URL}/conversations`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//     return handleResponse<Conversation>(response)
//   },

//   getMessages: async (conversationId: string, page = 1, limit = 50, before?: string) => {
//     let url = `${API_BASE_URL}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
//     if (before) url += `&before=${before}`

//     const response = await fetch(url, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ messages: Message[]; total: number }>(response)
//   },

//   sendMessage: async (conversationId: string, content: string) => {
//     const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content }),
//     })
//     return handleResponse<Message>(response)
//   },

//   markAsRead: async (conversationId: string, messageId: string) => {
//     const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/${messageId}/read`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },
// }

// // Events API
// export const eventApi = {
//   getEvents: async (params: { month?: number; year?: number; page?: number; limit?: number } = {}) => {
//     const queryParams = new URLSearchParams()
//     if (params.month) queryParams.append("month", params.month.toString())
//     if (params.year) queryParams.append("year", params.year.toString())
//     if (params.page) queryParams.append("page", params.page.toString())
//     if (params.limit) queryParams.append("limit", params.limit.toString())

//     const response = await fetch(`${API_BASE_URL}/events?${queryParams.toString()}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ events: Event[]; total: number }>(response)
//   },

//   getEvent: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/events/${id}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<Event>(response)
//   },

//   createEvent: async (eventData: {
//     title: string
//     date: string
//     time: string
//     type: string
//     movieId?: string
//     description?: string
//   }) => {
//     const response = await fetch(`${API_BASE_URL}/events`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(eventData),
//     })
//     return handleResponse<Event>(response)
//   },

//   updateEvent: async (
//     id: string,
//     eventData: {
//       title?: string
//       date?: string
//       time?: string
//       type?: string
//       description?: string
//     },
//   ) => {
//     const response = await fetch(`${API_BASE_URL}/events/${id}`, {
//       method: "PUT",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(eventData),
//     })
//     return handleResponse<Event>(response)
//   },

//   deleteEvent: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/events/${id}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   joinEvent: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/events/${id}/participants`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   leaveEvent: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/events/${id}/participants/${id}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   getUpcomingEvents: async (limit = 10) => {
//     const response = await fetch(`${API_BASE_URL}/events/upcoming?limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ events: Event[] }>(response)
//   },
// }

// // Communities API
// export const communityApi = {
//   getCommunities: async (page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/communities?page=${page}&limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ communities: Community[]; total: number }>(response)
//   },

//   getCommunity: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<Community>(response)
//   },

//   createCommunity: async (data: { name: string; description?: string; isPrivate: boolean }) => {
//     const response = await fetch(`${API_BASE_URL}/communities`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//     return handleResponse<Community>(response)
//   },

//   joinCommunity: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/communities/${id}/members`, {
//       method: "POST",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   leaveCommunity: async (id: string) => {
//     const response = await fetch(`${API_BASE_URL}/communities/${id}/members/${id}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ message: string }>(response)
//   },

//   getCommunityMovies: async (id: string, page = 1, limit = 20) => {
//     const response = await fetch(`${API_BASE_URL}/communities/${id}/movies?page=${page}&limit=${limit}`, {
//       headers: getAuthHeaders(),
//     })
//     return handleResponse<{ movies: Movie[]; total: number }>(response)
//   },
// }

// // Search API
// export const searchApi = {
//   searchMovies: async (query: string, page = 1, limit = 20) => {
//     const response = await fetch(
//       `${API_BASE_URL}/search/movies?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
//     )
//     return handleResponse<{ movies: Movie[]; total: number }>(response)
//   },

//   searchUsers: async (query: string, page = 1, limit = 20) => {
//     const response = await fetch(
//       `${API_BASE_URL}/search/users?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
//     )
//     return handleResponse<{ users: User[]; total: number }>(response)
//   },

//   searchAll: async (query: string, page = 1, limit = 20) => {
//     const response = await fetch(
//       `${API_BASE_URL}/search/all?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
//     )
//     return handleResponse<{ movies: Movie[]; users: User[]; communities: Community[] }>(response)
//   },
// }

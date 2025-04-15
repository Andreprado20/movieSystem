export interface Movie {
    id: string
    title: string
    year: number
    rating: number
    posterUrl: string
    genres?: string[]
  }
  
  export interface Review {
    id: string
    movie: Movie
    rating: number
    content: string
    date: string
  }
  
  export interface UserStats {
    watched: number
    reviews: number
    lists: number
    followers: number
    following: number
  }
  
  export interface User {
    id: string
    name: string
    username: string
    email: string
    bio: string
    avatar: string | null
    stats: UserStats
    movies: {
      watched: Movie[]
      favorites: Movie[]
      watchLater: Movie[]
    }
    reviews: Review[]
  }
  
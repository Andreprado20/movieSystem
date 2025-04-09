"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, Heart, Clock, Star, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import MovieCard from "@/components/movie-card"

interface Movie {
  id: string
  title: string
  year: number
  rating: number
  posterUrl: string
  genres: string[]
}

interface UserProfile {
  username: string
  displayName: string
  bio: string
  stats: {
    watched: number
    reviews: number
    lists: number
    followers: number
    following: number
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("assistidos")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const [watchLaterMovies, setWatchLaterMovies] = useState<Movie[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:3000/api/profile');
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch watched movies
        const watchedResponse = await fetch('http://localhost:3000/api/profile/watched');
        const watchedData = await watchedResponse.json();
        setWatchedMovies(watchedData);

        // Fetch favorite movies
        const favoritesResponse = await fetch('http://localhost:3000/api/profile/favorites');
        const favoritesData = await favoritesResponse.json();
        setFavoriteMovies(favoritesData);

        // Fetch watch later movies
        const watchLaterResponse = await fetch('http://localhost:3000/api/profile/watchlater');
        const watchLaterData = await watchLaterResponse.json();
        setWatchLaterMovies(watchLaterData);

        // Fetch reviews
        const reviewsResponse = await fetch('http://localhost:3000/api/profile/reviews');
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-16">
      {/* Profile Header */}
      <div className="pt-8 px-8 md:px-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="relative w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <span className="text-xl text-gray-400">Foto</span>
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="w-full flex flex-col md:flex-row md:justify-between">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">{profile?.displayName}</h1>
                <span className="text-gray-400">@{profile?.username}</span>
                <Button className="rounded-full px-6 bg-white text-black hover:bg-gray-200">Seguir</Button>
              </div>

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white self-center md:self-start">
                <Settings className="h-6 w-6" />
              </Button>
            </div>

            <p className="text-gray-300 mb-6 text-center md:text-left">
              {profile?.bio}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-center">
              <div className="flex flex-col">
                <span className="text-xl font-bold">{profile?.stats.watched}</span>
                <span className="text-sm text-gray-400">Assistidos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">{profile?.stats.reviews}</span>
                <span className="text-sm text-gray-400">Críticas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">{profile?.stats.lists}</span>
                <span className="text-sm text-gray-400">Listas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">{profile?.stats.followers}</span>
                <span className="text-sm text-gray-400">Seguidores</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">{profile?.stats.following}</span>
                <span className="text-sm text-gray-400">Seguindo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mt-12 px-8 md:px-16">
        <Tabs defaultValue="assistidos" onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900 p-1 rounded-lg mb-8 w-full max-w-xl">
            <TabsTrigger value="assistidos" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
              <Eye className="h-4 w-4" />
              <span>Assistidos</span>
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
              <Heart className="h-4 w-4" />
              <span>Favoritos</span>
            </TabsTrigger>
            <TabsTrigger value="assistir-depois" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
              <Clock className="h-4 w-4" />
              <span>Assistir depois</span>
            </TabsTrigger>
            <TabsTrigger value="criticas" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
              <Star className="h-4 w-4" />
              <span>Críticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistidos">
            <h2 className="text-2xl font-bold mb-6">Assistidos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  posterUrl={movie.posterUrl}
                  genres={movie.genres}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favoritos">
            <h2 className="text-2xl font-bold mb-6">Favoritos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favoriteMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  posterUrl={movie.posterUrl}
                  genres={movie.genres}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assistir-depois">
            <h2 className="text-2xl font-bold mb-6">Assistir depois</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchLaterMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  posterUrl={movie.posterUrl}
                  genres={movie.genres}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="criticas">
            <h2 className="text-2xl font-bold mb-6">Críticas</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="relative w-16 h-24 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                      <Image
                        src={review.movie.posterUrl || "/placeholder.svg"}
                        alt={review.movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{review.movie.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "text-yellow-500" : "text-gray-600"}`}
                            fill={i < 4 ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* FAQ Link at the bottom */}
      <div className="mt-16 text-center">
        <Link href="/faq" className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
          <HelpCircle className="h-5 w-5" />
          <span>Perguntas Frequentes</span>
        </Link>
      </div>
    </div>
  )
}

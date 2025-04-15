"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Eye, Heart, Clock, Star, Settings, HelpCircle, UserPlus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import MovieCard from "@/components/movie-card"
import { getUserById } from "@/lib/mock-data"
import type { User } from "@/lib/types"
import Header from "@/components/header"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [activeTab, setActiveTab] = useState("assistidos")
  const [user, setUser] = useState<User | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the user data from an API
    // and check if this is the current user's profile
    const userData = getUserById(userId)
    setUser(userData)

    // For demo purposes, let's say user with ID "1" is the current user
    setIsOwnProfile(userId === "1")

    // For demo purposes, let's say we're following users with even IDs
    setIsFollowing(Number.parseInt(userId) % 2 === 0)
  }, [userId])

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
    // In a real app, you would make an API call to follow/unfollow the user
  }

  const handleMessage = () => {
    // In a real app, you would navigate to a chat with this user
    router.push(`/chat?conversation=user-${userId}`)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto pb-16">
        {/* Profile Header */}
        <div className="pt-8 px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
              ) : (
                <span className="text-xl text-gray-400">{user.name.charAt(0)}</span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 flex flex-col items-center md:items-start">
              <div className="w-full flex flex-col md:flex-row md:justify-between">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <span className="text-gray-400">@{user.username}</span>

                  {!isOwnProfile && (
                    <div className="flex gap-2">
                      <Button
                        className={`rounded-full px-6 ${
                          isFollowing
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                        onClick={handleFollowToggle}
                      >
                        {isFollowing ? (
                          <>Seguindo</>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Seguir
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="rounded-full border-gray-700" onClick={handleMessage}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {isOwnProfile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white self-center md:self-start"
                  >
                    <Settings className="h-6 w-6" />
                  </Button>
                )}
              </div>

              <p className="text-gray-300 mb-6 text-center md:text-left">{user.bio}</p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-center">
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{user.stats.watched}</span>
                  <span className="text-sm text-gray-400">Assistidos</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{user.stats.reviews}</span>
                  <span className="text-sm text-gray-400">Críticas</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{user.stats.lists}</span>
                  <span className="text-sm text-gray-400">Listas</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{user.stats.followers}</span>
                  <span className="text-sm text-gray-400">Seguidores</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">{user.stats.following}</span>
                  <span className="text-sm text-gray-400">Seguindo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-12 px-4 md:px-8 lg:px-16">
          <Tabs defaultValue="assistidos" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-900 p-1 rounded-lg mb-8 w-full max-w-xl overflow-x-auto flex md:inline-flex whitespace-nowrap">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {user.movies.watched.map((movie) => (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {user.movies.favorites.map((movie) => (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {user.movies.watchLater.map((movie) => (
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
                {user.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row gap-4">
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
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-600"}`}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-300">{review.content}</p>
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
    </div>
  )
}

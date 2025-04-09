"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, Heart, Clock, Star, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import MovieCard from "@/components/movie-card"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("assistidos")

  // Sample movie data
  const watchedMovies = [
    {
      id: "interstellar",
      title: "Interstellar",
      year: 2014,
      rating: 4.8,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Interstellar",
      genres: ["Ficção Científica", "Drama", "Aventura"],
    },
    {
      id: "movie-2",
      title: "The Dark Knight",
      year: 2008,
      rating: 4.9,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Dark+Knight",
      genres: ["Ação", "Drama", "Crime"],
    },
    {
      id: "movie-3",
      title: "Inception",
      year: 2010,
      rating: 4.7,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Inception",
      genres: ["Ficção Científica", "Ação", "Aventura"],
    },
    {
      id: "movie-4",
      title: "Pulp Fiction",
      year: 1994,
      rating: 4.8,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Pulp+Fiction",
      genres: ["Crime", "Drama"],
    },
    {
      id: "movie-5",
      title: "The Godfather",
      year: 1972,
      rating: 4.9,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Godfather",
      genres: ["Crime", "Drama"],
    },
    {
      id: "movie-6",
      title: "Fight Club",
      year: 1999,
      rating: 4.8,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Fight+Club",
      genres: ["Drama", "Thriller"],
    },
    {
      id: "movie-7",
      title: "The Matrix",
      year: 1999,
      rating: 4.7,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Matrix",
      genres: ["Ficção Científica", "Ação"],
    },
    {
      id: "movie-8",
      title: "Goodfellas",
      year: 1990,
      rating: 4.7,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Goodfellas",
      genres: ["Crime", "Drama", "Biografia"],
    },
    {
      id: "movie-9",
      title: "The Shawshank Redemption",
      year: 1994,
      rating: 4.9,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Shawshank",
      genres: ["Drama", "Crime"],
    },
    {
      id: "movie-10",
      title: "Parasite",
      year: 2019,
      rating: 4.6,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Parasite",
      genres: ["Thriller", "Drama", "Comédia"],
    },
    {
      id: "movie-11",
      title: "Joker",
      year: 2019,
      rating: 4.5,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Joker",
      genres: ["Crime", "Drama", "Thriller"],
    },
    {
      id: "movie-12",
      title: "Avengers: Endgame",
      year: 2019,
      rating: 4.7,
      posterUrl: "/placeholder.svg?height=300&width=200&text=Avengers",
      genres: ["Ação", "Aventura", "Ficção Científica"],
    },
  ]

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
                <h1 className="text-2xl font-bold">Nome</h1>
                <span className="text-gray-400">@Nome</span>
                <Button className="rounded-full px-6 bg-white text-black hover:bg-gray-200">Seguir</Button>
              </div>

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white self-center md:self-start">
                <Settings className="h-6 w-6" />
              </Button>
            </div>

            <p className="text-gray-300 mb-6 text-center md:text-left">
              Cinéfilo apaixonado | Crítico Amador | Colecionador de Filmes Clássicos
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-center">
              <div className="flex flex-col">
                <span className="text-xl font-bold">271</span>
                <span className="text-sm text-gray-400">Assistidos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">213</span>
                <span className="text-sm text-gray-400">Críticas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">13</span>
                <span className="text-sm text-gray-400">Listas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">10</span>
                <span className="text-sm text-gray-400">Seguidores</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">30</span>
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
              {watchedMovies.slice(0, 8).map((movie) => (
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
              {watchedMovies.slice(4, 10).map((movie) => (
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
              {watchedMovies.slice(0, 5).map((movie) => (
                <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="relative w-16 h-24 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                      <Image
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{movie.title}</h3>
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
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

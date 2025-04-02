"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Heart, Clock, Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("assistidos")

  // Sample movie data
  const watchedMovies = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Movie ${i + 1}`,
    image: `/placeholder.svg?height=300&width=200&text=Movie+${i + 1}`,
  }))

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-16">
      {/* Settings Button */}
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="pt-8 px-8 md:px-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="relative w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            <span className="text-xl text-gray-400">Foto</span>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">Nome</h1>
              <span className="text-gray-400">@Nome</span>
              <Button className="rounded-full px-6 bg-white text-black hover:bg-gray-200">Seguir</Button>
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {watchedMovies.map((movie) => (
                <div key={movie.id} className="cursor-pointer group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favoritos">
            <h2 className="text-2xl font-bold mb-6">Favoritos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {watchedMovies.slice(0, 8).map((movie) => (
                <div key={movie.id} className="cursor-pointer group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assistir-depois">
            <h2 className="text-2xl font-bold mb-6">Assistir depois</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {watchedMovies.slice(4, 10).map((movie) => (
                <div key={movie.id} className="cursor-pointer group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </div>
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
                      <Image src={movie.image || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
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
    </div>
  )
}


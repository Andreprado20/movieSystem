"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Clock, Star, Heart, Share2, Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"

// Mock data for Interstellar movie
const movieData = {
  id: "interstellar",
  title: "Interestelar",
  originalTitle: "Interstellar",
  year: 2014,
  runtime: "2h 49m",
  rating: 4.8,
  ratingCount: 1289,
  genres: ["Ficção Científica", "Drama", "Aventura"],
  synopsis:
    "As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie. Cooper é chamado para liderar o grupo e aceita a missão sabendo que pode nunca mais ver os filhos. Ao lado de Brand, Jenkins e Doyle, ele seguirá em busca de um novo lar.",
  director: "Christopher Nolan",
  cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Mackenzie Foy"],
  posterUrl: "/placeholder.svg?height=400&width=270&text=Interstellar",
  comments: [
    {
      id: 1,
      user: {
        name: "User1",
        avatar: "/placeholder.svg?height=40&width=40&text=U1",
      },
      text: "Filme muito legal porem muito longo",
      likes: 3467,
      dislikes: 20,
    },
    {
      id: 2,
      user: {
        name: "User2",
        avatar: "/placeholder.svg?height=40&width=40&text=U2",
      },
      text: "Obra de arte, simplesmente 10/10",
      likes: 5462,
      dislikes: 33,
    },
    {
      id: 3,
      user: {
        name: "User3",
        avatar: "/placeholder.svg?height=40&width=40&text=U3",
      },
      text: "SPOILER.....",
      likes: 2469,
      dislikes: 45,
    },
    {
      id: 4,
      user: {
        name: "User4",
        avatar: "/placeholder.svg?height=40&width=40&text=U4",
      },
      text: "Vou dar o nome da minha filha de Murphy, o que acham?",
      likes: 355,
      dislikes: 335,
    },
  ],
}

export default function MoviePage() {
  const params = useParams()
  const { id } = params
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatchLater, setIsWatchLater] = useState(false)

  // In a real app, you would fetch the movie data based on the ID
  // For now, we'll just use our mock data
  const movie = movieData

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const toggleWatchLater = () => {
    setIsWatchLater(!isWatchLater)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto pb-16">
        {/* Movie Header */}
        <div className="pt-8 px-4 md:px-8 lg:px-16">
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="relative w-full md:w-64 aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mx-auto md:mx-0 max-w-xs">
              <Image src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </div>

            {/* Movie Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{movie.title}</h1>
              <p className="text-lg md:text-xl text-gray-400 mb-4">
                {movie.originalTitle} - {movie.year} - {movie.runtime}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span key={genre} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border-gray-700"
                  onClick={toggleWatchLater}
                >
                  <Clock className={`h-4 w-4 ${isWatchLater ? "text-blue-500" : ""}`} />
                  Assistir depois
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border-gray-700"
                  onClick={toggleFavorite}
                >
                  <Star className="h-4 w-4" />
                  Avaliar
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border-gray-700"
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "text-red-500 fill-red-500" : ""}`} />
                  Favoritos
                </Button>
              </div>

              <p className="text-gray-300 mb-6">{movie.synopsis}</p>

              <div className="mb-2">
                <strong>Direção:</strong> {movie.director}
              </div>
              <div className="mb-6">
                <strong>Elenco:</strong> {movie.cast.join(", ")}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2 border-gray-700">
                  <Star className="h-4 w-4" />
                  Assistir Trailer
                </Button>

                <Button variant="outline" className="flex items-center gap-2 border-gray-700">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>

                <Button variant="outline" className="flex items-center gap-2 border-gray-700">
                  <Calendar className="h-4 w-4" />
                  Agendar Sessão
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl font-bold mb-6">Comentários</h2>
          <div className="space-y-4">
            {movie.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                    <AvatarFallback className="bg-gray-600">{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-lg mb-2">{comment.text}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>{comment.likes}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M7 10v12" />
                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                          </svg>
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{comment.dislikes}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 14V2" />
                            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

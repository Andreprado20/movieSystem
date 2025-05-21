"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Review {
  id: number
  rating: number
  content: string
  likes: number
  dislikes: number
  createdAt: string
  user: {
    id: number
    name: string
    avatar?: string
  }
}

interface MovieReviewsProps {
  movieId: number
  movieTitle: string
}

export function MovieReviews({ movieId, movieTitle }: MovieReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRating, setUserRating] = useState(0)
  const [reviewContent, setReviewContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, you would fetch from the API
        // For now, we'll use mock data
        const mockReviews: Review[] = [
          {
            id: 1,
            rating: 4.5,
            content: "Um filme incrível com atuações brilhantes e uma história envolvente.",
            likes: 24,
            dislikes: 2,
            createdAt: "2023-05-15T14:30:00Z",
            user: {
              id: 101,
              name: "Maria Silva",
              avatar: "/placeholder.svg?height=40&width=40&text=MS",
            },
          },
          {
            id: 2,
            rating: 3.0,
            content: "Bom filme, mas o final poderia ser melhor. A fotografia é excelente.",
            likes: 10,
            dislikes: 5,
            createdAt: "2023-05-10T09:15:00Z",
            user: {
              id: 102,
              name: "João Santos",
              avatar: "/placeholder.svg?height=40&width=40&text=JS",
            },
          },
        ]

        setReviews(mockReviews)
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setError("Falha ao carregar as avaliações. Por favor, tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [movieId])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userRating === 0) {
      alert("Por favor, selecione uma avaliação de 1 a 5 estrelas.")
      return
    }

    try {
      setSubmitting(true)

      // In a real app, you would submit to the API
      // For now, we'll just add to the local state
      const newReview: Review = {
        id: Date.now(),
        rating: userRating,
        content: reviewContent,
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
        user: {
          id: 999, // Current user ID would come from auth context
          name: "Você", // Current user name would come from auth context
          avatar: "/placeholder.svg?height=40&width=40&text=VC",
        },
      }

      setReviews([newReview, ...reviews])
      setUserRating(0)
      setReviewContent("")
    } catch (err) {
      console.error("Error submitting review:", err)
      alert("Falha ao enviar a avaliação. Por favor, tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Avaliações de {movieTitle}</h2>

      {/* Write a review */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Escreva sua avaliação</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block mb-2">Sua avaliação:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="text-2xl focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${userRating >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-content" className="block mb-2">
              Seu comentário:
            </label>
            <Textarea
              id="review-content"
              placeholder="Compartilhe seus pensamentos sobre o filme..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              className="bg-gray-700 border-gray-600 min-h-[120px]"
            />
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
            {submitting ? "Enviando..." : "Publicar Avaliação"}
          </Button>
        </form>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-900/20 text-red-300 p-4 rounded-md">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/6 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{review.user.name}</h4>
                          <p className="text-sm text-gray-400">{formatDate(review.createdAt)}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  review.rating >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
                                }`}
                              />
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-400">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <p className="my-4">{review.content}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-400">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{review.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-400">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{review.dislikes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 p-8 rounded-lg text-center">
              <p className="text-gray-400">Nenhuma avaliação disponível para este filme.</p>
              <p className="text-gray-400 mt-2">Seja o primeiro a avaliar!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

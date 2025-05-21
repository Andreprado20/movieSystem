"use client"

import { useState, useEffect } from "react"
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { aiCommentsService, type AIComment, type AICommentRequest } from "@/lib/ai-comments-service"

interface AICommentsProps {
  movieId: number
  movieTitle: string
  movieOverview: string
  genres?: string[]
}

export function AIComments({ movieId, movieTitle, movieOverview, genres }: AICommentsProps) {
  const [comments, setComments] = useState<AIComment[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [movieId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedComments = await aiCommentsService.getCommentsForMovie(movieId)
      setComments(fetchedComments)
    } catch (err) {
      console.error("Error fetching AI comments:", err)
      setError("Não foi possível carregar os comentários da IA. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const generateNewComment = async () => {
    try {
      setGenerating(true)
      setError(null)

      const request: AICommentRequest = {
        movieId,
        movieTitle,
        movieOverview,
        genre: genres,
      }

      const newComment = await aiCommentsService.generateComment(request)
      setComments((prev) => [newComment, ...prev])
    } catch (err) {
      console.error("Error generating AI comment:", err)
      setError("Não foi possível gerar um novo comentário. Tente novamente mais tarde.")
    } finally {
      setGenerating(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "negative":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
    }
  }

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "Positivo"
      case "negative":
        return "Negativo"
      default:
        return "Neutro"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Comentários da IA
        </h2>
        <Button
          onClick={generateNewComment}
          disabled={generating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {generating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Comentário
            </>
          )}
        </Button>
      </div>

      {error && <div className="p-4 bg-red-900/20 text-red-300 text-sm rounded-md">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <Skeleton className="h-4 w-24 bg-gray-700" />
                <Skeleton className="h-6 w-full bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-32 bg-gray-700" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Comentário da IA
                </CardDescription>
                <CardTitle className="text-lg">Análise de {movieTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{comment.content}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {comment.keywords.map((keyword, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-600">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Badge className={getSentimentColor(comment.sentiment)}>{getSentimentText(comment.sentiment)}</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Útil
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Não útil
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-400 mb-4">Nenhum comentário da IA disponível para este filme.</p>
            <p className="text-sm text-gray-500">
              Clique no botão "Gerar Comentário" para criar uma análise com inteligência artificial.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { forumApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Reply, Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Comment {
  id: number
  mensagem: string
  likes: number
  usuario_id: number
  forum_id: number
  perfil_id: number
  created_at: string
  updated_at: string | null
  respondendo_id: number | null
}

interface MovieForumProps {
  movieId: number
  movieTitle: string
}

export default function MovieForum({ movieId, movieTitle }: MovieForumProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const commentsData = await forumApi.getMovieComments(movieId)
        setComments(commentsData)
      } catch (error: any) {
        console.error("Error loading comments:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [movieId])

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return

    try {
      setIsSubmitting(true)
      setError(null)

      const commentData = {
        mensagem: newComment,
        respondendo_id: replyingTo,
      }

      const newCommentData = await forumApi.createMovieComment(movieId, commentData)

      setComments((prev) => [...prev, newCommentData])
      setNewComment("")
      setReplyingTo(null)
    } catch (error: any) {
      console.error("Error submitting comment:", error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    if (!user) return

    try {
      await forumApi.likeComment(commentId)

      // Update the comment in the local state
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
      )
    } catch (error: any) {
      console.error("Error liking comment:", error)
      setError(error.message)
    }
  }

  const handleUpdateComment = async () => {
    if (!editingComment || !editText.trim() || !user) return

    try {
      setIsSubmitting(true)
      setError(null)

      const updatedComment = await forumApi.updateComment(editingComment, editText)

      setComments((prev) => prev.map((comment) => (comment.id === editingComment ? updatedComment : comment)))

      setEditingComment(null)
      setEditText("")
    } catch (error: any) {
      console.error("Error updating comment:", error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!user) return

    try {
      setIsSubmitting(true)
      setError(null)

      await forumApi.deleteComment(commentId)

      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      setDeleteConfirm(null)
    } catch (error: any) {
      console.error("Error deleting comment:", error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditText(comment.mensagem)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditText("")
  }

  const startReplying = (commentId: number) => {
    setReplyingTo(commentId)
    setNewComment("")
  }

  const cancelReplying = () => {
    setReplyingTo(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Discussão: {movieTitle}</h2>

      {error && <div className="p-4 bg-red-900/20 text-red-300 text-sm rounded-md">{error}</div>}

      {/* New comment form */}
      {user && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-blue-600">
                {user.displayName?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              {replyingTo !== null && (
                <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                  <span className="text-sm text-gray-300">Respondendo a um comentário</span>
                  <Button variant="ghost" size="sm" onClick={cancelReplying}>
                    Cancelar
                  </Button>
                </div>
              )}
              <Textarea
                placeholder="Escreva seu comentário..."
                className="bg-gray-700 border-gray-600 min-h-[100px]"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? "Enviando..." : "Comentar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          {!user && <p className="text-sm text-gray-500">Faça login para participar da discussão.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-gray-600">
                    {comment.usuario_id.toString().substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Usuário {comment.usuario_id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleString()}
                        {comment.updated_at && " (editado)"}
                      </p>
                    </div>

                    {user && comment.usuario_id.toString() === user.uid && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(comment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(comment.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {comment.respondendo_id && (
                    <div className="bg-gray-700/50 p-2 rounded-md text-sm text-gray-300">
                      Resposta a outro comentário
                    </div>
                  )}

                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        className="bg-gray-700 border-gray-600"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={cancelEditing}>
                          Cancelar
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleUpdateComment}
                          disabled={isSubmitting || !editText.trim()}
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-200">{comment.mensagem}</p>
                  )}

                  <div className="flex gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-400 hover:text-white"
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={!user}
                    >
                      <Heart className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>

                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-gray-400 hover:text-white"
                        onClick={() => startReplying(comment.id)}
                      >
                        <Reply className="h-4 w-4" />
                        <span>Responder</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open: any) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteConfirm && handleDeleteComment(deleteConfirm)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

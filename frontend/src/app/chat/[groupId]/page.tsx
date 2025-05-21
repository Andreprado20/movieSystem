"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { chatApi } from "@/lib/chat-service"
import Header from "@/components/header"
import ChatInterface from "@/components/chat/chat-interface"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Users } from "lucide-react"
import Link from "next/link"

interface Group {
  id: string
  name: string
  description: string | null
  is_private: boolean
  created_by: string
  created_at: string
  members: string[]
}

export default function ChatGroupPage() {
  const params = useParams()
  const groupId = params.groupId as string

  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGroup = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const groupData = await chatApi.getGroup(groupId)
        setGroup(groupData)
      } catch (error: any) {
        console.error("Error loading group:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (groupId) {
      loadGroup()
    }
  }, [groupId])

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Group header */}
          <div className="p-4 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/chat">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </Link>

                {isLoading ? (
                  <div className="h-6 w-40 bg-gray-800 animate-pulse rounded"></div>
                ) : (
                  <h1 className="text-xl font-bold">{group?.name || "Grupo não encontrado"}</h1>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">{isLoading ? "..." : group?.members.length || 0} membros</span>
              </div>
            </div>

            {group?.description && <p className="text-sm text-gray-400 mt-1">{group.description}</p>}

            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
          </div>

          {/* Chat interface */}
          <div className="flex-1 overflow-hidden">
            {!isLoading && !error && groupId && <ChatInterface groupId={groupId} />}

            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-red-400 mb-4">{error}</p>
                <Link href="/chat">
                  <Button>Voltar para Grupos</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

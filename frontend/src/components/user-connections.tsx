"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { socialService } from "@/lib/social-service"
import { useAuth } from "@/contexts/auth-context"

interface UserConnectionsProps {
  userId: number
  isCurrentUser?: boolean
}

interface User {
  id: number
  name: string
  username: string
  avatarUrl?: string
}

export function UserConnections({ userId, isCurrentUser = false }: UserConnectionsProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers")
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState({
    followers: true,
    following: true,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFollowers()
    fetchFollowing()
  }, [userId])

  const fetchFollowers = async () => {
    try {
      setLoading((prev) => ({ ...prev, followers: true }))
      setError(null)

      const data = await socialService.getUserFollowers(userId)
      setFollowers(data)
    } catch (err) {
      console.error("Error fetching followers:", err)
      setError("Falha ao carregar seguidores. Por favor, tente novamente.")
    } finally {
      setLoading((prev) => ({ ...prev, followers: false }))
    }
  }

  const fetchFollowing = async () => {
    try {
      setLoading((prev) => ({ ...prev, following: true }))
      setError(null)

      const data = await socialService.getUserFollowing(userId)
      setFollowing(data)
    } catch (err) {
      console.error("Error fetching following:", err)
      setError("Falha ao carregar usuários seguidos. Por favor, tente novamente.")
    } finally {
      setLoading((prev) => ({ ...prev, following: false }))
    }
  }

  const handleFollow = async (targetUserId: number) => {
    if (!user) return

    try {
      await socialService.followUser(targetUserId)
      // Refresh followers list
      fetchFollowers()
    } catch (err) {
      console.error("Error following user:", err)
      setError("Falha ao seguir usuário. Por favor, tente novamente.")
    }
  }

  const handleUnfollow = async (targetUserId: number) => {
    if (!user) return

    try {
      await socialService.unfollowUser(targetUserId)
      // Refresh following list
      fetchFollowing()
    } catch (err) {
      console.error("Error unfollowing user:", err)
      setError("Falha ao deixar de seguir usuário. Por favor, tente novamente.")
    }
  }

  const renderUserList = (users: User[], type: "followers" | "following") => {
    if (loading[type]) {
      return (
        <div className="py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      )
    }

    if (users.length === 0) {
      return (
        <div className="bg-gray-800/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">
            {type === "followers" ? "Este usuário ainda não tem seguidores." : "Este usuário ainda não segue ninguém."}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-600">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/perfil/${user.id}`} className="font-medium hover:underline">
                  {user.name}
                </Link>
                <p className="text-sm text-gray-400">@{user.username}</p>
              </div>
            </div>
            {isCurrentUser && type === "followers" && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700"
                onClick={() => handleFollow(user.id)}
              >
                Seguir de volta
              </Button>
            )}
            {isCurrentUser && type === "following" && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700"
                onClick={() => handleUnfollow(user.id)}
              >
                Deixar de seguir
              </Button>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-900/20 text-red-300 p-4 rounded-md">{error}</div>}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "followers" | "following")}>
        <TabsList className="bg-gray-900 p-1 rounded-lg mb-6 w-full max-w-md">
          <TabsTrigger value="followers" className="flex-1 data-[state=active]:bg-gray-800">
            Seguidores ({followers.length})
          </TabsTrigger>
          <TabsTrigger value="following" className="flex-1 data-[state=active]:bg-gray-800">
            Seguindo ({following.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers">{renderUserList(followers, "followers")}</TabsContent>
        <TabsContent value="following">{renderUserList(following, "following")}</TabsContent>
      </Tabs>
    </div>
  )
}

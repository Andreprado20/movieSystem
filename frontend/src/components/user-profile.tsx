"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Settings, User, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { socialService } from "@/lib/social-service"
import { useAuth } from "@/contexts/auth-context"

interface UserProfileProps {
  userId: number
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  isCurrentUser?: boolean
}

export function UserProfile({
  userId,
  username,
  displayName,
  bio,
  avatarUrl,
  isCurrentUser = false,
}: UserProfileProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSocialData = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)

        // Fetch followers
        const followers = await socialService.getUserFollowers(userId)
        setFollowersCount(followers.length)

        // Fetch following
        const following = await socialService.getUserFollowing(userId)
        setFollowingCount(following.length)

        // Check if current user is following this user
        if (!isCurrentUser) {
          // This is a placeholder. In a real app, you would check if the current user is following this user
          setIsFollowing(false)
        }
      } catch (err) {
        console.error("Error fetching social data:", err)
        setError("Failed to load social data")
      } finally {
        setLoading(false)
      }
    }

    fetchSocialData()
  }, [userId, user, isCurrentUser])

  const handleFollowToggle = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      if (isFollowing) {
        await socialService.unfollowUser(userId)
        setFollowersCount((prev) => prev - 1)
      } else {
        await socialService.followUser(userId)
        setFollowersCount((prev) => prev + 1)
      }

      setIsFollowing(!isFollowing)
    } catch (err) {
      console.error("Error toggling follow:", err)
      setError("Failed to update follow status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Picture */}
        <div className="relative w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <Image src={avatarUrl || "/placeholder.svg"} alt={displayName} fill className="object-cover" />
          ) : (
            <Avatar className="w-full h-full">
              <AvatarFallback className="text-4xl">{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="w-full flex flex-col md:flex-row md:justify-between">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <span className="text-gray-400">@{username}</span>

              {!isCurrentUser && user && (
                <Button
                  className={`rounded-full px-6 ${isFollowing ? "bg-gray-700 text-white" : "bg-white text-black"} hover:bg-gray-200 hover:text-black`}
                  onClick={handleFollowToggle}
                  disabled={loading}
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </Button>
              )}
            </div>

            {isCurrentUser && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white self-center md:self-start"
                onClick={() => router.push("/perfil/configuracoes")}
              >
                <Settings className="h-6 w-6" />
              </Button>
            )}
          </div>

          {bio && <p className="text-gray-300 mb-6 text-center md:text-left">{bio}</p>}

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
              <span className="text-xl font-bold">{followersCount}</span>
              <span className="text-sm text-gray-400">Seguidores</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">{followingCount}</span>
              <span className="text-sm text-gray-400">Seguindo</span>
            </div>
          </div>

          {/* Additional user info */}
          {isCurrentUser && (
            <div className="mt-6 w-full">
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span>{displayName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="mt-4 p-3 bg-red-900/20 text-red-300 rounded-md text-sm">{error}</div>}
    </div>
  )
}

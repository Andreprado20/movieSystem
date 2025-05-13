"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"

interface MovieCardProps {
  id: string
  title: string
  year: number
  rating: number
  posterUrl: string
  genres?: string[]
}

export default function MovieCard({ id, title, year, rating, posterUrl, genres }: MovieCardProps) {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    router.push(`/filme/${id}`)
  }

  return (
    <div
      className="cursor-pointer group relative"
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        <Image
          src={posterUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        {isHovering && (
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-end p-3 transition-opacity duration-200">
            <h3 className="font-bold text-sm">{title}</h3>
            <div className="flex items-center mt-1">
              <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
              <span className="text-xs">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400 ml-2">{year}</span>
            </div>
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {genres.slice(0, 2).map((genre) => (
                  <span key={genre} className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded-sm">
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

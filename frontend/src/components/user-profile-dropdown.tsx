"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings, ChevronDown } from "lucide-react"

export default function UserProfileDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  // If not logged in, show login/register buttons
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Registrar
          </Button>
        </Link>
      </div>
    )
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user.displayName) return "U"
    return user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 text-gray-300 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 border border-gray-800 z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-800">
              <p className="text-sm font-medium text-white">{user.displayName || "Usuário"}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>

            <Link
              href="/perfil/1"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </Link>

            <Link
              href="/perfil/configuracoes"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Link>

            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

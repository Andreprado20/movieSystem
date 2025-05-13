"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Notifications, type Notification } from "@/components/notifications"
import { mockNotifications } from "@/lib/mock-notifications"

export default function Header() {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const notificationsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Calculate unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Mark a notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        buttonRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#121212]">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/placeholder.svg?height=32&width=32&text=🎬"
              alt="CineMatch Logo"
              width={32}
              height={32}
              className="rounded-full bg-blue-500"
            />
          </div>
          <h1 className="text-xl font-bold">CineMatch</h1>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/home" className={`hover:text-gray-300 ${pathname === "/home" ? "text-white" : "text-gray-400"}`}>
          Início
        </Link>
        <Link
          href="/calendario"
          className={`hover:text-gray-300 ${pathname === "/calendario" ? "text-white" : "text-gray-400"}`}
        >
          Calendário
        </Link>
        <Link
          href="/comunidades"
          className={`hover:text-gray-300 ${pathname === "/comunidades" ? "text-white" : "text-gray-400"}`}
        >
          Comunidades
        </Link>
        <Link
          href="/perfil/1"
          className={`hover:text-gray-300 ${pathname.startsWith("/perfil") ? "text-white" : "text-gray-400"}`}
        >
          Perfil
        </Link>
      </nav>

      <div className="relative">
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="rounded-full relative"
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>

        {isNotificationsOpen && (
          <div
            ref={notificationsRef}
            className="absolute right-0 mt-2 w-80 rounded-md shadow-lg z-50 bg-gray-950 border border-gray-800 text-white"
            style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          >
            <Notifications
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>
        )}
      </div>
    </header>
  )
}

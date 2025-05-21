"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bell, MessageSquare, User, Film, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotifications, type Notification } from "@/lib/mock-notifications"

interface NotificationsProps {
  onClose?: () => void
}

export function Notifications({ onClose }: NotificationsProps) {
  const [notifications, setNotifications] = useState(getNotifications())

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-400" />
      case "friend":
        return <User className="h-4 w-4 text-green-400" />
      case "movie":
        return <Film className="h-4 w-4 text-purple-400" />
      case "system":
        return <Info className="h-4 w-4 text-yellow-400" />
      default:
        return <Bell className="h-4 w-4 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-50">
      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-medium">Notificações</h3>
        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-gray-400 hover:text-white">
          Marcar todas como lidas
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors ${
                  !notification.read ? "bg-gray-800/50" : ""
                }`}
              >
                <div
                  onClick={() => {
                    markAsRead(notification.id)
                    if (notification.link && onClose) {
                      onClose()
                    }
                  }}
                >
                  {notification.link ? (
                    <Link href={notification.link} className="block">
                      <NotificationContent notification={notification} getIcon={getIcon} formatDate={formatDate} />
                    </Link>
                  ) : (
                    <div>
                      <NotificationContent notification={notification} getIcon={getIcon} formatDate={formatDate} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-2 border-t border-gray-800 text-center">
        <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white w-full" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  )
}

function NotificationContent({
  notification,
  getIcon,
  formatDate,
}: {
  notification: Notification
  getIcon: (type: Notification["type"]) => React.ReactNode
  formatDate: (dateString: string) => string
}) {
  return (
    <>
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
          </div>
          <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(notification.timestamp)}</p>
        </div>
      </div>
    </>
  )
}

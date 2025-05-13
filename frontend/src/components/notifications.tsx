"use client"

import type { FC } from "react"
import { Bell, Check, Clock, Film, MessageSquare, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

// Types for our notifications
export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "recommendation" | "watch" | "system"
  message: string
  read: boolean
  date: Date
  link: string
}

interface NotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

// Helper function to get the appropriate icon for each notification type
const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return <Film className="h-4 w-4 text-red-500" />
    case "comment":
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case "follow":
      return <User className="h-4 w-4 text-green-500" />
    case "recommendation":
      return <Film className="h-4 w-4 text-purple-500" />
    case "watch":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "system":
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

export const Notifications: FC<NotificationsProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="py-2 text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <h3 className="font-medium">Notificações</h3>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} className="text-xs text-blue-500 hover:text-blue-400">
            Marcar todas como lidas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-400">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Nenhuma notificação</p>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <a
              key={notification.id}
              href={notification.link}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                !notification.read ? "bg-gray-900" : ""
              }`}
            >
              <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(notification.date, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onMarkAsRead(notification.id)
                  }}
                  className="text-blue-500 hover:text-blue-400"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

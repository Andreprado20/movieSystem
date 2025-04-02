"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smile, Send } from "lucide-react"

interface Message {
  id: string
  sender: {
    name: string
    avatar: string
    initials: string
    color: string
  }
  content: string
  timestamp: string
  isOwn: boolean
}

export default function GroupChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        name: "Diego Costa",
        avatar: "/avatar-diego.png",
        initials: "DC",
        color: "bg-red-600",
      },
      content: "Você já assistiu o novo filme do Nolan ?",
      timestamp: "20:28",
      isOwn: false,
    },
    {
      id: "2",
      sender: {
        name: "Bruno Almeida",
        avatar: "/avatar-bruno.png",
        initials: "BA",
        color: "bg-gray-600",
      },
      content: "Ainda não, mas já está marcado com a galera",
      timestamp: "20:35",
      isOwn: false,
    },
    {
      id: "3",
      sender: {
        name: "Diego Costa",
        avatar: "/avatar-diego.png",
        initials: "DC",
        color: "bg-red-600",
      },
      content: "Assiste que você vai gostar muito!!",
      timestamp: "20:44",
      isOwn: false,
    },
    {
      id: "4",
      sender: {
        name: "Roberto Bostos",
        avatar: "/avatar-roberto.png",
        initials: "RB",
        color: "bg-gray-600",
      },
      content: "Eu não tenho amigos!!",
      timestamp: "21:00",
      isOwn: false,
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        name: "Você",
        avatar: "/avatar-user.png",
        initials: "YO",
        color: "bg-gray-600",
      },
      content: newMessage,
      timestamp: `${hours}:${minutes}`,
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <Avatar className="h-12 w-12 border border-gray-700">
          <AvatarImage src="/avatar-grupo.png" alt="Grupo de Cinéfilos" />
          <AvatarFallback className="bg-gray-600 text-white">GC</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium text-lg">Grupo de Cinéfilos</h2>
          <p className="text-sm text-gray-400">4 membros Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "flex-row-reverse" : ""} items-start gap-3`}>
            <Avatar className="h-8 w-8 border border-gray-700 mt-1">
              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
              <AvatarFallback className={`${message.sender.color} text-white`}>
                {message.sender.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              {!message.isOwn && <p className="text-sm font-medium">{message.sender.name}</p>}
              <div className={`space-y-1 ${message.isOwn ? "items-end flex flex-col" : ""}`}>
                <div className={`${message.isOwn ? "bg-blue-600" : "bg-gray-800"} rounded-lg p-3 max-w-md`}>
                  <p>{message.content}</p>
                </div>
                <p className="text-xs text-gray-500">{message.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-800 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Smile className="h-6 w-6" />
        </Button>
        <Input
          placeholder="Digite sua mensagem..."
          className="bg-gray-700 border-gray-600 focus-visible:ring-blue-600"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700" onClick={handleSendMessage}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </main>
  )
}


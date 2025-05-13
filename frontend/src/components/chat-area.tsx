"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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

interface Conversation {
  id: string
  name: string
  avatar: string
  initials: string
  color: string
  status: string
  messages: Message[]
}

interface ChatAreaProps {
  conversationId?: string | null
}

export default function ChatArea({ conversationId = "joao-pereira" }: ChatAreaProps) {
  const [conversations, setConversations] = useState<Record<string, Conversation>>({
    "joao-pereira": {
      id: "joao-pereira",
      name: "João Pereira",
      avatar: "/avatar-joao.png",
      initials: "JP",
      color: "bg-red-600",
      status: "online",
      messages: [
        {
          id: "1",
          sender: {
            name: "João Pereira",
            avatar: "/avatar-joao.png",
            initials: "JP",
            color: "bg-red-600",
          },
          content: "Você já assistiu o novo filme do Nolan ?",
          timestamp: "20:28",
          isOwn: false,
        },
        {
          id: "2",
          sender: {
            name: "João Pereira",
            avatar: "/avatar-joao.png",
            initials: "JP",
            color: "bg-red-600",
          },
          content: "É incrível, a fotografia é perfeita!",
          timestamp: "20:30",
          isOwn: false,
        },
        {
          id: "3",
          sender: {
            name: "João Pereira",
            avatar: "/avatar-joao.png",
            initials: "JP",
            color: "bg-red-600",
          },
          content: "Tem uma cena lá muito boa!",
          timestamp: "20:30",
          isOwn: false,
        },
        {
          id: "4",
          sender: {
            name: "Você",
            avatar: "/avatar-user.png",
            initials: "YO",
            color: "bg-gray-600",
          },
          content: "Sem spoilers, pelo amor de Deus!",
          timestamp: "20:34",
          isOwn: true,
        },
        {
          id: "5",
          sender: {
            name: "Você",
            avatar: "/avatar-user.png",
            initials: "YO",
            color: "bg-gray-600",
          },
          content: "Se não eu vou matar você!",
          timestamp: "20:34",
          isOwn: true,
        },
      ],
    },
    "maria-silva": {
      id: "maria-silva",
      name: "Maria Silva",
      avatar: "/avatar-maria.png",
      initials: "MS",
      color: "bg-purple-600",
      status: "online",
      messages: [
        {
          id: "1",
          sender: {
            name: "Maria Silva",
            avatar: "/avatar-maria.png",
            initials: "MS",
            color: "bg-purple-600",
          },
          content: "Vamos assistir juntos no cinema?",
          timestamp: "19:45",
          isOwn: false,
        },
      ],
    },
    "clube-filme": {
      id: "clube-filme",
      name: "Clube do Filme Clássico",
      avatar: "/avatar-clube.png",
      initials: "CF",
      color: "bg-blue-600",
      status: "8 membros online",
      messages: [
        {
          id: "1",
          sender: {
            name: "Administrador",
            avatar: "/avatar-admin.png",
            initials: "AD",
            color: "bg-green-600",
          },
          content: "Próxima Sessão: Cidadão Kane, dia 15/05 às 19h",
          timestamp: "18:30",
          isOwn: false,
        },
      ],
    },
  })

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set the active conversation based on the conversationId prop
    if (conversationId && conversations[conversationId]) {
      setActiveConversation(conversations[conversationId])
    } else if (Object.keys(conversations).length > 0) {
      // Default to the first conversation if no ID is provided
      setActiveConversation(conversations[Object.keys(conversations)[0]])
    }
  }, [conversationId, conversations])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  const handleSendMessage = () => {
    if (!activeConversation || newMessage.trim() === "") return

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

    // Update the messages for the active conversation
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, message],
    }

    // Update the conversations state
    setConversations({
      ...conversations,
      [activeConversation.id]: updatedConversation,
    })

    // Update the active conversation
    setActiveConversation(updatedConversation)

    // Clear the input
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-gray-400">Selecione uma conversa</p>
      </div>
    )
  }

  return (
    <main className="flex flex-col h-full w-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-gray-900 w-full">
        <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-gray-700">
          <AvatarImage src={activeConversation.avatar || "/placeholder.svg"} alt={activeConversation.name} />
          <AvatarFallback className={`${activeConversation.color} text-white`}>
            {activeConversation.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium text-base md:text-lg">{activeConversation.name}</h2>
          <p className="text-xs md:text-sm text-gray-400">{activeConversation.status}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 w-full">
        {activeConversation.messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "flex-row-reverse" : ""} items-start gap-3 w-full`}>
            <Avatar className="h-8 w-8 border border-gray-700 mt-1 flex-shrink-0">
              <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
              <AvatarFallback className={`${message.sender.color} text-white`}>
                {message.sender.initials}
              </AvatarFallback>
            </Avatar>
            <div className={`space-y-1 ${message.isOwn ? "items-end flex flex-col" : ""} max-w-[75%] md:max-w-[60%]`}>
              <div className={`${message.isOwn ? "bg-blue-600" : "bg-gray-800"} rounded-lg p-3 break-words`}>
                <p>{message.content}</p>
              </div>
              <p className="text-xs text-gray-500">{message.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-800 flex items-center gap-2 bg-gray-900 w-full">
        <Button variant="ghost" size="icon" className="text-gray-400 flex-shrink-0">
          <Smile className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        <Input
          placeholder="Digite sua mensagem..."
          className="bg-gray-700 border-gray-600 focus-visible:ring-blue-600"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="icon"
          className="rounded-full bg-blue-600 hover:bg-blue-700 flex-shrink-0"
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </main>
  )
}

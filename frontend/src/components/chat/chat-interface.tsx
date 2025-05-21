"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { chatApi } from "@/lib/chat-service"
import { getWebSocketUrl, type Message } from "@/lib/websocket"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smile, Send } from "lucide-react"

interface ChatInterfaceProps {
  groupId: string
}

export default function ChatInterface({ groupId }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load initial messages and set up WebSocket
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load initial messages from API
        const initialMessages = await chatApi.getMessages(groupId)
        setMessages(initialMessages.reverse()) // Reverse to show newest at the bottom

        // Set up WebSocket connection
        const ws = getWebSocketUrl(groupId)

        // Handle new messages
        const unsubscribeMessage = ws.onMessage((message: any) => {
          setMessages((prev) => [...prev, message])
        })

        // Handle connection state
        const unsubscribeConnection = ws.onConnectionChange((connected: any) => {
          setIsConnected(connected)
        })

        // Connect to WebSocket
        await ws.connect()

        return () => {
          unsubscribeMessage()
          unsubscribeConnection()
        }
      } catch (error: any) {
        console.error("Error loading messages:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadMessages()
    }

    return () => {
      // Clean up WebSocket on unmount
      if (groupId) {
        const ws = getWebSocketUrl(groupId)
        
      }
    }
  }, [groupId, user])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return

    try {
      const ws = getWebSocketUrl(groupId)
      await ws.sendMessage(groupId, newMessage)
      setNewMessage("")
    } catch (error: any) {
      console.error("Error sending message:", error)
      setError(error.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Connection status */}
      {!isConnected && (
        <div className="bg-yellow-500/20 text-yellow-200 text-sm p-2 text-center">Tentando reconectar ao chat...</div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Nenhuma mensagem ainda. Seja o primeiro a enviar!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.uid ? "flex-row-reverse" : ""} items-start gap-3`}
            >
              <Avatar className="h-8 w-8 border border-gray-700 mt-1">
                <AvatarFallback className={message.sender_id === user?.uid ? "bg-blue-600" : "bg-gray-600"}>
                  {message.sender_id.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`space-y-1 ${message.sender_id === user?.uid ? "items-end flex flex-col" : ""}`}>
                <div
                  className={`${
                    message.sender_id === user?.uid ? "bg-blue-600" : "bg-gray-800"
                  } rounded-lg p-3 max-w-md break-words`}
                >
                  <p>{message.content}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(message.created_at).toLocaleTimeString()}
                  {message.is_edited && <span className="ml-2">(editado)</span>}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-800 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Digite sua mensagem..."
          className="bg-gray-700 border-gray-600 focus-visible:ring-blue-600"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isConnected}
        />
        <Button
          size="icon"
          className="rounded-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSendMessage}
          disabled={!isConnected || !newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

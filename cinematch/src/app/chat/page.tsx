"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Sidebar from "@/components/sidebar"
import ChatArea from "@/components/chat-area"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const [activeConversation, setActiveConversation] = useState<string | null>(null)

  useEffect(() => {
    // Get the conversation ID from the URL query parameters
    const conversationId = searchParams.get("conversation")
    if (conversationId) {
      setActiveConversation(conversationId)
    }
  }, [searchParams])

  return (
    <div className="flex h-full">
      <Sidebar />
      <ChatArea conversationId={activeConversation} />
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Sidebar from "@/components/sidebar"
import ChatArea from "@/components/chat-area"
import Header from "@/components/header"

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
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden w-full">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden w-full">
          <Sidebar />
        </div>
        <div className="flex-1 w-full">
          <ChatArea conversationId={activeConversation} />
        </div>
      </div>
    </div>
  )
}

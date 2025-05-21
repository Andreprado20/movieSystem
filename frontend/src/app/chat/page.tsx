import Header from "@/components/header"
import ChatGroups from "@/components/chat/chat-groups"
import ProtectedRoute from "@/components/protected-route"

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#121212] text-white flex flex-col">
        <Header />
        <div className="flex-1 overflow-hidden">
          <ChatGroups />
        </div>
      </div>
    </ProtectedRoute>
  )
}

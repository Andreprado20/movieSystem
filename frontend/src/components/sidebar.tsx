"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("conversas")
  const router = useRouter()

  const handleConversationClick = (conversationId: string) => {
    // Navigate to the chat page with the selected conversation
    router.push(`/chat?conversation=${conversationId}`
  }

  return (
    <aside className="w-80 border-r border-gray-800 flex flex-col">
      {/* Tabs */}
      <div className="p-2">
        <Tabs defaultValue="conversas" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 h-10 bg-gray-800/50 rounded-md w-full">
            <TabsTrigger value="conversas">Conversas</TabsTrigger>
            <TabsTrigger value="amigos">Amigos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search */}
      <div className="p-2">
        <Input
          placeholder={activeTab === "conversas" ? "Buscar conversas..." : "Buscar amigos..."}
          className="bg-gray-800 border-gray-700 text-sm"
        />
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "conversas" ? (
          <>
            <div
              className="p-2 hover:bg-gray-800/50 cursor-pointer"
              onClick={() => handleConversationClick("joao-pereira")}
            >
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-joao.png" alt="João Pereira" />
                  <AvatarFallback className="bg-red-600 text-white">JP</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">João Pereira</h3>
                    <span className="text-xs text-gray-400">21:00</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">Aquele final foi incrível...</p>
                </div>
              </div>
            </div>

            <div
              className="p-2 hover:bg-gray-800/50 cursor-pointer"
              onClick={() => handleConversationClick("grupo-cinefilos")}
            >
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-grupo.png" alt="Grupo" />
                  <AvatarFallback className="bg-gray-600 text-white">GC</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Grupo de Cinéfilos</h3>
                    <span className="text-xs text-gray-400">20:35</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">Claro! Pode deixar</p>
                </div>
              </div>
            </div>

            <div
              className="p-2 hover:bg-gray-800/50 cursor-pointer"
              onClick={() => handleConversationClick("maria-silva")}
            >
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-maria.png" alt="Maria Silva" />
                  <AvatarFallback className="bg-gray-600 text-white">MS</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Maria Silva</h3>
                    <span className="text-xs text-gray-400">21:00</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">Vamos assistir juntos no...</p>
                </div>
              </div>
            </div>

            <div
              className="p-2 hover:bg-gray-800/50 cursor-pointer"
              onClick={() => handleConversationClick("clube-filme")}
            >
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-clube.png" alt="Clube do Filme" />
                  <AvatarFallback className="bg-gray-600 text-white">CF</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Clube do Filme Clássico</h3>
                    <span className="text-xs text-gray-400">19:00</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">Próxima Sessão: Cida...</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-ana.png" alt="Ana Souza" />
                  <AvatarFallback className="bg-gray-600 text-white">AS</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <h3 className="font-medium">Ana Souza</h3>
                    <p className="text-sm text-gray-400">Cinéfilo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other friends... */}
          </>
        )}
      </div>
    </aside>
  )
}


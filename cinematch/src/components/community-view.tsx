"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, MessageCircle, Calendar, BarChart2, Plus } from "lucide-react"
import Image from "next/image"
import GroupChatView from "./group-chat-view"

export default function CommunityView() {
  const [activeSection, setActiveSection] = useState("home")
  const router = useRouter()

  return (
    <div className="flex flex-1">
      {/* Community Sidebar */}
      <div className="w-60 border-r border-gray-800 bg-gray-900">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-700">
              <AvatarImage src="/avatar-grupo.png" alt="Grupo de Cinéfilos" />
              <AvatarFallback className="bg-gray-600 text-white">GC</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">Grupo de Cinéfilos</h2>
              <p className="text-xs text-gray-400">4 participantes online</p>
            </div>
          </div>
        </div>

        <nav className="p-2">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 mb-1 ${activeSection === "home" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setActiveSection("home")}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 mb-1 ${activeSection === "conversa" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setActiveSection("conversa")}
          >
            <MessageCircle className="h-4 w-4" />
            Conversa
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 mb-1 ${activeSection === "calendario" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setActiveSection("calendario")}
          >
            <Calendar className="h-4 w-4" />
            Calendário
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 mb-1 ${activeSection === "enquete" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={() => setActiveSection("enquete")}
          >
            <BarChart2 className="h-4 w-4" />
            Enquete
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 mb-1">
            <Plus className="h-4 w-4" />
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      {activeSection === "home" ? (
        <div className="flex-1 overflow-y-auto p-6">
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Membros:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-user1.png" alt="Usuário 1" />
                  <AvatarFallback className="bg-red-600 text-white">U1</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Usuário 1</h3>
                  <p className="text-sm text-gray-400">Cinéfilo</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-user2.png" alt="Usuário 2" />
                  <AvatarFallback className="bg-gray-600 text-white">U2</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Usuário 2</h3>
                  <p className="text-sm text-gray-400">Cinéfilo</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-user3.png" alt="Usuário 3" />
                  <AvatarFallback className="bg-gray-600 text-white">U3</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Usuário 3</h3>
                  <p className="text-sm text-gray-400">Cinéfilo</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-user4.png" alt="Usuário 4" />
                  <AvatarFallback className="bg-gray-600 text-white">U4</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Usuário 4</h3>
                  <p className="text-sm text-gray-400">Cinéfilo</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Filmes Assistidos:</h2>
            <Tabs defaultValue="recentes" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="recentes">Recentes</TabsTrigger>
                <TabsTrigger value="maior">Maior Avaliação</TabsTrigger>
                <TabsTrigger value="menor">Menor Avaliação</TabsTrigger>
              </TabsList>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((movie) => (
                  <div key={movie} className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={`/placeholder.svg?height=300&width=200&text=Filme ${movie}`}
                        alt={`Filme ${movie}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Tabs>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Próximos Eventos:</h2>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎬</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Maratonar Star Wars</h3>
                  <p className="text-sm text-gray-400">Data: 01/03/2025 às 21:25</p>
                  <p className="text-sm text-gray-400">8 Participantes</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎬</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Assistir "The Irishman"</h3>
                  <p className="text-sm text-gray-400">Data: 11/04/2025 às 20:00</p>
                  <p className="text-sm text-gray-400">6 Participantes</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎬</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Sessão Cinema: Lançamento</h3>
                  <p className="text-sm text-gray-400">Data: 25/04/2025 às 22:00</p>
                  <p className="text-sm text-gray-400">8 Participantes</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : activeSection === "conversa" ? (
        <GroupChatView />
      ) : (
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
          <p className="text-gray-400">Esta seção está em desenvolvimento.</p>
        </div>
      )}
    </div>
  )
}


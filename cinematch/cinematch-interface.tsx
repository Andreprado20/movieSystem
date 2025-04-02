"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Smile, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CineMatchInterface() {
  const [activeTab, setActiveTab] = useState("conversas")

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="CineMatch Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <h1 className="text-xl font-bold">CineMatch</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#" className="hover:text-gray-300">
            Início
          </Link>
          <Link href="#" className="hover:text-gray-300">
            Calendário
          </Link>
          <Link href="#" className="hover:text-gray-300">
            Comunidades
          </Link>
          <Link href="#" className="hover:text-gray-300">
            Perfil
          </Link>
        </nav>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 flex flex-col">
          {/* Tabs */}
          <div className="p-2">
            <Tabs defaultValue="conversas" className="w-full">
              <TabsList className="grid grid-cols-2 h-10 bg-gray-800/50 rounded-md w-full">
                <TabsTrigger
                  value="conversas"
                  className="rounded-md data-[state=active]:bg-blue-600"
                  onClick={() => setActiveTab("conversas")}
                >
                  Conversas
                </TabsTrigger>
                <TabsTrigger
                  value="amigos"
                  className="rounded-md data-[state=active]:bg-blue-600"
                  onClick={() => setActiveTab("amigos")}
                >
                  Amigos
                </TabsTrigger>
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
                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="João Pereira" />
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

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Grupo" />
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

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Maria Silva" />
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

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Clube do Filme" />
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
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Ana Souza" />
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

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Bruno Almeida" />
                      <AvatarFallback className="bg-gray-600 text-white">BA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h3 className="font-medium">Bruno Almeida</h3>
                        <p className="text-sm text-gray-400">Cinéfilo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Camila Ferreira" />
                      <AvatarFallback className="bg-gray-600 text-white">CF</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h3 className="font-medium">Camila Ferreira</h3>
                        <p className="text-sm text-gray-400">Cinéfilo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Diego Costa" />
                      <AvatarFallback className="bg-gray-600 text-white">DC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h3 className="font-medium">Diego Costa</h3>
                        <p className="text-sm text-gray-400">Cinéfilo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Elisa Martins" />
                      <AvatarFallback className="bg-gray-600 text-white">EM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h3 className="font-medium">Elisa Martins</h3>
                        <p className="text-sm text-gray-400">Cinéfilo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Felipe Oliveira" />
                      <AvatarFallback className="bg-gray-600 text-white">FO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h3 className="font-medium">Felipe Oliveira</h3>
                        <p className="text-sm text-gray-400">Cinéfilo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 hover:bg-gray-800/50 cursor-pointer">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Gabriela Lima" />
                      <AvatarFallback className="bg-gray-600 text-white">GL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h3 className="font-medium">Gabriela Lima</h3>
                        <p className="text-sm text-gray-400">Cinéfilo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-gray-700">
              <AvatarImage src="/placeholder.svg?height=48&width=48" alt="João Pereira" />
              <AvatarFallback className="bg-red-600 text-white">JP</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-lg">João Pereira</h2>
              <p className="text-sm text-gray-400">online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border border-gray-700 mt-1">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="João Pereira" />
                <AvatarFallback className="bg-red-600 text-white">JP</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="bg-gray-800 rounded-lg p-3 max-w-md">
                  <p>Você já assistiu o novo filme do Nolan ?</p>
                </div>
                <p className="text-xs text-gray-500">20:28</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border border-gray-700 mt-1">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="João Pereira" />
                <AvatarFallback className="bg-red-600 text-white">JP</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="bg-gray-800 rounded-lg p-3 max-w-md">
                  <p>É incrível, a fotografia é perfeita!</p>
                </div>
                <p className="text-xs text-gray-500">20:30</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border border-gray-700 mt-1">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="João Pereira" />
                <AvatarFallback className="bg-red-600 text-white">JP</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="bg-gray-800 rounded-lg p-3 max-w-md">
                  <p>Tem uma cena lá muito boa!</p>
                </div>
                <p className="text-xs text-gray-500">20:30</p>
              </div>
            </div>

            <div className="flex flex-row-reverse items-start gap-3">
              <Avatar className="h-8 w-8 border border-gray-700 mt-1">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                <AvatarFallback className="bg-gray-600 text-white">YO</AvatarFallback>
              </Avatar>
              <div className="space-y-1 items-end flex flex-col">
                <div className="bg-blue-600 rounded-lg p-3 max-w-md">
                  <p>Sem spoilers, pelo amor de Deus!</p>
                </div>
                <p className="text-xs text-gray-500">20:34</p>
              </div>
            </div>

            <div className="flex flex-row-reverse items-start gap-3">
              <Avatar className="h-8 w-8 border border-gray-700 mt-1">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                <AvatarFallback className="bg-gray-600 text-white">YO</AvatarFallback>
              </Avatar>
              <div className="space-y-1 items-end flex flex-col">
                <div className="bg-blue-600 rounded-lg p-3 max-w-md">
                  <p>Se não eu vou matar você!</p>
                </div>
                <p className="text-xs text-gray-500">20:34</p>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-800 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Smile className="h-6 w-6" />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              className="bg-gray-700 border-gray-600 focus-visible:ring-blue-600"
            />
            <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}


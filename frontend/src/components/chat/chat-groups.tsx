"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { chatApi } from "@/lib/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Users } from "lucide-react"

interface Group {
  id: string
  name: string
  description: string | null
  is_private: boolean
  created_by: string
  created_at: string
  members: string[]
}

export default function ChatGroups() {
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([])
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state for creating a new group
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState(false)
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  // Load groups
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const userGroups = await chatApi.getUserGroups()
        setGroups(userGroups)
        setFilteredGroups(userGroups)
      } catch (error: any) {
        console.error("Error loading groups:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadGroups()
  }, [])

  // Filter groups when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGroups(groups)
      return
    }

    const filtered = groups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    setFilteredGroups(filtered)
  }, [searchQuery, groups])

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return

    try {
      setIsCreatingGroup(true)

      const newGroup = await chatApi.createGroup({
        name: newGroupName,
        description: newGroupDescription || undefined,
        is_private: newGroupIsPrivate,
      })

      setGroups((prev) => [...prev, newGroup])

      // Reset form
      setNewGroupName("")
      setNewGroupDescription("")
      setNewGroupIsPrivate(false)
      setIsDialogOpen(false)
    } catch (error: any) {
      console.error("Error creating group:", error)
      setError(error.message)
    } finally {
      setIsCreatingGroup(false)
    }
  }

  const handleGroupClick = (groupId: string) => {
    router.push(`/chat/${groupId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Grupos de Chat</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Grupo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle>Criar Novo Grupo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Nome do Grupo</Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-description">Descrição (opcional)</Label>
                  <Textarea
                    id="group-description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="group-private">Grupo Privado</Label>
                  <Switch id="group-private" checked={newGroupIsPrivate} onCheckedChange={setNewGroupIsPrivate} />
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateGroup}
                  disabled={isCreatingGroup || !newGroupName.trim()}
                >
                  {isCreatingGroup ? "Criando..." : "Criar Grupo"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar grupos..."
            className="bg-gray-800 border-gray-700 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="p-4 bg-red-900/20 text-red-300 text-sm">{error}</div>}

      <div className="flex-1 overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Users className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2">
              {searchQuery ? "Nenhum grupo encontrado para esta busca" : "Você ainda não participa de nenhum grupo"}
            </p>
            {!searchQuery && (
              <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700" onClick={() => setIsDialogOpen(true)}>
                Criar um Grupo
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 hover:bg-gray-800/50 cursor-pointer"
                onClick={() => handleGroupClick(group.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-gray-700">
                    <AvatarFallback className="bg-blue-600">{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    {group.description && <p className="text-sm text-gray-400 line-clamp-1">{group.description}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{group.members.length} membros</span>
                      {group.is_private && <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">Privado</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

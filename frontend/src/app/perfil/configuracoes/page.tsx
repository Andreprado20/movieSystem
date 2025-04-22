"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Lock, Bell, Eye, LogOut, Trash2, ChevronLeft, Camera, Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("perfil")
  const [isUploading, setIsUploading] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    message: string
    type: "success" | "error" | null
  }>({ message: "", type: null })

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Maria Silva",
    username: "mariacinefila",
    email: "maria@example.com",
    bio: "Cinéfila apaixonada | Crítica Amadora | Colecionadora de Filmes Clássicos",
    avatar: "/placeholder.svg?height=160&width=160&text=MS",
    notifications: {
      email: true,
      push: true,
      newFollowers: true,
      comments: true,
      events: true,
    },
    privacy: {
      profileVisibility: "public",
      showWatchHistory: true,
      showFavorites: true,
      allowTagging: true,
    },
    preferences: {
      darkMode: true,
      language: "pt-BR",
      autoplayTrailers: false,
    },
  })

  const handleInputChange = (section: string, field: string, value: any) => {
    setUserData((prev) => {
      // Make a copy of the current section data or use an empty object if it doesn't exist
      const sectionData = prev[section as keyof typeof prev] || {}

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value,
        },
      }
    })
  }

  const handleBasicInfoChange = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveChanges = (section: string) => {
    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        message: "Alterações salvas com sucesso!",
        type: "success",
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormStatus({ message: "", type: null })
      }, 3000)
    }, 800)
  }

  const handleAvatarUpload = () => {
    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      setFormStatus({
        message: "Foto de perfil atualizada com sucesso!",
        type: "success",
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormStatus({ message: "", type: null })
      }, 3000)
    }, 1500)
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      // Simulate account deletion
      setTimeout(() => {
        router.push("/login")
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto pb-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button and page title */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-400 hover:text-white"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Button>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          {/* Status message */}
          {formStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg ${formStatus.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
            >
              {formStatus.message}
            </div>
          )}

          {/* Settings tabs */}
          <Tabs defaultValue="perfil" className="w-full" onValueChange={setActiveTab} value={activeTab}>
            <div className="overflow-x-auto">
              <TabsList className="bg-gray-900 p-1 rounded-lg mb-8 w-full max-w-3xl">
                <TabsTrigger value="perfil" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="senha" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Senha</span>
                </TabsTrigger>
                <TabsTrigger value="notificacoes" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notificações</span>
                </TabsTrigger>
                <TabsTrigger value="privacidade" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacidade</span>
                </TabsTrigger>
                <TabsTrigger value="preferencias" className="flex items-center gap-2 data-[state=active]:bg-gray-800">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferências</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Tab */}
            <TabsContent value="perfil" className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Informações do Perfil</h2>

                {/* Avatar upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                      <Image src={userData.avatar || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
                    </div>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleAvatarUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-lg">{userData.name}</h3>
                    <p className="text-gray-400">@{userData.username}</p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm border-gray-700"
                        onClick={handleAvatarUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? "Enviando..." : "Alterar foto"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Profile form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de usuário</Label>
                      <Input
                        id="username"
                        value={userData.username}
                        onChange={(e) => handleBasicInfoChange("username", e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleBasicInfoChange("email", e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={userData.bio}
                      onChange={(e) => handleBasicInfoChange("bio", e.target.value)}
                      className="bg-gray-700 border-gray-600 min-h-[100px]"
                    />
                  </div>

                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSaveChanges("profile")}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="senha" className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Alterar Senha</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha atual</Label>
                    <Input id="current-password" type="password" className="bg-gray-700 border-gray-600" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input id="new-password" type="password" className="bg-gray-700 border-gray-600" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input id="confirm-password" type="password" className="bg-gray-700 border-gray-600" />
                  </div>

                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSaveChanges("password")}
                  >
                    Atualizar senha
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notificacoes" className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Preferências de Notificações</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificações por email</h3>
                      <p className="text-sm text-gray-400">Receba atualizações por email</p>
                    </div>
                    <Switch
                      checked={userData.notifications.email}
                      onCheckedChange={(checked) => handleInputChange("notifications", "email", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificações push</h3>
                      <p className="text-sm text-gray-400">Receba notificações no navegador</p>
                    </div>
                    <Switch
                      checked={userData.notifications.push}
                      onCheckedChange={(checked) => handleInputChange("notifications", "push", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Novos seguidores</h3>
                      <p className="text-sm text-gray-400">Quando alguém começar a seguir você</p>
                    </div>
                    <Switch
                      checked={userData.notifications.newFollowers}
                      onCheckedChange={(checked) => handleInputChange("notifications", "newFollowers", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Comentários</h3>
                      <p className="text-sm text-gray-400">Quando alguém comentar em suas avaliações</p>
                    </div>
                    <Switch
                      checked={userData.notifications.comments}
                      onCheckedChange={(checked) => handleInputChange("notifications", "comments", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Eventos</h3>
                      <p className="text-sm text-gray-400">Lembretes de eventos e sessões</p>
                    </div>
                    <Switch
                      checked={userData.notifications.events}
                      onCheckedChange={(checked) => handleInputChange("notifications", "events", checked)}
                    />
                  </div>

                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 mt-4"
                    onClick={() => handleSaveChanges("notifications")}
                  >
                    Salvar preferências
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacidade" className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Configurações de Privacidade</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">Visibilidade do perfil</Label>
                    <select
                      id="profile-visibility"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                      value={userData.privacy.profileVisibility}
                      onChange={(e) => handleInputChange("privacy", "profileVisibility", e.target.value)}
                    >
                      <option value="public">Público - Qualquer pessoa pode ver</option>
                      <option value="followers">Seguidores - Apenas seguidores podem ver</option>
                      <option value="private">Privado - Apenas você pode ver</option>
                    </select>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Histórico de filmes assistidos</h3>
                      <p className="text-sm text-gray-400">Permitir que outros vejam o que você assistiu</p>
                    </div>
                    <Switch
                      checked={userData.privacy.showWatchHistory}
                      onCheckedChange={(checked) => handleInputChange("privacy", "showWatchHistory", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Filmes favoritos</h3>
                      <p className="text-sm text-gray-400">Permitir que outros vejam seus favoritos</p>
                    </div>
                    <Switch
                      checked={userData.privacy.showFavorites}
                      onCheckedChange={(checked) => handleInputChange("privacy", "showFavorites", checked)}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marcações</h3>
                      <p className="text-sm text-gray-400">Permitir que outros usuários te marquem</p>
                    </div>
                    <Switch
                      checked={userData.privacy.allowTagging}
                      onCheckedChange={(checked) => handleInputChange("privacy", "allowTagging", checked)}
                    />
                  </div>

                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 mt-4"
                    onClick={() => handleSaveChanges("privacy")}
                  >
                    Salvar configurações
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferencias" className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Preferências da Conta</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Modo escuro</h3>
                      <p className="text-sm text-gray-400">Alternar entre tema claro e escuro</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-gray-400" />
                      <Switch
                        checked={userData.preferences.darkMode}
                        onCheckedChange={(checked) => handleInputChange("preferences", "darkMode", checked)}
                      />
                      <Moon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <select
                      id="language"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                      value={userData.preferences.language}
                      onChange={(e) => handleInputChange("preferences", "language", e.target.value)}
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Reprodução automática de trailers</h3>
                      <p className="text-sm text-gray-400">Reproduzir trailers automaticamente</p>
                    </div>
                    <Switch
                      checked={userData.preferences.autoplayTrailers}
                      onCheckedChange={(checked) => handleInputChange("preferences", "autoplayTrailers", checked)}
                    />
                  </div>

                  <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 mt-4"
                    onClick={() => handleSaveChanges("preferences")}
                  >
                    Salvar preferências
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Account Actions */}
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold mb-4">Ações da Conta</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-700"
                onClick={() => router.push("/login")}
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </Button>

              <Button
                variant="destructive"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4" />
                Excluir conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

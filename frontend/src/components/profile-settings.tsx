"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { profileService, type ProfileUpdate, type PasswordChange } from "@/lib/profile-service"
import { useAuth } from "@/contexts/auth-context"

export function ProfileSettings() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [profileData, setProfileData] = useState<ProfileUpdate>({
    name: user?.displayName || "",
    username: user?.email?.split("@")[0] || "",
    bio: "",
    email: user?.email || "",
  })

  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
  })

  const [confirmPassword, setConfirmPassword] = useState("")
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    movieRecommendations: true,
    socialNotifications: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showWatchedMovies: true,
    showFavorites: true,
    showWatchLater: true,
  })

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    notifications: false,
    privacy: false,
    deleteAccount: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handlePrivacyChange = (name: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [name]: value }))
  }

  const updateProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }))
      setError(null)
      setSuccess(null)

      await profileService.updateProfile(profileData)
      setSuccess("Perfil atualizado com sucesso!")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Falha ao atualizar o perfil. Por favor, tente novamente.")
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }))
    }
  }

  const changePassword = async () => {
    if (passwordData.newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    try {
      setLoading((prev) => ({ ...prev, password: true }))
      setError(null)
      setSuccess(null)

      await profileService.changePassword(passwordData)
      setSuccess("Senha alterada com sucesso!")
      setPasswordData({ currentPassword: "", newPassword: "" })
      setConfirmPassword("")
    } catch (err) {
      console.error("Error changing password:", err)
      setError("Falha ao alterar a senha. Verifique se a senha atual está correta.")
    } finally {
      setLoading((prev) => ({ ...prev, password: false }))
    }
  }

  const updateNotifications = async () => {
    try {
      setLoading((prev) => ({ ...prev, notifications: true }))
      setError(null)
      setSuccess(null)

      await profileService.updateNotificationSettings(notificationSettings)
      setSuccess("Configurações de notificação atualizadas com sucesso!")
    } catch (err) {
      console.error("Error updating notification settings:", err)
      setError("Falha ao atualizar as configurações de notificação.")
    } finally {
      setLoading((prev) => ({ ...prev, notifications: false }))
    }
  }

  const updatePrivacy = async () => {
    try {
      setLoading((prev) => ({ ...prev, privacy: true }))
      setError(null)
      setSuccess(null)

      await profileService.updatePrivacySettings({
        ...privacySettings,
        profileVisibility: privacySettings.profileVisibility as "public" | "friends" | "private",
      })
      setSuccess("Configurações de privacidade atualizadas com sucesso!")
    } catch (err) {
      console.error("Error updating privacy settings:", err)
      setError("Falha ao atualizar as configurações de privacidade.")
    } finally {
      setLoading((prev) => ({ ...prev, privacy: false }))
    }
  }

  const deleteAccount = async () => {
    try {
      setLoading((prev) => ({ ...prev, deleteAccount: true }))
      setError(null)

      await profileService.deleteAccount()
      logout()
      router.push("/")
    } catch (err) {
      console.error("Error deleting account:", err)
      setError("Falha ao excluir a conta. Por favor, tente novamente.")
      setLoading((prev) => ({ ...prev, deleteAccount: false }))
    }
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="bg-red-900/20 text-red-300 p-4 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 text-green-300 p-4 rounded-md">
          <span>{success}</span>
        </div>
      )}

      {/* Profile Information */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Informações do Perfil</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleProfileChange}
              className="bg-gray-800 border-gray-700 min-h-[100px]"
              placeholder="Conte um pouco sobre você..."
            />
          </div>
          <Button onClick={updateProfile} disabled={loading.profile} className="bg-blue-600 hover:bg-blue-700">
            {loading.profile ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Password Change */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Alterar Senha</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <Button onClick={changePassword} disabled={loading.password} className="bg-blue-600 hover:bg-blue-700">
            {loading.password ? "Alterando..." : "Alterar Senha"}
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Notification Settings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Configurações de Notificação</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Notificações por Email</Label>
              <p className="text-sm text-gray-400">Receba atualizações por email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications">Notificações Push</Label>
              <p className="text-sm text-gray-400">Receba notificações no navegador</p>
            </div>
            <Switch
              id="pushNotifications"
              checked={notificationSettings.pushNotifications}
              onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="movieRecommendations">Recomendações de Filmes</Label>
              <p className="text-sm text-gray-400">Receba recomendações personalizadas</p>
            </div>
            <Switch
              id="movieRecommendations"
              checked={notificationSettings.movieRecommendations}
              onCheckedChange={(checked) => handleNotificationChange("movieRecommendations", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="socialNotifications">Notificações Sociais</Label>
              <p className="text-sm text-gray-400">Receba notificações sobre seguidores e comentários</p>
            </div>
            <Switch
              id="socialNotifications"
              checked={notificationSettings.socialNotifications}
              onCheckedChange={(checked) => handleNotificationChange("socialNotifications", checked)}
            />
          </div>
          <Button
            onClick={updateNotifications}
            disabled={loading.notifications}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading.notifications ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Privacy Settings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Configurações de Privacidade</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profileVisibility">Visibilidade do Perfil</Label>
            <select
              id="profileVisibility"
              value={privacySettings.profileVisibility}
              onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2"
            >
              <option value="public">Público</option>
              <option value="friends">Apenas Seguidores</option>
              <option value="private">Privado</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showWatchedMovies">Mostrar Filmes Assistidos</Label>
              <p className="text-sm text-gray-400">Permitir que outros vejam seus filmes assistidos</p>
            </div>
            <Switch
              id="showWatchedMovies"
              checked={privacySettings.showWatchedMovies}
              onCheckedChange={(checked) => handlePrivacyChange("showWatchedMovies", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showFavorites">Mostrar Favoritos</Label>
              <p className="text-sm text-gray-400">Permitir que outros vejam seus filmes favoritos</p>
            </div>
            <Switch
              id="showFavorites"
              checked={privacySettings.showFavorites}
              onCheckedChange={(checked) => handlePrivacyChange("showFavorites", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showWatchLater">Mostrar Lista para Assistir Depois</Label>
              <p className="text-sm text-gray-400">
                Permitir que outros vejam sua lista de filmes para assistir depois
              </p>
            </div>
            <Switch
              id="showWatchLater"
              checked={privacySettings.showWatchLater}
              onCheckedChange={(checked) => handlePrivacyChange("showWatchLater", checked)}
            />
          </div>
          <Button onClick={updatePrivacy} disabled={loading.privacy} className="bg-blue-600 hover:bg-blue-700">
            {loading.privacy ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Delete Account */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Excluir Conta</h2>
        <p className="text-gray-400 mb-4">
          Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos
                servidores.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 border-gray-700">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                disabled={loading.deleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading.deleteAccount ? "Excluindo..." : "Sim, excluir minha conta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

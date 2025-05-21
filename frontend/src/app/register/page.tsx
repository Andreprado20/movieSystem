"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If user is already logged in, redirect to home
  if (user) {
    router.push("/home")
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (!agreeTerms) {
      setError("Você precisa concordar com os termos de uso")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await signUpWithEmail(email, password)
      router.push("/home")
    } catch (error: any) {
      console.error("Registration error:", error)

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setError("Este email já está em uso")
      } else if (error.code === "auth/weak-password") {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres")
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido")
      } else {
        setError("Erro ao criar conta. Por favor, tente novamente")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await signInWithGoogle()
      router.push("/home")
    } catch (error: any) {
      console.error("Google registration error:", error)
      setError("Erro ao registrar com Google. Por favor, tente novamente")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CineMatch</h1>
          <p className="text-gray-400">Crie sua conta</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-md mb-6">{error}</div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-800 border-gray-700"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="terms" className="text-sm">
              Eu concordo com os{" "}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                Política de Privacidade
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#121212] text-gray-400">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-800"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}

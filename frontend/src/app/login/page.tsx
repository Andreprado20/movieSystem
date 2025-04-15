"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would authenticate the user here
    // For now, we'll just redirect to the home page
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 justify-center">
        <div className="mb-12">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/placeholder.svg?height=40&width=40&text=🎬"
                alt="CineMatch Logo"
                width={40}
                height={40}
                className="rounded-full bg-blue-500"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">CineMatch</h1>
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seumail@gmail.com"
                className="bg-white text-black border-none h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="************"
                  className="bg-white text-black border-none h-12 text-base pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="h-4 w-4 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Lembrar de mim
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-white text-black border-none h-12"
              >
                <Image
                  src="/placeholder.svg?height=20&width=20&text=G"
                  alt="Google Logo"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                Fazer login com o google
              </Button>
            </div>

            <div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 h-12">
                Entrar
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Quote */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] flex-col justify-center p-12">
        <div className="max-w-lg">
          <blockquote className="text-4xl font-bold text-white leading-tight">
            "O cinema é um espelho onde todos nós nos vemos refletidos."
          </blockquote>
          <p className="text-2xl text-white mt-6">-Frederico Fellini</p>
        </div>
      </div>
    </div>
  )
}

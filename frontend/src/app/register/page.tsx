"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would register the user here
    // For now, we'll just redirect to the home page
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="p-8">
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

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Nome
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="seu nome"
                className="bg-white text-black border-none h-12 text-base"
              />
            </div>

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
              <label htmlFor="birthDate" className="block text-sm font-medium text-white">
                Data de Nascimento
              </label>
              <Input
                id="birthDate"
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="00/00/0000"
                className="bg-white text-black border-none h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="bg-white text-black border-none h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Senha"
                className="bg-white text-black border-none h-12 text-base"
              />
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
                Cadastrar
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

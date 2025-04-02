"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#121212]">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="CineMatch Logo" width={32} height={32} className="rounded-full" />
          </div>
          <h1 className="text-xl font-bold">CineMatch</h1>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className={`hover:text-gray-300 ${pathname === "/" ? "text-white" : "text-gray-400"}`}>
          Início
        </Link>
        <Link
          href="/calendario"
          className={`hover:text-gray-300 ${pathname === "/calendario" ? "text-white" : "text-gray-400"}`}
        >
          Calendário
        </Link>
        <Link
          href="/comunidades"
          className={`hover:text-gray-300 ${pathname === "/comunidades" ? "text-white" : "text-gray-400"}`}
        >
          Comunidades
        </Link>
        <Link
          href="/perfil"
          className={`hover:text-gray-300 ${pathname === "/perfil" ? "text-white" : "text-gray-400"}`}
        >
          Perfil
        </Link>
      </nav>

      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
      </Button>
    </header>
  )
}


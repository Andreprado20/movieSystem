"use client"

import Header from "@/components/header"
import { MovieBrowser } from "@/components/movie-browser"

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Explorar Filmes</h1>
        <MovieBrowser />
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Menu, X, Film, Users, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          scrolled ? "bg-[#121212]/95 backdrop-blur-sm py-3 shadow-md" : "bg-transparent py-6",
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/placeholder.svg?height=48&width=48&text=🎬"
                alt="CineMatch Logo"
                width={48}
                height={48}
                className="rounded-full bg-blue-500"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">CineMatch</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Recursos
            </Link>
            <Link href="#community" className="text-gray-300 hover:text-white transition-colors">
              Comunidade
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              Sobre
            </Link>
            <div className="flex gap-4">
              <Button variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white px-6" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200 px-6" asChild>
                <Link href="/register">Cadastrar</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-gray-800/50 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden" aria-modal="true">
            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Menu panel */}
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gray-900 shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/placeholder.svg?height=32&width=32&text=🎬"
                      alt="CineMatch Logo"
                      width={32}
                      height={32}
                      className="rounded-full bg-blue-500"
                    />
                  </div>
                  <span className="text-xl font-bold text-white">CineMatch</span>
                </div>
                <Button variant="ghost" size="icon" className="text-white" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-6">
                <Link
                  href="#features"
                  className="text-lg text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recursos
                </Link>
                <Link
                  href="#community"
                  className="text-lg text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Comunidade
                </Link>
                <Link
                  href="#about"
                  className="text-lg text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sobre
                </Link>

                <div className="pt-6 border-t border-gray-800">
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full justify-center text-white border-gray-700 hover:bg-gray-800 hover:text-white"
                      asChild
                    >
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button className="w-full justify-center bg-white text-black hover:bg-gray-200" asChild>
                      <Link href="/register">Cadastrar</Link>
                    </Button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl leading-tight">
              Sua comunidade de cinéfilos
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed">
              Descubra, discuta e compartilhe sua paixão por filmes com pessoas que amam cinema tanto quanto você.
              Conecte-se com outros cinéfilos e expanda seu universo cinematográfico.
            </p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-md flex items-center gap-2 group transition-all duration-300 hover:gap-3"
              asChild
            >
              <Link href="/register">
                Comece Agora
                <ArrowRight className="h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Tudo que você precisa em um só lugar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 transition-transform hover:scale-105">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Film className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Descubra Filmes</h3>
              <p className="text-gray-300">
                Explore um vasto catálogo de filmes, receba recomendações personalizadas e mantenha-se atualizado com os
                lançamentos mais recentes.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 transition-transform hover:scale-105">
              <div className="bg-red-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Conecte-se</h3>
              <p className="text-gray-300">
                Participe de comunidades temáticas, discuta seus filmes favoritos e faça amizades com pessoas que
                compartilham seus interesses.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 transition-transform hover:scale-105">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Organize Eventos</h3>
              <p className="text-gray-300">
                Crie e participe de sessões de cinema virtuais, maratonas temáticas e eventos exclusivos com outros
                membros da comunidade.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 transition-transform hover:scale-105">
              <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Avalie e Critique</h3>
              <p className="text-gray-300">
                Compartilhe suas opiniões, escreva críticas detalhadas e descubra análises profundas dos filmes que você
                ama.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 transition-transform hover:scale-105">
              <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M12 13V2l8 4-8 4" />
                  <path d="M20.55 10.23A9 9 0 1 1 8 4.94" />
                  <path d="M8 10a3 3 0 0 1 4 3v1" />
                  <path d="M12 19v-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Acompanhe Seu Progresso</h3>
              <p className="text-gray-300">
                Mantenha um registro dos filmes que você assistiu, crie listas personalizadas e estabeleça metas de
                visualização.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 transition-transform hover:scale-105">
              <div className="bg-teal-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Recomendações Inteligentes</h3>
              <p className="text-gray-300">
                Receba sugestões personalizadas baseadas em seus gostos, histórico de visualização e avaliações da
                comunidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="community" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">O que nossa comunidade diz</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48&text=JP"
                    alt="João Pereira"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold">João Pereira</h4>
                  <p className="text-gray-400 text-sm">Cinéfilo há 5 anos</p>
                </div>
              </div>
              <p className="text-gray-300">
                "O CineMatch revolucionou minha experiência com cinema. Encontrei pessoas que compartilham meu amor por
                filmes de terror dos anos 80 e agora temos sessões semanais!"
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48&text=MS"
                    alt="Maria Silva"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold">Maria Silva</h4>
                  <p className="text-gray-400 text-sm">Crítica amadora</p>
                </div>
              </div>
              <p className="text-gray-300">
                "As recomendações são incrivelmente precisas! Descobri filmes independentes que nunca teria encontrado
                de outra forma. A comunidade é acolhedora e as discussões são sempre enriquecedoras."
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48&text=CA"
                    alt="Carlos Almeida"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold">Carlos Almeida</h4>
                  <p className="text-gray-400 text-sm">Diretor independente</p>
                </div>
              </div>
              <p className="text-gray-300">
                "Como cineasta independente, o CineMatch me ajudou a encontrar um público para meus filmes. A plataforma
                conecta criadores e espectadores de uma forma que nenhuma outra consegue."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-900 to-[#121212]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para expandir seu universo cinematográfico?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de cinéfilos e comece a compartilhar sua paixão pelo cinema hoje mesmo.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-md flex items-center gap-2 mx-auto group transition-all duration-300 hover:gap-3"
            asChild
          >
            <Link href="/register">
              Comece Agora
              <ArrowRight className="h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <Image
                    src="/placeholder.svg?height=40&width=40&text=🎬"
                    alt="CineMatch Logo"
                    width={40}
                    height={40}
                    className="rounded-full bg-blue-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">CineMatch</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Conectando amantes de cinema desde 2023. Sua comunidade para descobrir, discutir e compartilhar filmes.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Explorar Filmes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Comunidades
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Eventos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Críticas
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Termos de Serviço
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">© 2025 CineMatch. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

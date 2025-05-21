import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          My App
        </Link>
        <nav>
          <Link href="/" className="text-gray-300 hover:text-white mr-4">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white mr-4">
            About
          </Link>
          <Link href="/filmes" className="text-gray-300 hover:text-white mr-4">
            Filmes
          </Link>
          <Link href="/perfil/conexoes" className="text-gray-300 hover:text-white">
            Conexões
          </Link>
        </nav>
      </div>
    </header>
  )
}

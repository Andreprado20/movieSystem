import type { User, Movie } from "./types"

// Mock movie data
const mockMovies: Record<string, Movie> = {
  interstellar: {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    rating: 4.8,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Interstellar",
    genres: ["Ficção Científica", "Drama", "Aventura"],
  },
  "dark-knight": {
    id: "dark-knight",
    title: "The Dark Knight",
    year: 2008,
    rating: 4.9,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Dark+Knight",
    genres: ["Ação", "Drama", "Crime"],
  },
  inception: {
    id: "inception",
    title: "Inception",
    year: 2010,
    rating: 4.7,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Inception",
    genres: ["Ficção Científica", "Ação", "Aventura"],
  },
  "pulp-fiction": {
    id: "pulp-fiction",
    title: "Pulp Fiction",
    year: 1994,
    rating: 4.8,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Pulp+Fiction",
    genres: ["Crime", "Drama"],
  },
  godfather: {
    id: "godfather",
    title: "The Godfather",
    year: 1972,
    rating: 4.9,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Godfather",
    genres: ["Crime", "Drama"],
  },
  "fight-club": {
    id: "fight-club",
    title: "Fight Club",
    year: 1999,
    rating: 4.8,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Fight+Club",
    genres: ["Drama", "Thriller"],
  },
  matrix: {
    id: "matrix",
    title: "The Matrix",
    year: 1999,
    rating: 4.7,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Matrix",
    genres: ["Ficção Científica", "Ação"],
  },
  goodfellas: {
    id: "goodfellas",
    title: "Goodfellas",
    year: 1990,
    rating: 4.7,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Goodfellas",
    genres: ["Crime", "Drama", "Biografia"],
  },
  shawshank: {
    id: "shawshank",
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 4.9,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Shawshank",
    genres: ["Drama", "Crime"],
  },
  parasite: {
    id: "parasite",
    title: "Parasite",
    year: 2019,
    rating: 4.6,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Parasite",
    genres: ["Thriller", "Drama", "Comédia"],
  },
  joker: {
    id: "joker",
    title: "Joker",
    year: 2019,
    rating: 4.5,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Joker",
    genres: ["Crime", "Drama", "Thriller"],
  },
  avengers: {
    id: "avengers",
    title: "Avengers: Endgame",
    year: 2019,
    rating: 4.7,
    posterUrl: "/placeholder.svg?height=300&width=200&text=Avengers",
    genres: ["Ação", "Aventura", "Ficção Científica"],
  },
}

// Mock user data
const mockUsers: Record<string, User> = {
  "1": {
    id: "1",
    name: "Maria Silva",
    username: "mariacinefila",
    email: "maria@example.com",
    bio: "Cinéfila apaixonada | Crítica Amadora | Colecionadora de Filmes Clássicos",
    avatar: "/placeholder.svg?height=160&width=160&text=MS",
    stats: {
      watched: 271,
      reviews: 213,
      lists: 13,
      followers: 10,
      following: 30,
    },
    movies: {
      watched: [
        mockMovies["interstellar"],
        mockMovies["dark-knight"],
        mockMovies["inception"],
        mockMovies["pulp-fiction"],
        mockMovies["godfather"],
        mockMovies["fight-club"],
        mockMovies["matrix"],
        mockMovies["goodfellas"],
        mockMovies["shawshank"],
        mockMovies["parasite"],
        mockMovies["joker"],
        mockMovies["avengers"],
      ],
      favorites: [
        mockMovies["interstellar"],
        mockMovies["dark-knight"],
        mockMovies["inception"],
        mockMovies["pulp-fiction"],
        mockMovies["godfather"],
        mockMovies["fight-club"],
        mockMovies["matrix"],
        mockMovies["shawshank"],
      ],
      watchLater: [
        mockMovies["parasite"],
        mockMovies["joker"],
        mockMovies["avengers"],
        mockMovies["goodfellas"],
        mockMovies["matrix"],
        mockMovies["fight-club"],
      ],
    },
    reviews: [
      {
        id: "1",
        movie: mockMovies["interstellar"],
        rating: 5,
        content:
          "Uma obra-prima do cinema moderno. Christopher Nolan consegue misturar ciência e emoção de uma forma única.",
        date: "2023-05-15",
      },
      {
        id: "2",
        movie: mockMovies["dark-knight"],
        rating: 5,
        content: "Heath Ledger entrega a melhor performance de um vilão da história do cinema. Filme perfeito.",
        date: "2023-04-10",
      },
      {
        id: "3",
        movie: mockMovies["inception"],
        rating: 4,
        content: "Complexo, visualmente deslumbrante e com uma narrativa que te faz pensar por dias.",
        date: "2023-03-22",
      },
      {
        id: "4",
        movie: mockMovies["pulp-fiction"],
        rating: 5,
        content:
          "Tarantino no seu melhor. Diálogos afiados, personagens memoráveis e uma estrutura narrativa inovadora.",
        date: "2023-02-05",
      },
      {
        id: "5",
        movie: mockMovies["parasite"],
        rating: 5,
        content: "Uma crítica social brilhante embalada em um thriller impecável. Mereceu todos os prêmios que ganhou.",
        date: "2023-01-18",
      },
    ],
  },
  "2": {
    id: "2",
    name: "João Pereira",
    username: "joaocinema",
    email: "joao@example.com",
    bio: "Diretor de cinema independente | Amante de filmes de terror | Estudante de cinema",
    avatar: "/placeholder.svg?height=160&width=160&text=JP",
    stats: {
      watched: 423,
      reviews: 156,
      lists: 8,
      followers: 25,
      following: 12,
    },
    movies: {
      watched: [
        mockMovies["pulp-fiction"],
        mockMovies["fight-club"],
        mockMovies["matrix"],
        mockMovies["goodfellas"],
        mockMovies["shawshank"],
        mockMovies["parasite"],
      ],
      favorites: [mockMovies["pulp-fiction"], mockMovies["fight-club"], mockMovies["matrix"], mockMovies["goodfellas"]],
      watchLater: [mockMovies["interstellar"], mockMovies["dark-knight"], mockMovies["inception"]],
    },
    reviews: [
      {
        id: "1",
        movie: mockMovies["pulp-fiction"],
        rating: 5,
        content: "O filme que me fez querer ser diretor. Cada cena é uma aula de cinema.",
        date: "2023-06-20",
      },
      {
        id: "2",
        movie: mockMovies["fight-club"],
        rating: 5,
        content: "Um filme que melhora a cada vez que você assiste. Cheio de camadas e simbolismos.",
        date: "2023-05-12",
      },
      {
        id: "3",
        movie: mockMovies["matrix"],
        rating: 4,
        content: "Revolucionou os efeitos especiais e trouxe conceitos filosóficos profundos para o mainstream.",
        date: "2023-04-05",
      },
    ],
  },
  "3": {
    id: "3",
    name: "Ana Souza",
    username: "anafilmes",
    email: "ana@example.com",
    bio: "Crítica de cinema | Podcaster | Especialista em cinema nacional",
    avatar: "/placeholder.svg?height=160&width=160&text=AS",
    stats: {
      watched: 512,
      reviews: 302,
      lists: 21,
      followers: 150,
      following: 45,
    },
    movies: {
      watched: [
        mockMovies["parasite"],
        mockMovies["joker"],
        mockMovies["avengers"],
        mockMovies["interstellar"],
        mockMovies["inception"],
      ],
      favorites: [mockMovies["parasite"], mockMovies["joker"], mockMovies["interstellar"]],
      watchLater: [mockMovies["dark-knight"], mockMovies["godfather"], mockMovies["shawshank"]],
    },
    reviews: [
      {
        id: "1",
        movie: mockMovies["parasite"],
        rating: 5,
        content: "Bong Joon-ho criou uma obra-prima que transcende gêneros e fronteiras culturais.",
        date: "2023-07-15",
      },
      {
        id: "2",
        movie: mockMovies["joker"],
        rating: 4,
        content: "Joaquin Phoenix entrega uma performance perturbadora e hipnotizante.",
        date: "2023-06-22",
      },
      {
        id: "3",
        movie: mockMovies["interstellar"],
        rating: 5,
        content: "Uma experiência cinematográfica que combina ciência, filosofia e emoção de forma magistral.",
        date: "2023-05-10",
      },
    ],
  },
}

// Helper functions to get data
export function getUserById(id: string): User | null {
  return mockUsers[id] || null
}

export function getMovieById(id: string): Movie | null {
  return mockMovies[id] || null
}

export function getAllUsers(): User[] {
  return Object.values(mockUsers)
}

export function getAllMovies(): Movie[] {
  return Object.values(mockMovies)
}

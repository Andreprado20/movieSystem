import type { Notification } from "@/components/notifications"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 10)

// Create mock notifications
export const mockNotifications: Notification[] = [
  {
    id: generateId(),
    type: "like",
    message: "João curtiu sua avaliação de 'Oppenheimer'",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    link: "/filme/1",
  },
  {
    id: generateId(),
    type: "comment",
    message: "Maria comentou em sua avaliação de 'Barbie'",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    link: "/filme/2",
  },
  {
    id: generateId(),
    type: "follow",
    message: "Pedro começou a seguir você",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    link: "/perfil/2",
  },
  {
    id: generateId(),
    type: "recommendation",
    message: "Temos novas recomendações de filmes para você",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    link: "/home",
  },
  {
    id: generateId(),
    type: "watch",
    message: "'Duna: Parte 2' que está em sua lista já está disponível",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    link: "/filme/3",
  },
  {
    id: generateId(),
    type: "system",
    message: "Bem-vindo ao CineMatch! Complete seu perfil para melhores recomendações",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    link: "/perfil/1",
  },
]

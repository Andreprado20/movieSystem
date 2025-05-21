export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: "message" | "friend" | "system" | "movie"
  link?: string
}

export function getNotifications(): Notification[] {
  return [
    {
      id: "1",
      title: "Nova mensagem",
      message: "João enviou uma mensagem para você",
      timestamp: "2023-05-15T14:30:00Z",
      read: false,
      type: "message",
      link: "/chat/1",
    },
    {
      id: "2",
      title: "Solicitação de amizade",
      message: "Maria quer ser sua amiga",
      timestamp: "2023-05-14T10:15:00Z",
      read: false,
      type: "friend",
      link: "/perfil/2",
    },
    {
      id: "3",
      title: "Lembrete de filme",
      message: "O filme 'Inception' será exibido hoje às 20h",
      timestamp: "2023-05-13T08:45:00Z",
      read: true,
      type: "movie",
      link: "/filme/1",
    },
    {
      id: "4",
      title: "Atualização do sistema",
      message: "Novas funcionalidades foram adicionadas ao CineMatch",
      timestamp: "2023-05-12T16:20:00Z",
      read: true,
      type: "system",
    },
  ]
}

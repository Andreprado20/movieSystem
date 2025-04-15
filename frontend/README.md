
# CineMatch

![CineMatch Logo](public/logo.png)

## 📝 Sobre o Projeto

CineMatch é uma plataforma social para amantes de cinema compartilharem experiências, avaliações e organizarem eventos de exibição. O aplicativo permite que os usuários criem perfis, acompanhem filmes assistidos, façam críticas, participem de comunidades e interajam com outros cinéfilos.

## ✨ Funcionalidades

### 🏠 Página Inicial
- Recomendações personalizadas de filmes
- Sugestões baseadas em comunidades
- Filmes mais bem avaliados
- Recomendações baseadas no histórico de visualização

### 👤 Perfil de Usuário
- Exibição de filmes assistidos
- Lista de favoritos
- Lista de "assistir depois"
- Críticas publicadas
- Estatísticas de visualização
- Seguidores e seguindo

### 🎬 Página de Filme
- Informações detalhadas sobre o filme
- Elenco e equipe técnica
- Avaliações e comentários de usuários
- Opções para marcar como assistido, favorito ou assistir depois
- Compartilhamento e agendamento de sessões

### 📅 Calendário
- Visualização de eventos de exibição
- Criação de novos eventos
- Participação em eventos da comunidade
- Organização de maratonas de filmes

### 👥 Comunidades
- Grupos temáticos de discussão
- Recomendações da comunidade
- Eventos compartilhados
- Interação entre membros

### 💬 Chat
- Conversas privadas entre usuários
- Chats em grupo para comunidades
- Discussões sobre filmes específicos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js, React, TypeScript
- **Estilização**: Tailwind CSS, Shadcn/UI
- **Roteamento**: Next.js App Router
- **Gerenciamento de Estado**: React Hooks
- **Ícones**: Lucide React
- **Linting**: ESLint

## 📁 Estrutura do Projeto

```
cinematch/
├── public/               # Arquivos estáticos
├── src/
│   ├── app/              # Rotas da aplicação (App Router)
│   │   ├── calendario/   # Página de calendário
│   │   ├── chat/         # Página de chat
│   │   ├── comunidades/  # Página de comunidades
│   │   ├── faq/          # Página de perguntas frequentes
│   │   ├── filme/        # Página de detalhes do filme
│   │   ├── perfil/       # Página de perfil do usuário
│   │   ├── globals.css   # Estilos globais
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Página inicial
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/           # Componentes de UI (shadcn)
│   │   ├── header.tsx    # Componente de cabeçalho
│   │   ├── sidebar.tsx   # Barra lateral
│   │   └── movie-card.tsx # Card de filme
│   ├── lib/              # Funções utilitárias
│   └── hooks/            # React hooks personalizados
├── eslint.config.js      # Configuração do ESLint
├── next.config.mjs       # Configuração do Next.js
├── package.json          # Dependências do projeto
├── tailwind.config.ts    # Configuração do Tailwind CSS
└── tsconfig.json         # Configuração do TypeScript
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18.0.0 ou superior
- npm ou yarn

### Passos para instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/cinematch.git
   cd cinematch
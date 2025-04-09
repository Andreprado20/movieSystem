"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItem {
  question: string
  answer: string
  isOpen: boolean
}

export default function FAQPage() {
  const router = useRouter()
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: "Como criar uma conta no CineMatch?",
      answer:
        "Para criar uma conta no CineMatch, clique no botão 'Cadastrar' na página inicial. Preencha o formulário com seu nome, e-mail e senha. Você também pode se cadastrar usando sua conta do Google ou Facebook.",
      isOpen: false,
    },
    {
      question: "Como adicionar um filme à minha lista de 'Assistidos'?",
      answer:
        "Para adicionar um filme à sua lista de 'Assistidos', navegue até a página do filme e clique no botão 'Marcar como assistido'. O filme será automaticamente adicionado à sua lista de filmes assistidos.",
      isOpen: false,
    },
    {
      question: "Como criar uma comunidade?",
      answer:
        "Para criar uma comunidade, acesse a seção 'Comunidades' no menu principal e clique em 'Criar nova comunidade'. Defina um nome, descrição e configurações de privacidade para sua comunidade.",
      isOpen: false,
    },
    {
      question: "Como avaliar um filme?",
      answer:
        "Para avaliar um filme, acesse a página do filme e clique no botão 'Avaliar'. Você pode dar uma nota de 1 a 5 estrelas e adicionar uma crítica textual opcional.",
      isOpen: false,
    },
    {
      question: "Como participar de um evento de exibição?",
      answer:
        "Para participar de um evento de exibição, acesse a seção 'Calendário' e encontre o evento desejado. Clique no evento e depois no botão 'Participar'. Você receberá notificações sobre o evento.",
      isOpen: false,
    },
    {
      question: "Posso assistir filmes diretamente no CineMatch?",
      answer:
        "O CineMatch não oferece streaming de filmes diretamente. Somos uma plataforma social para amantes de cinema compartilharem experiências, avaliações e organizarem eventos de exibição.",
      isOpen: false,
    },
    {
      question: "Como alterar minhas configurações de privacidade?",
      answer:
        "Para alterar suas configurações de privacidade, acesse seu perfil e clique no ícone de engrenagem (configurações). Na seção 'Privacidade', você pode ajustar quem pode ver seu perfil, suas avaliações e listas.",
      isOpen: false,
    },
    {
      question: "Como recuperar minha senha?",
      answer:
        "Se esqueceu sua senha, clique em 'Esqueci minha senha' na tela de login. Insira o e-mail associado à sua conta e enviaremos instruções para redefinir sua senha.",
      isOpen: false,
    },
  ])

  const toggleFAQ = (index: number) => {
    const updatedFAQs = [...faqItems]
    updatedFAQs[index].isOpen = !updatedFAQs[index].isOpen
    setFaqItems(updatedFAQs)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <Button variant="secondary" className="bg-gray-600 hover:bg-gray-700" onClick={() => router.back()}>
            Voltar
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h1>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="p-4 flex justify-between items-center">
                <h3 className="font-medium text-lg">{item.question}</h3>
                <div className="text-gray-400">
                  {item.isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
              {item.isOpen && (
                <div className="px-4 pb-4 text-gray-300">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

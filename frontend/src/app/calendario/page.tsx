"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("Março")
  const [currentYear, setCurrentYear] = useState(2025)

  // Sample calendar data
  const calendarDays = [
    { day: null, hasEvent: false },
    { day: null, hasEvent: false },
    { day: null, hasEvent: false },
    { day: null, hasEvent: false },
    { day: null, hasEvent: false },
    { day: null, hasEvent: false },
    { day: 1, hasEvent: false },
    { day: 2, hasEvent: false },
    { day: 3, hasEvent: false },
    { day: 4, hasEvent: false },
    { day: 5, hasEvent: false },
    { day: 6, hasEvent: false },
    { day: 7, hasEvent: true },
    { day: 8, hasEvent: false },
    { day: 9, hasEvent: false },
    { day: 10, hasEvent: false },
    { day: 11, hasEvent: false },
    { day: 12, hasEvent: false },
    { day: 13, hasEvent: true },
    { day: 14, hasEvent: false },
    { day: 15, hasEvent: false },
    { day: 16, hasEvent: false },
    { day: 17, hasEvent: false },
    { day: 18, hasEvent: false },
    { day: 19, hasEvent: false },
    { day: 20, hasEvent: false },
    { day: 21, hasEvent: false },
    { day: 22, hasEvent: false },
    { day: 23, hasEvent: false },
    { day: 24, hasEvent: false },
    { day: 25, hasEvent: false },
    { day: 26, hasEvent: true },
    { day: 27, hasEvent: false },
    { day: 28, hasEvent: false },
    { day: 29, hasEvent: false },
    { day: 30, hasEvent: false },
    { day: 31, hasEvent: false },
  ]

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Maratona Star Wars",
      date: "31/04/2025",
      time: "18:00",
      type: "Evento Virtual",
      participants: 12,
      organizer: "Roberto Bostos",
      image: "/placeholder.svg?height=80&width=80&text=SW",
    },
    {
      id: 2,
      title: "Maratona Star Wars",
      date: "31/04/2025",
      time: "18:00",
      type: "Evento Virtual",
      participants: 12,
      organizer: "Roberto Bostos",
      image: "/placeholder.svg?height=80&width=80&text=SW",
    },
    {
      id: 3,
      title: "Maratona Star Wars",
      date: "31/04/2025",
      time: "18:00",
      type: "Evento Virtual",
      participants: 12,
      organizer: "Roberto Bostos",
      image: "/placeholder.svg?height=80&width=80&text=SW",
    },
  ]

  const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  const previousMonth = () => {
    // In a real app, this would handle actual date logic
    setCurrentMonth("Fevereiro")
  }

  const nextMonth = () => {
    // In a real app, this would handle actual date logic
    setCurrentMonth("Abril")
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-12">
        <div className="flex justify-end mb-8">
          <Button className="bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo evento
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Section */}
          <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                {currentMonth} {currentYear}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full border-gray-600" onClick={previousMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-600" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Weekday Headers */}
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs md:text-sm text-gray-400 py-2">
                  {day.substring(0, 3)}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square border border-gray-700 p-1 md:p-2 ${
                    day?.day ? "bg-gray-800/30" : "bg-transparent"
                  }`}
                >
                  {day?.day && (
                    <div className="h-full">
                      <div className="text-sm md:text-lg">{day.day}</div>
                      {day.hasEvent && (
                        <div className="mt-auto">
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Evento</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div className="w-full lg:w-96 space-y-8">
            {/* Upcoming Events */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Proximos Eventos</h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{event.title}</h3>
                          <p className="text-sm text-gray-300">
                            {event.date} às {event.time}
                          </p>
                          <p className="text-sm text-gray-300">{event.type}</p>
                          <p className="text-sm text-gray-300">{event.participants} Participantes</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage src="/avatar-roberto.png" alt="Roberto Bostos" />
                            <AvatarFallback className="bg-gray-600 text-xs">RB</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-300 truncate">Organizado por {event.organizer}</span>
                        </div>
                        <Button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 h-auto">
                          Participar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Events */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Seus Eventos</h2>
              <div className="bg-gray-800/50 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Calendar className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Sem Eventos</h3>
                  <p className="text-gray-400 mb-6">Você ainda não possui eventos</p>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">Criar Evento</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

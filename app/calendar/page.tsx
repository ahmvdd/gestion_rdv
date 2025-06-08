"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: string
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  status: string
}

export default function CalendarPage() {
  const { token } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchAppointments()
    }
  }, [token, currentDate])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const appointmentsData = await response.json()
        setAppointments(appointmentsData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Planifié"
      case "COMPLETED":
        return "Terminé"
      case "CANCELLED":
        return "Annulé"
      default:
        return status
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      days.push({ date: currentDate, isCurrentMonth: true })
    }

    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({ date: nextDate, isCurrentMonth: false })
    }

    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return appointments.filter((appointment) => appointment.date.split("T")[0] === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
                <p className="mt-2 text-gray-600">Vue d'ensemble de vos rendez-vous</p>
              </div>
              <Link href="/appointments/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau rendez-vous
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{monthYear}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                      Aujourd'hui
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {/* En-têtes des jours */}
                    {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}

                    {/* Jours du calendrier */}
                    {days.map((day, index) => {
                      const dayAppointments = getAppointmentsForDate(day.date)
                      const isToday = day.date.toDateString() === new Date().toDateString()

                      return (
                        <div
                          key={index}
                          className={`min-h-[100px] p-2 border border-gray-200 ${
                            day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                          } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                        >
                          <div
                            className={`text-sm font-medium mb-1 ${
                              day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                            } ${isToday ? "text-blue-600" : ""}`}
                          >
                            {day.date.getDate()}
                          </div>

                          <div className="space-y-1">
                            {dayAppointments.slice(0, 2).map((appointment) => (
                              <Link
                                key={appointment.id}
                                href={`/appointments/${appointment.id}/edit`}
                                className="block"
                              >
                                <div className="text-xs p-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer truncate">
                                  {formatTime(appointment.startTime)} {appointment.title}
                                </div>
                              </Link>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className="text-xs text-gray-500">+{dayAppointments.length - 2} autres</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Liste des rendez-vous du jour sélectionné */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Rendez-vous à venir</CardTitle>
                <CardDescription>Vos prochains rendez-vous planifiés</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments
                  .filter((appointment) => new Date(appointment.date) >= new Date())
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .slice(0, 5)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 mb-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{appointment.title}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                        {appointment.description && (
                          <p className="mt-1 text-sm text-gray-600">{appointment.description}</p>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(appointment.date).toLocaleDateString("fr-FR")}
                          <Clock className="h-4 w-4 ml-4 mr-1" />
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </div>
                      </div>
                      <Link href={`/appointments/${appointment.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                      </Link>
                    </div>
                  ))}

                {appointments.filter((appointment) => new Date(appointment.date) >= new Date()).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous à venir</h3>
                    <p className="mt-1 text-sm text-gray-500">Planifiez votre prochain rendez-vous</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Appointment {
  id: string
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  status: string
}

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/welcome")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchTodayAppointments()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const response = await fetch(`/api/appointments?date=${today}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.ok) {
        const appointments = await response.json()
        setTodayAppointments(appointments)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-2 text-gray-600">Bienvenue ! Voici vos rendez-vous d'aujourd'hui.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rendez-vous aujourd'hui</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prochain rendez-vous</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {todayAppointments.length > 0 ? formatTime(todayAppointments[0].startTime) : "Aucun"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actions rapides</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href="/appointments/new">
                  <Button className="w-full">Nouveau rendez-vous</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous d'aujourd'hui</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous aujourd'hui</h3>
                  <p className="mt-1 text-sm text-gray-500">Profitez de votre journée libre !</p>
                  <div className="mt-6">
                    <Link href="/appointments/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un rendez-vous
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
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
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/appointments/${appointment.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
